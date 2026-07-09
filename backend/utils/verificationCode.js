const crypto = require('crypto');

const CODE_TTL_MINUTES = 10;

function generateVerificationCode() {
  // 6-digit numeric code, e.g. "042817"
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
}

function getExpiryDate() {
  return new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);
}

module.exports = { generateVerificationCode, getExpiryDate, CODE_TTL_MINUTES };