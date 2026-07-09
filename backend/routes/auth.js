const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { validateRegister, handleValidationErrors } = require('../middleware/validateRegister');
const { sendVerificationEmail } = require('../utils/mailer');
const { generateVerificationCode, getExpiryDate } = require('../utils/verificationCode');

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/register', validateRegister, handleValidationErrors, async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if email is already registered
    const [existingRows] = await pool.query(
      'SELECT id, is_verified FROM users WHERE email = ?',
      [email]
    );
    const existing = existingRows[0];

    // Only a verified account blocks re-registration. An unverified record
    // (e.g. someone who signed up but never entered their code) is treated
    // as a fresh signup attempt below, so the response never reveals that
    // an unverified email is already taken.
    if (existing && existing.is_verified) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const code = generateVerificationCode();
    const expires = getExpiryDate();

    let userId;
    if (existing) {
      await pool.query(
        `UPDATE users
         SET first_name = ?, last_name = ?, password_hash = ?, verification_code = ?, verification_code_expires = ?
         WHERE id = ?`,
        [firstName, lastName, passwordHash, code, expires, existing.id]
      );
      userId = existing.id;
    } else {
      const [result] = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, is_verified, verification_code, verification_code_expires)
         VALUES (?, ?, ?, ?, FALSE, ?, ?)`,
        [firstName, lastName, email, passwordHash, code, expires]
      );
      userId = result.insertId;
    }

    await sendVerificationEmail(email, code);

    res.status(201).json({
      success: true,
      requiresVerification: true,
      message: 'Verification code sent to your email',
      user: {
        id: userId,
        firstName,
        lastName,
        email,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/verify-email', async (req, res, next) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email and code are required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, is_verified, verification_code, verification_code_expires FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found for this email' });
    }
    if (user.is_verified) {
      return res.status(400).json({ success: false, message: 'This account is already verified' });
    }
    if (!user.verification_code || user.verification_code !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }
    if (new Date(user.verification_code_expires) < new Date()) {
      return res.status(400).json({ success: false, message: 'This code has expired. Request a new one.' });
    }

    await pool.query(
      `UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_code_expires = NULL WHERE id = ?`,
      [user.id]
    );

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/resend-code', async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const [rows] = await pool.query('SELECT id, is_verified FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found for this email' });
    }
    if (user.is_verified) {
      return res.status(400).json({ success: false, message: 'This account is already verified' });
    }

    const code = generateVerificationCode();
    const expires = getExpiryDate();

    await pool.query(
      'UPDATE users SET verification_code = ?, verification_code_expires = ? WHERE id = ?',
      [code, expires, user.id]
    );

    await sendVerificationEmail(email, code);

    res.json({ success: true, message: 'A new code has been sent to your email' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;