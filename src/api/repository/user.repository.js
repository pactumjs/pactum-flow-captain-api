const Users = require('../models/user.model');

class UserRepository {

  async get(query) {
    return Users.find(query);
  }

  async getByUserName(username) {
    return Users.findOne({username}, {}, {lean:true});
  }

  async save(data) {
    const user = new Users(data);
    const doc = await user.save();
    return doc.toObject();
  }

  delete(username) {
    return Users.deleteOne({ username: username });
  }

  updateProcess(username, data) {
    return Users.updateOne({ username }, { $set: data });
  }

}

module.exports = UserRepository;