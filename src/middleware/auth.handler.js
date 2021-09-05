function handler(req, _, __, cb) {
  const auth = req.headers['authorization'];
  if (!auth || auth.indexOf('Basic ') === -1) {
    cb(new Error('Missing Authorization Header'));
  }
  cb();
}

module.exports = handler;