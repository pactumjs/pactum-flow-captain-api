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
    try {
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
          return this.res.status(403).json({ message: 'only admins can update users role' });
        }
      }
      return this.res.status(200).json({ message: 'OK' });
    } catch (error) {
      this.handleError(error);
    }
  }

  async postUser() {
    try {
      const jwtToken = this.req.headers['x-session-token'];
      const auth_user = jwt.verify(jwtToken, config.auth.token).session;
      if (auth_user.role !== config.roles.ADMIN) {
        return this.res.status(403).json({ message: 'only admins can create users' });
      }
      const target_user = this.req.body;
      const db_target_user = await this.$repo.users.getByUserName(target_user.username);
      if (db_target_user) {
        return this.res.status(409).json({ message: 'user already exists' });
      }
      await this.$repo.users.save({
        username: target_user.username,
        password: bcrypt.hashSync(target_user.password || target_user.username, 8),
        role: target_user.role || config.roles.VIEWER
      });
      return this.res.status(200).json({ message: 'OK' });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUsers() {
    try {
      const jwtToken = this.req.headers['x-session-token'];
      const auth_user = jwt.verify(jwtToken, config.auth.token).session;
      if (auth_user.role !== config.roles.ADMIN) {
        return this.res.status(403).json({ message: 'only admins can fetch users' });
      }
      const users = await this.$repo.users.get();
      return this.res.status(200).json(users.map(user => { return { username: user.username, role: user.role } }));
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteUser() {
    try {
      const username = this.req.swagger.params.username.value;
      const jwtToken = this.req.headers['x-session-token'];
      const auth_user = jwt.verify(jwtToken, config.auth.token).session;
      if (auth_user.role !== config.roles.ADMIN) {
        return this.res.status(403).json({ message: 'only admins can create users' });
      }
      if (auth_user.username === username) {
        return this.res.status(400).json({ message: 'could not delete own user' });
      }
      await this.$repo.users.delete(username);
      return this.res.status(200).json({ message: 'OK' });
    } catch (error) {
      this.handleError(error);
    }
  }

}

module.exports = UserService;