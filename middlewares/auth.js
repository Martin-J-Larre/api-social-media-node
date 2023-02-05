const jwt = require('jwt-simple');
const moment = require('moment');

secret_key = process.env.SECRET_KEY;

const auth = (req, res, next) => { 

  if (!req.headers.authorization) {
    return res.status(403).json({
      status: 'error',
      message: 'Authentication error'
    });
  }

  const token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    const payload = jwt.decode(token, secret_key);

    if (payload.exp <= moment().unix()) {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      });
    }
    req.user = payload;

  } catch (err) {
    return res.status(404).json({
      status: 'error',
      message: 'Token not valid',
      err
    });
  }

  next();
}

module.exports = { auth }