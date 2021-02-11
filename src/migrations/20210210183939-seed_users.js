module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('users').updateOne({ username: "Admin" }, {
          $set:
            { "username": "Admin", "email": "", "roles": { "isAdmin": "true" }, "password": "$2a$10$Cf7Ei2xCPqzDBX7AiNUsdOYU8h7IjLMHJKZy4jlrNNuQJoyLZXYFK", "createdAt": "2021-01-10T00:03:29.658Z" }
        },
          { upsert: true });

        await db.collection('users').updateOne({ username: "PactumUser" }, {
          $set:
            { "username": "PactumUser", "email": "", "roles": { "isAdmin": "false" }, "password": "$2a$10$v78e6KDAqZ7N7IfWyPgJnuma5vy9jZ0jq0lzbcNwE3kIPbJg6SX2m", "createdAt": "2021-01-10T00:03:29.658Z" }
        },
          { upsert: true });
      });
    } finally {
      await session.endSession();
    }
  },

  async down(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('users').deleteMany({ username: "Admin" });
        await db.collection('users').deleteMany({ username: "PactumUser" });
      });
    } finally {
      await session.endSession();
    }
  }
};
