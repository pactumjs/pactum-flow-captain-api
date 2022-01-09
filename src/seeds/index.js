const bcrypt = require('bcryptjs');
const UserRepo = require('../api/repository/user.repository');

async function seed_users() {
  const required_default_users = ['admin', 'viewer', 'scanner'];
  const repo = new UserRepo();
  const users = await repo.get({ username: { $in: required_default_users } });
  const already_seeded_users = users.map(user => user.username);
  const unseeded_users = required_default_users.filter(user => !already_seeded_users.includes(user));
  const date = new Date();
  for (let i = 0; i < unseeded_users.length; i++) {
    const username = unseeded_users[i];
    await repo.save({ username, role: username, password: bcrypt.hashSync(username, 8), email: `${username}@localhost` , createdAt: date });
  }
  if (unseeded_users.length > 0) {
    console.log("Seeded Users");
    console.table(unseeded_users);
  } else {
    console.log("No users to seed");
  }
}

async function run() {
  await seed_users();
}

module.exports = {
  run
}