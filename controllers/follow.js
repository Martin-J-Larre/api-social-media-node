const Follow = require('../models/Follow');
const User = require('../models/User');

const saveFallow = (req, res) => {

  const data = req.body;

  const userIdentity = req.user;

  const userToFollow = new Follow({
    user: userIdentity.id,
    followed: data.followed
  });

  userToFollow.save((error, followSaved) => {

    if (error || !followSaved) {
      return res.status(500).json({
        status: 'error',
        message: 'Error user followed could not be saved'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'User followed is saved',
      followSaved
    });
  })
}

const deleteFollow = (req, res) => {

  const userId = req.user.id;

  const followedId = req.params.id;

  Follow.find({
    'user': userId,
    'followed': followedId
  }).remove((error, followDeleted) => {

    if (error || !followDeleted) {
      return res.status(500).json({
        status: 'error',
        message: 'Error user followed could not be deleted'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'User followed deleted successfully'
    });
  }
  )
}

module.exports = {
  saveFallow,
  deleteFollow
}

// return res.status(200).json({
//   status: 'success',
//   message: 'It is all ok'
// });

// return res.status(500).json({
//   status: 'error',
//   message: 'Something is wrong'
// });