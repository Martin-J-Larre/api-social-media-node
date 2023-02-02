const User = require('../models/User');

const register = (req, res) => { 

  const data = req.body;

  if (data.name && data.surname && data.nickname && data.email && data.password) {
    const userSaved = new User(data);

    res.status(200).json({
      status: 'success',
      message: 'user saved successfully',
      userSaved
    });

  }
  return res.status(400).json({
    status: 'error',
    message: 'Data entry is missing'
  })
}

module.exports = {
  register
}