const { ClientRequestError } = require('../../utils/errors');
const UserRepository = require('../repository/user.repository');
const SessionRepository = require('../repository/session.repository');
class BaseService {

  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.$repo = {
      users: new UserRepository(),
      sessions: new SessionRepository()
    };
    this.$error = {
      ClientRequestError
    };
  }

  handleError(error) {
    if (error instanceof ClientRequestError) {
      this.res.status(error.code).json({ error: error.message });
    } else {
      console.log(error);
      this.res.status(500).json({ error: "Internal Server Error" });
    }
  }

}

module.exports = BaseService;