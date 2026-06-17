const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const app = require('./app');
const config = require('./config/config');

const uploadDir = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const usersPath = path.join(config.dataDir, 'users.json');
if (fs.existsSync(usersPath)) {
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  let changed = false;
  users.forEach((user) => {
    if (user.password.startsWith('$2a$10$8K1p')) {
      user.password = bcrypt.hashSync('passwort123', 10);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log('Demo-Passwörter gesetzt: passwort123');
  }
}

app.listen(config.port, () => {
  console.log(`${config.salonName} läuft auf http://localhost:${config.port}`);
});
