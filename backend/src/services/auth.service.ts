import bcrypt from 'bcrypt';
import { getAuth } from 'firebase-admin/auth';
import firebaseApp from '../config/firebaseAdmin';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { userRepository } from '../repositories/user.repository';
import { PublicUser } from '../types/user.types';
import { signUserToken } from '../utils/jwt';
import { sendVerificationEmail } from '../utils/mailer';
import { generateVerificationCode, getExpiryDate } from '../utils/verificationCode';

const SALT_ROUNDS = 10;

export interface RegisterInput {
  firstName: string;
  lastName: string;
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
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  provider?: string | null;
}): PublicUser {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    provider: user.provider ?? 'local',
  };
}

export const authService = {
  async register(input: RegisterInput): Promise<RegisterResult> {
    const existing = await userRepository.findByEmail(input.email);

    if (existing && existing.is_verified) {
      throw new AppError(409, 'An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const code = generateVerificationCode();
    const expires = getExpiryDate();

    let userId: number;
    if (existing) {
      await userRepository.updateUnverifiedUser(existing.id, {
        firstName: input.firstName,
        lastName: input.lastName,
        passwordHash,
        verificationCode: code,
        verificationExpires: expires,
      });
      userId = existing.id;
    } else {
      userId = await userRepository.createUser({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
        verificationCode: code,
        verificationExpires: expires,
      });
    }

    await sendVerificationEmail(input.email, code);

    return {
      requiresVerification: true,
      user: {
        id: userId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
      },
    };
  },

  async verifyEmail(email: string, code: string): Promise<void> {
    const user = await userRepository.findVerificationFieldsByEmail(email);

    if (!user) {
      throw new AppError(404, 'No account found for this email');
    }
    if (user.is_verified) {
      throw new AppError(400, 'This account is already verified');
    }
    if (!user.verification_code || user.verification_code !== code) {
      throw new AppError(400, 'Invalid verification code');
    }
    if (user.verification_code_expires && new Date(user.verification_code_expires) < new Date()) {
      throw new AppError(400, 'This code has expired. Request a new one.');
    }

    await userRepository.markVerified(user.id);
  },

  async resendCode(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(404, 'No account found for this email');
    }
    if (user.is_verified) {
      throw new AppError(400, 'This account is already verified');
    }

    const code = generateVerificationCode();
    const expires = getExpiryDate();

    await userRepository.updateVerificationCode(user.id, code, expires);
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
    if (!user.is_verified) {
      throw new AppError(403, 'Please verify your email before signing in', {
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = signUserToken(user.id, user.email);

    return {
      token,
      user: toPublicUser(user),
    };
  },

  async googleSignIn(idToken: string): Promise<LoginResult> {
    try {
      const decoded = await getAuth(firebaseApp).verifyIdToken(idToken);
      const { email, uid, name } = decoded;

      if (!email) {
        throw new AppError(400, 'Google account must have an email');
      }

      let user = await userRepository.findByEmail(email);

      if (!user) {
        const firstName = name ? name.split(' ')[0] : '';
        const lastName = name ? name.split(' ').slice(1).join(' ') : '';

        const userId = await userRepository.createGoogleUser({
          firstName,
          lastName,
          email,
          googleUid: uid,
        });

        user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError(500, 'Failed to create Google user account');
        }
      } else if (!user.google_uid) {
        await userRepository.linkGoogleUid(user.id, uid);
        user.google_uid = uid;
      }

      const token = signUserToken(user.id, user.email);

      return {
        token,
        user: toPublicUser(user),
      };
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      if (firebaseErr.code?.startsWith('auth/')) {
        throw new AppError(401, 'Invalid Google token');
      }
      throw err;
    }
  },
};
