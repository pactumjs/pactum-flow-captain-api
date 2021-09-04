const Sessions = require('../models/session.model');

class SessionRepository {

  getUserSessionByName(userName) {
    return Sessions.findOne({ username: userName }, null, {lean:true});
  }

  getUserSession(query) {
    return Sessions.find(query, null, {lean:true});
  }

  async save(data) {
    const userSession = new Sessions(data);
    const doc = await userSession.save();
    return doc;
  }

  async revokeSession(userName) {
    let isRevoked = false;
    try {
      const resp = await Sessions.deleteMany({username: userName});
      isRevoked = true;
    } catch (err) {
      console.log("Error occured during deletion")
    }
    return isRevoked;
  }

  async removeAllSessions() {
    try {
      await Sessions.remove({});
    } catch (err) {
      console.log("Error occured during deletion: " + err)
    }
  }

}

module.exports = SessionRepository;