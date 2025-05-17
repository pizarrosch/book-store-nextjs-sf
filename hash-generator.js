const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Zaurskillfactory';
  const hashedPassword = await bcrypt.hash(password, 12);
  console.log(`Password: ${password}`);
  console.log(`Hashed Password: ${hashedPassword}`);
}

generateHash();