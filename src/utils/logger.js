var log = require('loglevel');

class Logger {

  constructor(id) {
    this.id = id;
    this.user = 'unauthorized_user';
  }

  info(...msg) {
    log.info(this.id, this.user, " - ", ...msg);
  }
  
}

module.exports = Logger;