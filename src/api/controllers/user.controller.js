const UserService = require('../services/user.service');

function updateUser(req, res) {
  new UserService(req, res).updateUser();
}

module.exports = {
  updateUser
};