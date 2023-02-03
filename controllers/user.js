const bcrypt = require('bcrypt');

const User = require('../models/User');

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
    // bcrypt password
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

module.exports = {
  register
}