const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const BaseService = require('./base.service');
const config = require('../../config');

class UserService extends BaseService {

  constructor(req, res) {
    super(req, res);
  }

  async getUserByName(userName) {
    return await this.$repo.users.getByUserName(userName);
  }

  async updateUser() {
    const jwtToken = this.req.headers['x-session-token'];
    const auth_user = jwt.verify(jwtToken, config.auth.token).session;
    const target_user = this.req.body;
    const db_target_user = await this.$repo.users.getByUserName(target_user.username);
    if (!db_target_user) {
      return this.res.status(404).json({ message: 'user does not exist' });
    }
    if (target_user.password) {
      if (auth_user.username === target_user.username) {
        await this.$repo.users.update({
          username: target_user.username,
          password: bcrypt.hashSync(target_user.password, 8)
        });
      } else {
        return this.res.status(403).json({ message: 'forbidden to update other users password' });
      }
    } else if (target_user.role) {
      if (auth_user.role === config.roles.ADMIN) {
        await this.$repo.users.update({
          username: target_user.username,
          role: target_user.role
        });
      } else {
        return this.res.status(403).json({ message: 'forbidden to update users role' });
      }
    }
    return this.res.status(200).json({ message: 'OK' });
  }

}

module.exports = UserService;