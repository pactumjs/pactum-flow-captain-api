const jwt = require('jsonwebtoken');
const config = require('../config');

async function handler(req, _, __, cb) {
  const token = req.headers['x-access-token'];
  if (!token) {
    cb(new Error('x-access-token is missing in headers'));
    return;
  }
  try {
    jwt.verify(token, config.auth.token);
    cb();
  } catch (error) {
    cb(new Error('Unauthorized'));
  }
}

module.exports = handler;