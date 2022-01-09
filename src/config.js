const env = process.env;

const config = {
  mongo: {
    host: env.DB_HOST || 'localhost',
    port: env.DB_PORT || 27017,
    name: env.DB_NAME || 'pactum',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  },
  auth: {
    token: env.AUTH_TOKEN || Buffer.from('admin:admin').toString('base64')
  },
  roles: {
    ADMIN: 'admin',
    VIEWER: 'viewer',
    SCANNER: 'scanner'
  },
  auth_rate_limit_options: {
    windowMs: env.AUTH_RATE_LIMIT_WINDOW || 15 * 60 * 1000,
    max: env.AUTH_RATE_LIMIT_MAX || 100
  },
  session: {
    expiresIn: env.SESSION_EXPIRES_IN || '1d'
  },
  credValidations: {
    password: {
      minLength: parseInt(env.PASSWORD_MIN_LENGTH) || 4,
      maxLength: parseInt(env.PASSWORD_MAX_LENGTH) || 30,
      minLowerCase: parseInt(env.PASSWORD_MIN_LOWERCASE) || 0,
      minUpperCase: parseInt(env.PASSWORD_MIN_UPPERCASE) || 0,
      minDigits: parseInt(env.PASSWORD_MIN_DIGITS) || 0,
      minSymbols: parseInt(env.PASSWORD_MIN_SYMBOLS) || 0,
      blacklistedPass: ['Passw0rd', 'Password123', 'Password'] // Can add more blacklisted passwords to block
    }
  }
};

if (env.DB_USER || env.DB_PASSWORD) {
  config.mongo.options.auth = {};
  config.mongo.options.auth.user = env.DB_USER;
  config.mongo.options.auth.password = env.DB_PASSWORD;
}

if (env.DB_SSL) config.mongo.options.ssl = (env.DB_SSL === 'true');
if (env.DB_REPLICA_SET) config.mongo.options.replicaSet = env.DB_REPLICA_SET;
if (env.DB_RETRY_WRITES) config.mongo.options.retryWrites = (env.DB_RETRY_WRITES === 'true');

module.exports = config;
