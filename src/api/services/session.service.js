const BaseService = require('./base.service');
const UserService = require('./user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


class SessionService extends BaseService {

  constructor(req, res) {
    super(req, res);
    this.userService = new UserService(req, res);
  }

  async postSession() {
    try {
      const userCreds = getCredsFromAuthHeaders(this.req);
      const authenticatedUser = await this.authenticate(userCreds);
      if (!authenticatedUser) {
        return this.res.status(401).json({ message: 'Invalid Authentication Credentials' });
      }
      const user = await this.createJwtSession(authenticatedUser);
      return this.res.status(200).json(user);

    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserSession() {
    try {
      const jwtToken = getJwtTokenFromHeaders(this.req);
      const verifiedUser = await this.verifyJwtSession(jwtToken);

      if (!verifiedUser) {
        return this.res.status(401).json({ message: 'Invalid Authentication Credentials' });
      }

      return this.res.status(200).json(verifiedUser.session);

    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteSession() {
    
    try {
      const userName = this.req.swagger.params.username.value;
      const response = await this.$repo.sessions.revokeSession(userName);

      if (!response) {
        return this.res.status(500).json({ message: 'Error logging out' });
      }

      return this.res.status(200).json({ message: 'Logout success' });

    } catch (error) {
      this.handleError(error);
    }
  }

  async createJwtSession(payload) {
    // create a jwt token that is valid for 30min
    const token = jwt.sign({ session: payload }, process.env.JWT_SECRET_KEY, { expiresIn: '6d' });

    const newUserSession = {
      username: payload.username,
      sessionToken: token
    }

    await this.$repo.sessions.revokeSession(payload.username);
    const sessionDoc = await this.$repo.sessions.save(newUserSession);
    const { username, sessionToken, createdAt } = sessionDoc;
    return {
      username, sessionToken, createdAt
    }
  }

  async verifyJwtSession(jwtToken) {
    try {
      const decodedSession = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
      return decodedSession;
    } catch (err) {
      throw err;
    }
  }

  async authenticate({ userName, userPass }) {
    const { password, _id, createdAt, ...user } = await this.userService.getUserByName(userName);

    if (!user)
      return null;

    const isMatch = bcrypt.compareSync(userPass, password);
    return !isMatch ? null : user;
  }

  async revokeAllSessions() {
    await this.$repo.sessions.removeAllSessions();
  }

}

function getCredsFromAuthHeaders(req) {
  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(' ')[1];
  const [userName, userPass] = Buffer.from(base64Credentials, 'base64').toString('ascii').split(':');
  return {
    userName,
    userPass
  }
}

function getJwtTokenFromHeaders(req) {
  // check for jwt token in headers
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return { status: 400, message: 'Missing Authorization Header' };
  }
  // verify auth credentials
  const jwtToken = req.headers.authorization.split(' ')[1];
  return jwtToken

}

module.exports = SessionService;