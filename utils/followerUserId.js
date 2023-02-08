const Follow = require("../models/Follow");

const followerUserIds = async (identityUserId) => {
  try {
    const following = await Follow.find({ user: identityUserId }).select({
      _id: 0,
      __v: 0,
      user: 0,
      created_at: 0,
    });
    const followers = await Follow.find({ followed: identityUserId }).select({
      _id: 0,
      __v: 0,
      created_at: 0,
    });

    const followingList = [];

    following.forEach((follow) => {
      followingList.push(follow.followed);
    });

    const followersList = [];

    followers.forEach((follow) => {
      followersList.push(follow.user);
    });

    return {
      following: followingList,
      followers: followersList,
    };
  } catch (error) {
    console.log(error);
  }
};

const followThisUser = async (identityUserId, profileUserId) => {
  try {
    const following = await Follow.findOne({
      user: identityUserId,
      followed: profileUserId,
    });
    const follower = await Follow.findOne({
      user: profileUserId,
      followed: identityUserId,
    });

    return {
      following,
      follower,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  followThisUser,
  followerUserIds,
};
