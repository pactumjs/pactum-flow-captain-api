const SessionsService = require('../api/services/session.service');


const authMiddleware = async function (req, res, _, next) {
  try {
    const session = new SessionsService(req, res);
    const jwtToken = getAccessToken(req);
    await session.verifyJwtSession(jwtToken);
    next();
    return;
  } catch (err) {
    next({
      message: "Unauthorized",
      statusCode: 401
    })
  }
}

function getAccessToken(req) {

  if (!req.headers['x-access-token']) {
    return { status: 400, message: 'Missing Authorization Header' };
  }

  const accessToken = req.headers['x-access-token'];

  if (accessToken) {
    return accessToken;
  } else {
    throw "Invalid Authentication details";
  }

}

module.exports = authMiddleware;