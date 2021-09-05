const crypto = require('crypto');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const mm = require('migrate-mongo');

const config = require('./config');

const swaggerMiddleware = require('./middleware/swagger.middleware');

class App {

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  async runMigrations() {
    mm.config.set({
      mongodb: {
        url: `mongodb://${config.mongo.host}:${config.mongo.port}`,
        databaseName: config.mongo.name,
        options: config.mongo.options,

      },
      migrationsDir: "./src/migrations",
      changelogCollectionName: "migrations",
      migrationFileExtension: ".js"
    });
    const { db, client } = await mm.database.connect();
    try {
      console.log(`Running UP Migrations`);
      const migratedScripts = await mm.up(db, client);
      migratedScripts.forEach(fileName => console.log('Migrated:', fileName));
    } catch (error) {
      console.log('Unable to run up-migrations');
      console.log(error);
      console.log(`Running Down Migrations`);
      const migratedDown = await mm.down(db, client);
      migratedDown.forEach(fileName => console.log('Migrated Down:', fileName));
    } finally {
      const migrationStatus = await mm.status(db);
      console.log(`Migration Status:`);
      const migrations = [];
      migrationStatus.forEach(({ fileName, appliedAt }) => migrations.push({ fileName, appliedAt }));
      console.table(migrations);
      await client.close();
    }
  }

  async init() {
    this.handleInterruptions();
    await this.runMigrations();
    await this.initDatabase();
    await this.initMiddleware();
  }

  handleInterruptions() {
    process.on('SIGINT', async function () {
      await closeDatabaseConnection();
      process.exit();
    });
  }

  async initDatabase() {
    const { mongo } = config;
    const cs = `'mongodb://${mongo.host}:${mongo.port}/${mongo.name}`;
    await mongoose.connect(cs, config.mongo.options);
    console.log('Database connection created');
  }

  async initMiddleware() {
    this.app.use(express.json());
    await swaggerMiddleware.init(this.app, __dirname);
  }

  async start() {
    try {
      await this.init();
      this.server.listen(3001);
      console.log('Pactum Flow Captain API Server started on port 3001');
    } catch (error) {
      console.log(error);
      await this.stop();
    }
  }

  async stop() {
    try {
      await closeDatabaseConnection();
      this.server.close();
      console.log('Server stopped');
    } catch (error) {
      console.log(error);
    }
  }

}

async function closeDatabaseConnection() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

module.exports = App;