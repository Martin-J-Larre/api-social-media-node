const mongoosePagination = require("mongoose-pagination");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const User = require("../models/User");
const jwt = require("../utils/jwt");
const { followThisUser, followerUserIds } = require("../utils/followerIdUtils");
const { validate } = require("../utils/validate");
const Follow = require("../models/Follow");
const Post = require("../models/Post");

const register = (req, res) => {
  const data = req.body;
  console.log(data);

  if (
    !data.name ||
    !data.surname ||
    !data.nickname ||
    !data.email ||
    !data.password
  ) {
    const user = new User(data);
    return res.status(400).json({
      status: "error",
      message: "Data entry is missing",
    });
  }

  try {
    validate(data);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
    });
  }

  User.find({
    $or: [
      { email: data.email.toLowerCase() },
      { nickname: data.nickname.toLowerCase() },
    ],
  }).exec(async (error, users) => {
    if (error) {
      return res.status(500).json({
        status: "error",
        message: "query error",
      });
    }
    if (users && users.length >= 1) {
      return res.status(200).json({
        status: "success",
        message: "Nickname or email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const user = new User(data);

    user.save((error, userSaved) => {
      if (error || !userSaved) {
        return res.status(500).json({
          status: "error",
          message: "User could not be saved",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "User saved successfully",
        userSaved,
      });
    });
  });
};

const login = (req, res) => {
  const userToUpdate = req.body;

  if (!userToUpdate.email || !userToUpdate.password) {
    return res.status(400).json({
      status: "error",
      message: "You should enter email and password",
    });
  }

  User.findOne({ email: userToUpdate.email }).exec((error, user) => {
    if (error || !user) {
      return res.status(404).json({
        status: "error",
        message: "User does not exist",
      });
    }

    // compare bcrypt
    const userPassword = bcrypt.compareSync(
      userToUpdate.password,
      user.password
    );
    if (!userPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password incorrect",
      });
    }

    // jwt
    const token = jwt.createToken(user);

    return res.status(200).json({
      status: "success",
      message: "Email and password correct",
      user: {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
      },
      token,
    });
  });
};

const getUserProfile = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .select({ password: 0, role: 0 })
    .exec(async (error, user) => {
      if (error || !user) {
        return res.status(404).json({
          status: "error",
          message: "User does not exist",
        });
      }

      const followInfo = await followThisUser(req.user.id, id);

      return res.status(200).json({
        status: "success",
        following: followInfo.following,
        follower: followInfo.follower,
        user,
      });
    });
};

const getUsersProfiles = (req, res) => {
  let page = 1;
  if (req.params.page) {
    page = parseInt(req.params.page);
  }

  let itemsPerPage = 5;

  User.find()
    .select("-password -email -role -__v")
    .sort("_id")
    .paginate(page, itemsPerPage, async (error, users, total) => {
      if (error || !users) {
        return res.status(404).json({
          status: "error",
          message: "there are not users available",
        });
      }
      const followUserIds = await followerUserIds(req.user.id);
      return res.status(200).json({
        status: "success",
        message: "Users profiles found successfully",
        page,
        itemsPerPage,
        total,
        pages: Math.ceil(total / itemsPerPage),
        userFollowing: followUserIds.following,
        userFollowers: followUserIds.followers,
        users,
      });
    });
};

const updateUser = (req, res) => {
  const userIdentity = req.user;
  delete userIdentity.iat;
  delete userIdentity.exp;
  delete userIdentity.role;
  delete userIdentity.avatar;

  const userToUpdate = req.body;

  User.find({
    $or: [
      { email: userIdentity.email.toLowerCase() },
      { nickname: userIdentity.nickname.toLowerCase() },
    ],
  }).exec(async (error, users) => {
    if (error) {
      return res.status(500).json({
        status: "error",
        message: "query error",
      });
    }

    let userIsset = false;
    users.forEach((user) => {
      if (user && user._id != user.id) {
        userIsset = true;
      }
    });

    if (userIsset) {
      return res.status(200).json({
        status: "success",
        message: "Nickname or email already exist",
      });
    }

    if (userToUpdate.password) {
      const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = hashedPassword;
    } else {
      delete userToUpdate.password;
    }

    User.findByIdAndUpdate(
      userIdentity.id,
      userToUpdate,
      { new: true },
      (error, userUpdated) => {
        if (error || !userUpdated) {
          return res.status(500).json({
            status: "error",
            message: "User could not Update",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "User updated successfully",
          userIdentity,
          userUpdated,
        });
      }
    );
  });
};

const uploadAvatar = (req, res) => {
  if (!req.file) {
    return res.status(404).json({
      status: "error",
      message: "Query does not have image file",
    });
  }

  const avatarFileName = req.file.originalname;
  const avatarNameSplit = avatarFileName.split(".");
  const avatarExtension = avatarNameSplit[1];

  if (
    avatarExtension != "png" &&
    avatarExtension != "jpg" &&
    avatarExtension != "jpeg" &&
    avatarExtension != "gif"
  ) {
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).json({
      status: "error",
      message: "File format not valid",
    });
  }

  User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.file.filename },
    { new: true },
    (error, userUpdated) => {
      if (error || !userUpdated) {
        return res.status(500).json({
          status: "error",
          message: "Error user could not be updated",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "User updated successfuly",
        userUpdated,
        file: req.file,
      });
    }
  );
};

const getAvatar = (req, res) => {
  const file = req.params.file;

  const filePath = "./uploads/avatars/" + file;

  fs.stat(filePath, (error, exists) => {
    if (error || !exists) {
      return res.status(404).json({
        status: "error",
        message: "Error file avatar does not exist",
      });
    }

    return res.sendFile(path.resolve(filePath));
  });
};

const counter = async (req, res) => {
  let userId = req.user.id;

  if (req.params.id) {
    userId = req.params.id;
  }

  try {
    const following = await Follow.count({ user: userId });

    const followed = await Follow.count({ followed: userId });

    const posts = await Post.count({ user: userId });

    res.status(200).json({
      userId,
      following: following,
      followed: followed,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error conter is not avaible",
    });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  getUsersProfiles,
  updateUser,
  uploadAvatar,
  getAvatar,
  counter,
};
