const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { validateRegister, handleValidationErrors } = require('../middleware/validateRegister');

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/register', validateRegister, handleValidationErrors, async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if email is already registered
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES (?, ?, ?, ?)`,
      [firstName, lastName, email, passwordHash]
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;