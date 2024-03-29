const BaseService = require('./base.service');
const UserService = require('./user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');


class SessionService extends BaseService {

  constructor(req, res) {
    super(req, res);
    this.userService = new UserService(req, res);
  }

  async postSession() {
    try {
      const credentials = getCredentialsFromAuthHeaders(this.req);
      const authenticatedUser = await this.authenticate(credentials);
      if (!authenticatedUser) {
        return this.res.status(401).json({ message: 'Invalid Authentication Credentials' });
      }
      const session = await this.createJwtSession(authenticatedUser);
      return this.res.status(200).json(session);

    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserSession() {
    try {
      const jwtToken = this.req.headers['x-session-token'];
      const user = jwt.verify(jwtToken, config.auth.token);

      if (!user) {
        return this.res.status(401).json({ message: 'Invalid Access Token' });
      }

      return this.res.status(200).json(user.session);
    } catch (error) {
      this.handleError(error);
    }
  }

  async createJwtSession(payload) {
    // create a jwt token
    const token = jwt.sign({ session: payload }, config.auth.token, { expiresIn: config.session.expiresIn });
    return {
      username: payload.username,
      token
    }
  }

  async authenticate(credentials) {
    const doc = await this.userService.getUserByName(credentials.username);

    if (!doc)
      return null;

    const { password, _id, createdAt, ...user } = doc;
    
    const isMatch = bcrypt.compareSync(credentials.password, password);
    return !isMatch ? null : user;
  }

}

function getCredentialsFromAuthHeaders(req) {
  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(' ')[1];
  const [username, password] = Buffer.from(base64Credentials, 'base64').toString('ascii').split(':');
  return {
    username,
    password
  }
}

module.exports = SessionService;