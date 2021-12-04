const Users = require('../models/user.model');

class UserRepository {

  async get(query) {
    return Users.find(query, {}, { lean: true });
  }

  async getByUserName(username) {
    return Users.findOne({ username }, {}, { lean: true });
  }

  async save(data) {
    const user = new Users(data);
    const doc = await user.save();
    return doc.toObject();
  }

  update(user) {
    return Users.findOneAndUpdate({ username: user.username }, user);
  }

  delete(username) {
    return Users.deleteOne({ username: username });
  }

  updateProcess(username, data) {
    return Users.updateOne({ username }, { $set: data }, { lean: true });
  }

}

module.exports = UserRepository;