const bcrypt = require('bcryptjs');

module.exports = {

  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const date = new Date();
        const admin = { "username": "admin", "role": "admin", "password": bcrypt.hashSync('admin', 8), "createdAt": date };
        const viewer = { "username": "viewer", "role": "viewer", "password": bcrypt.hashSync('viewer', 8), "createdAt": date };
        const scanner = { "username": "scanner", "role": "scanner", "password": bcrypt.hashSync('scanner', 8), "createdAt": date };
        await db.collection('users').updateOne({ username: "admin" }, { $set: admin }, { upsert: true });
        await db.collection('users').updateOne({ username: "viewer" }, { $set: viewer }, { upsert: true });
        await db.collection('users').updateOne({ username: "scanner" }, { $set: scanner }, { upsert: true });
      });
    } finally {
      await session.endSession();
    }
  },

  async down(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('users').deleteMany({ username: "admin" });
        await db.collection('users').deleteMany({ username: "viewer" });
        await db.collection('users').deleteMany({ username: "scanner" });
      });
    } finally {
      await session.endSession();
    }
  }
};
