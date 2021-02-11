const crypto = require('crypto');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const {
  database,
  config,
  up,
  down,
  status
} = require('migrate-mongo');

const swaggerMiddleware = require('./middleware/swagger.middleware');

class App {

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  async mongoDbMigrations() {
    const migrationConf = {
      mongodb: {
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
        databaseName: process.env.MONGODB_NAME || 'test',

        options: {
          useNewUrlParser: true, // removes a deprecation warning when connecting
          useUnifiedTopology: true, // removes a deprecating warning when connecting
          //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
          //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
        }
      },

      // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
      migrationsDir: "./src/migrations",

      // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
      changelogCollectionName: "dbmigrations",

      // The file extension to create migrations and search for in migration dir 
      migrationFileExtension: ".js"
    };

    config.set(migrationConf);
    const { db, client } = await database.connect();
    try {
      console.log(`Running migrations`);
      const migratedScripts = await up(db, client);
      migratedScripts.forEach(fileName => console.log('Migrated:', fileName));
    } catch (error) {
      console.log(`Error occured while running up migrations: ${JSON.stringify(error)}`);
      console.log(`Running down migrations`);
      const migratedDown = await down(db, client);
      migratedDown.forEach(fileName => console.log('Migrated Down:', fileName));
    } finally {
      const migrationStatus = await status(db);
      console.log(`Migration Status:`);
      const migrations = [];
      migrationStatus.forEach(({ fileName, appliedAt }) => migrations.push({ fileName, appliedAt }));
      console.table(migrations);
      await client.close();
    }
  }

  async generateJWTSecretKey() {
    const jwtSecretKey = process.env.JWT_SECRET_KEY || crypto.randomBytes(64).toString('hex');
    console.debug(`JWT Secret Key is: ${jwtSecretKey}`);
    process.env.JWT_SECRET_KEY = jwtSecretKey;
  }

  async init() {
    this.handleInterruptions();
    await this.mongoDbMigrations();
    await this.generateJWTSecretKey();
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
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const mongoDB = process.env.MONGODB_NAME || 'test';
    const mongoDbConnectionString = `${mongoUrl}/${mongoDB}`;
    await mongoose.connect(mongoDbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
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