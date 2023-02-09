const mongoosePagination = require("mongoose-pagination");

const Follow = require("../models/Follow");
const User = require("../models/User");
const { followerUserIds } = require("../utils/followerIdUtils");

const saveFallow = (req, res) => {
  const data = req.body;

  const userIdentity = req.user;

  const userToFollow = new Follow({
    user: userIdentity.id,
    followed: data.followed,
  });

  userToFollow.save((error, followSaved) => {
    if (error || !followSaved) {
      return res.status(500).json({
        status: "error",
        message: "Error user followed could not be saved",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User followed is saved",
      followSaved,
    });
  });
};

const deleteFollow = (req, res) => {
  const userId = req.user.id;

  const followedId = req.params.id;

  Follow.find({
    user: userId,
    followed: followedId,
  }).remove((error, followDeleted) => {
    if (error || !followDeleted) {
      return res.status(500).json({
        status: "error",
        message: "Error user followed could not be deleted",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User followed deleted successfully",
    });
  });
};

const listFollowing = (req, res) => {
  let userId = req.user.id;
  let page = 1;
  const itemsPerPage = 5;

  if (req.params.id) userId = req.params.id;
  if (req.params.page) page = req.params.page;

  Follow.find({ user: userId })
    .populate("followed", "-password -role -__v")
    .paginate(page, itemsPerPage, async (error, follows, total) => {
      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error the query could not be processed",
        });
      }
      const followUserIds = await followerUserIds(req.user.id);
      return res.status(200).json({
        status: "success",
        message: "Following is all ok",
        page,
        itemsPerPage,
        total,
        pages: Math.ceil(total / itemsPerPage),
        userFollowing: followUserIds.following,
        userFollowers: followUserIds.followers,
        follows,
      });
    });
};

const listFollowers = (req, res) => {
  let userId = req.user.id;
  let page = 1;
  const itemsPerPage = 5;

  if (req.params.id) userId = req.params.id;
  if (req.params.page) page = req.params.page;

  Follow.find({ followed: userId })
    .populate("user", "-password -role -__v")
    .paginate(page, itemsPerPage, async (error, follows, total) => {
      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error the query could not be processed",
        });
      }
      const followUserIds = await followerUserIds(req.user.id);
      return res.status(200).json({
        status: "success",
        message: "Followers is all ok",
        page,
        itemsPerPage,
        total,
        pages: Math.ceil(total / itemsPerPage),
        userFollowing: followUserIds.following,
        userFollowers: followUserIds.followers,
        follows,
      });
    });
};

module.exports = {
  saveFallow,
  deleteFollow,
  listFollowing,
  listFollowers,
};

// return res.status(200).json({
//   status: 'success',
//   message: 'It is all ok'
// });

// return res.status(500).json({
//   status: 'error',
//   message: 'Something is wrong'
// });
