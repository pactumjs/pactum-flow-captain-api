const express = require('express');
const rate_limit = require("express-rate-limit");
const http = require('http');
const mongoose = require('mongoose');
require('loglevel').setLevel('INFO')

const seeds = require('./seeds');

const config = require('./config');

const logger_middleware = require('./middleware/logger.middleware');
const swaggerMiddleware = require('./middleware/swagger.middleware');

class App {

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  async init() {
    this.handleInterruptions();
    await this.initDatabase();
    await this.initMiddleware();
    await seeds.run();
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
    this.app.use(logger_middleware);
    this.app.use(express.json());
    this.app.use('/api/flow/captain/v1/session', rate_limit(config.auth_rate_limit_options));
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