const jwt = require('jwt-simple');
const moment = require('moment');

const secret_key = process.env.SECRET_KEY;

const createToken = (user) => { 

  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  }

  return jwt.encode(payload, secret_key);
}

module.exports = { createToken }