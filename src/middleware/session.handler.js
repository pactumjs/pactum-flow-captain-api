const jwt = require('jsonwebtoken');
const config = require('../config');

async function handler(req, _, __, cb) {
  const token = req.headers['x-session-token'];
  if (!token) {
    cb(new Error('x-session-token is missing in headers'));
  } else {
    try {
      const jwt_payload = jwt.verify(token, config.auth.token);
      req.auth_user = jwt_payload.session;
      req.log.user = req.auth_user.username;
      cb();
    } catch (error) {
      cb(new Error('Unauthorized'));
    }
  }
  req.log.info(req.method, req.path);
}

module.exports = handler;