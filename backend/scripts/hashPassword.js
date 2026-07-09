const bcrypt = require('bcrypt');

const password = process.argv[2];
if (!password) {
  console.log('Usage: node scripts/hashPassword.js <admin123>');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log(hash);
});