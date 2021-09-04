const SessionService = require('../services/session.service');

function postSession(req, res) {
  new SessionService(req, res).postSession();
}

function getUserSession(req, res) {
  new SessionService(req, res).getUserSession();
}

function deleteSession(req, res) {
  new SessionService(req, res).deleteSession();
}

module.exports = {
  postSession,
  getUserSession,
  deleteSession
};