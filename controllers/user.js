const bcrypt = require('bcrypt');

const User = require('../models/User');
const jwt = require('../utils/jwt');

const register = (req, res) => { 

  const data = req.body;

  if (!data.name || !data.surname || !data.nickname || !data.email || !data.password) {
    const user = new User(data);
    return res.status(400).json({
      status: 'error',
      message: 'Data entry is missing'
    });
  }

  User.find({
    $or: [{email: data.email.toLowerCase()}, 
          {nickname: data.nickname.toLowerCase()}]
  }).exec( async (error, users) => {
    if (error) {
      return res.status(500).json({
        status: 'error', 
        message: 'query error'
      });

    } if (users && users.length >= 1) {
      return res.status(200).json({
        status: 'success',
        message: 'Nickname or email already exist'
      });  
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const user = new User(data);

    user.save((error, userSaved) => {
      if (error || !userSaved) {
        return res.status(500).json({
          status: 'error',
          message: 'User could not be saved'
        });
      }
        return res.status(200).json({
          status: 'success',
          message: 'User saved successfully',
          userSaved
        });
    })
  });
}

const login = (req, res) => {

  const data = req.body;

  if (!data.email || !data.password) {
    return res.status(400).json({
      status: 'error',
      message: 'You should enter email and password'
    });
  }

  User.findOne({ email: data.email })
      .exec((error, user) => {

      if (error || !user) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist'
        });
      }

    // compare bcrypt
    const userPassword = bcrypt.compareSync(data.password, user.password);
    if (!userPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Password incorrect'
      });
    }

    // jwt
    const token = jwt.createToken(user);

    return res.status(200).json({
      status: 'success',
      message: 'Email and password correct',
      user: {
        id: user.id,
        name: user.name,
        nickname: user.nickname
      },
      token
    });
  });
}


module.exports = {
  register,
  login
}