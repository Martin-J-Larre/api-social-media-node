const bcrypt = require('bcrypt');
const mongoosePagination = require('mongoose-pagination');

const User = require('../models/User');
const jwt = require('../utils/jwt');

const register = (req, res) => { 

  const userToUpdate = req.body;

  if (!userToUpdate.name || !userToUpdate.surname || !userToUpdate.nickname || !userToUpdate.email || !userToUpdate.password) {
    const user = new User(userToUpdate);
    return res.status(400).json({
      status: 'error',
      message: 'Data entry is missing'
    });
  }

  User.find({
    $or: [{email: userToUpdate.email.toLowerCase()}, 
          {nickname: userToUpdate.nickname.toLowerCase()}]
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

    const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
    userToUpdate.password = hashedPassword;

    const user = new User(userToUpdate);

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

  const userToUpdate = req.body;

  if (!userToUpdate.email || !userToUpdate.password) {
    return res.status(400).json({
      status: 'error',
      message: 'You should enter email and password'
    });
  }

  User.findOne({ email: userToUpdate.email })
      .exec((error, user) => {

      if (error || !user) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist'
        });
      }

    // compare bcrypt
    const userPassword = bcrypt.compareSync(userToUpdate.password, user.password);
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

const getUserProfile = (req, res) => { 
  const id = req.params.id;

  User.findById(id)
      .select({password: 0, role: 0})
      .exec((error, user) => {
      if (error || !user) {
      return res.status(404).json({
        status: 'error',
        message: 'User does not exist'
      });
    }

    return res.status(200).json({
      status: 'success',
      // add fallowers soon
      user
    });

  });
}

const getUsersProfiles = (req, res) => { 
  let page = 1;
  if (req.params.page) {
    page = parseInt(req.params.page);
  }

  let itemsPerPage = 5;

  User.find().sort('_id').paginate(page, itemsPerPage, (error, users, total) => {

    if (error || !users) {
      return res.status(404).json({
        status: 'error',
        message: 'there are not users available',
        error
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Users profiles found successfully',
      page,
      itemsPerPage,
      total,
      pages: Math.ceil(total/itemsPerPage), 
      users
    });
  });

}

const updateUser = (req, res) => { 

  const userIdentity = req.user;
  delete userIdentity.iat;
  delete userIdentity.exp;
  delete userIdentity.role;
  delete userIdentity.avatar;

  const userToUpdate = req.body;
  console.log('userToUpdate', userToUpdate.email);
  console.log('userToUpdate', userToUpdate.nickname);

  User.find({
    $or: [{email: userToUpdate.email.toLowerCase()}, 
          {nickname: userToUpdate.nickname.toLowerCase()}]
  }).exec( async (error, users) => {
    if (error) {
      return res.status(500).json({
        status: 'error', 
        message: 'query error'
      });
    } 

    let userIsset = false;
    users.forEach(user => {
      if (user && user._id != user.id) {
        userIsset = true;
      }
    });

    if (userIsset) {
      return res.status(200).json({
        status: 'success',
        message: 'Nickname or email already exist'
      });  
    }

    if (userToUpdate.password) {
      const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = hashedPassword;
    }

    User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true }, (error, userUpdated) => {
      if (error || !userUpdated) {
        return res.status(500).json({
          status: 'error',
          message: 'User could not Update',
          error
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Everything is Ok',
        userUpdated
      });
    });
  });

}


module.exports = {
  register,
  login,
  getUserProfile,
  getUsersProfiles,
  updateUser
}

// return res.status(200).json({
//   status: 'success',
//   message: 'Everything is Ok',
// });

// return res.status(404).json({
//   status: 'error',
//   message: 'Something is wrong',
// });