const BaseService = require('./base.service');
const bcrypt = require('bcryptjs');

class UserService extends BaseService {

  constructor(req, res) {
    super(req, res);
  }

  async getUserByName(userName) {
    return await this.$repo.users.getByUserName(userName);
  }

  async registerUser(user){
    // TODO: User registrations
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPass = bcrypt.hashSync(password, salt);
  }

}


module.exports = UserService;