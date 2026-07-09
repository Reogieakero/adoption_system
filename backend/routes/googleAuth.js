const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const admin = require('../config/firebaseAdmin');
const jwt = require('jsonwebtoken');

router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Missing idToken' });
  }

  try {
    const decoded = await getAuth(firebaseApp).verifyIdToken(idToken);
    const { email, uid, name, picture } = decoded;

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = rows[0];

    if (!user) {
      const firstName = name ? name.split(' ')[0] : '';
      const lastName = name ? name.split(' ').slice(1).join(' ') : '';

      const [result] = await pool.query(
        `INSERT INTO users (first_name, last_name, email, provider, google_uid, is_verified)
         VALUES (?, ?, ?, 'google', ?, 1)`,
        [firstName, lastName, email, uid]
      );

      const [newRows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newRows[0];
    } else if (!user.google_uid) {
      await pool.query('UPDATE users SET google_uid = ?, provider = ? WHERE id = ?', [
        uid,
        user.provider === 'local' ? 'local' : 'google',
        user.id,
      ]);
      user.google_uid = uid;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        provider: user.provider,
      },
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;