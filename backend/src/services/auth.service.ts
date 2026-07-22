import bcrypt from 'bcrypt';
import { getAuth } from 'firebase-admin/auth';
import pool from '../config/db';
import firebaseApp from '../config/firebaseAdmin';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { userRepository } from '../repositories/user.repository';
import { PublicUser } from '../types/user.types';
import { signUserToken, signPendingGoogleToken, verifyPendingGoogleToken } from '../utils/jwt';
import { sendVerificationEmail } from '../utils/mailer';
import { generateVerificationCode, getExpiryDate } from '../utils/verificationCode';
import type { PendingGooglePayload } from '../utils/jwt';

const SALT_ROUNDS = 10;

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  user: PublicUser;
  requiresVerification: true;
}

export interface LoginResult {
  token: string;
  user: PublicUser;
}

function toPublicUser(user: {
  user_id: number;
  full_name: string;
  email: string;
  auth_provider?: string | null;
}): PublicUser {
  return {
    id: user.user_id,
    fullName: user.full_name,
    email: user.email,
    authProvider: user.auth_provider ?? 'local',
  };
}

export const authService = {
  async register(input: RegisterInput): Promise<RegisterResult> {
    const existing = await userRepository.findByEmail(input.email);

    if (existing && existing.email_verified) {
      throw new AppError(409, 'An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const code = generateVerificationCode();
    const expires = getExpiryDate();

    let userId: number;
    if (existing) {
      userId = existing.user_id;
      await pool.query(
        'UPDATE users SET full_name = ?, password_hash = ? WHERE user_id = ?',
        [input.fullName, passwordHash, userId]
      );
    } else {
      userId = await userRepository.createUser({
        fullName: input.fullName,
        email: input.email,
        passwordHash,
        verificationCode: code,
        verificationExpires: expires,
      });
    }

    await userRepository.createVerificationCode(userId, code, 'registration', expires);
    await sendVerificationEmail(input.email, code);

    return {
      requiresVerification: true,
      user: {
        id: userId,
        fullName: input.fullName,
        email: input.email,
      },
    };
  },

  async verifyEmail(email: string, code: string): Promise<void> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(404, 'No account found for this email');
    }
    if (user.email_verified) {
      throw new AppError(400, 'This account is already verified');
    }

    const validCode = await userRepository.findValidVerificationCode(user.user_id, code, 'registration');
    if (!validCode) {
      throw new AppError(400, 'Invalid or expired verification code');
    }

    await userRepository.markVerificationCodeUsed(validCode.verification_id);
    await userRepository.markVerified(user.user_id);
  },

  async resendCode(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(404, 'No account found for this email');
    }
    if (user.email_verified) {
      throw new AppError(400, 'This account is already verified');
    }

    const code = generateVerificationCode();
    const expires = getExpiryDate();

    await userRepository.createVerificationCode(user.user_id, code, 'registration', expires);
    await sendVerificationEmail(email, code);
  },

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await userRepository.findLoginFieldsByEmail(email);

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }
    if (!user.password_hash) {
      throw new AppError(
        400,
        'This account uses Google sign-in. Continue with Google instead.'
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AppError(401, 'Invalid email or password');
    }
    if (!user.email_verified) {
      throw new AppError(403, 'Please verify your email before signing in', {
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = signUserToken(user.user_id, user.email);

    return {
      token,
      user: toPublicUser(user),
    };
  },

  async googleSignIn(
    idToken: string
  ): Promise<LoginResult | { requiresSignupCompletion: true; pendingToken: string; email: string }> {
    try {
      const decoded = await getAuth(firebaseApp).verifyIdToken(idToken);
      const { email, uid, name } = decoded;

      if (!email) {
        throw new AppError(400, 'Google account must have an email');
      }

      const user = await userRepository.findByEmail(email);

      if (user && user.status === 'active') {
        if (!user.google_id) {
          await userRepository.linkGoogleUid(user.user_id, uid);
        }

        const token = signUserToken(user.user_id, user.email);

        return {
          token,
          user: toPublicUser(user),
        };
      }

      const fullName = name ?? email.split('@')[0];

      const pendingToken = signPendingGoogleToken({
        email,
        googleUid: uid,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' '),
      });

      return {
        requiresSignupCompletion: true,
        pendingToken,
        email,
      };
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      if (firebaseErr.code?.startsWith('auth/')) {
        throw new AppError(401, 'Invalid Google token');
      }
      throw err;
    }
  },

  async completeGoogleSignUp(pendingToken: string, agreedTerms: boolean): Promise<LoginResult> {
    if (!agreedTerms) {
      throw new AppError(400, 'You must agree to the Terms of Service and Privacy Policy.');
    }

    let payload: PendingGooglePayload;
    try {
      payload = verifyPendingGoogleToken(pendingToken);
    } catch {
      throw new AppError(400, 'This sign-up link has expired. Please sign in with Google again.');
    }

    const { email, googleUid, firstName, lastName } = payload;

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      if (existing.status === 'active') {
        const token = signUserToken(existing.user_id, existing.email);
        return { token, user: toPublicUser(existing) };
      }
      await pool.query(
        `UPDATE users SET google_id = ?, auth_provider = 'google', email_verified = TRUE, status = 'active' WHERE user_id = ?`,
        [googleUid, existing.user_id]
      );
      const updated = await userRepository.findById(existing.user_id);
      const token = signUserToken(updated!.user_id, updated!.email);
      return { token, user: toPublicUser(updated!) };
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const userId = await userRepository.createGoogleUserWithAgreement({
      fullName,
      email,
      googleId: googleUid,
    });

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(500, 'Failed to create account');
    }

    const token = signUserToken(user.user_id, user.email);
    return { token, user: toPublicUser(user) };
  },
};
