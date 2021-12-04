const UserService = require('../services/user.service');

function updateUser(req, res) {
  new UserService(req, res).updateUser();
}

function postUser(req, res) {
  new UserService(req, res).postUser();
}

function getUsers(req, res) {
  new UserService(req, res).getUsers();
}

function deleteUser(req, res) {
  new UserService(req, res).deleteUser();
}

module.exports = {
  postUser,
  getUsers,
  updateUser,
  deleteUser
};