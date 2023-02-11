const fs = require("fs");
const path = require("path");

const Post = require("../models/Post");
const { followerUserIds } = require("../utils/followerIdUtils");

const createPost = (req, res) => {
  const data = req.body;

  if (!data.text) {
    return res.status(400).json({
      status: "error",
      message: "The field text sould not be empty",
    });
  }

  const newPost = new Post(data);
  newPost.user = req.user.id;

  newPost.save((error, postSaved) => {
    if (error || !postSaved) {
      return res.status(400).json({
        status: "error",
        message: "Error post could not be saved",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Post saved successfully",
      postSaved,
    });
  });
};

const uploadImgPost = (req, res) => {
  const postId = req.params.id;

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
    fs.unlinkSync(filePath);

    return res.status(400).json({
      status: "error",
      message: "File format not valid",
    });
  }

  Post.findByIdAndUpdate(
    { user: req.user.id, _id: postId },
    { file: req.file.filename },
    { new: true },
    (error, postUpdated) => {
      if (error || !postUpdated) {
        return res.status(500).json({
          status: "error",
          message: "Error post could not be updated",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Post updated successfuly",
        postUpdated,
        file: req.file,
      });
    }
  );
};

const getOnePost = (req, res) => {
  const postId = req.params.id;

  Post.findById(postId, (error, postSaved) => {
    if (error || !postSaved) {
      return res.status(404).json({
        status: "error",
        message: "Error post could not be found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Post found successfully",
      postSaved,
    });
  });
};

const getUserPosts = (req, res) => {
  const userId = req.params.id;
  let page = 1;
  const itemsPerPage = 5;

  if (req.params.page) page = parseInt(req.params.page);

  Post.find({ user: userId })
    .sort("-created_at")
    .populate("user", "-password -__v -role -email")
    .paginate(page, itemsPerPage, (error, posts, total) => {
      if (error || !posts || posts <= 0) {
        return res.status(404).json({
          status: "error",
          message: "Error post could not be found",
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "Post found successfully",
        page,
        pages: Math.ceil(total / itemsPerPage),
        itemsPerPage,
        total,
        posts,
      });
    });
};

const getFeedPosts = async (req, res) => {
  let page = 1;
  const userId = req.user.id;
  const itemsPerPage = 5;

  if (req.params.page) {
    page = req.params.page;
  }

  try {
    const myfollows = await followerUserIds(userId);

    Post.find({ user: { $in: myfollows.following } })
      .populate("user", "-password -role -__v -email")
      .sort("-create_at")
      .paginate(page, itemsPerPage, (error, posts, total) => {
        if (error || !posts) {
          return res.status(500).json({
            status: "Error",
            message: "Error it could not get feed post",
          });
        }

        return res.status(200).json({
          status: "Success",
          message: "All post for Feed found successfully",
          user: req.user.nickname,
          following: myfollows.following,
          page,
          itemsPerPage,
          pages: Math.ceil(total / itemsPerPage),
          total,
          posts,
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Error it could not get feed post",
    });
  }
};

const getImage = (req, res) => {
  const file = req.params.file;

  const filePath = "./uploads/posts/" + file;

  fs.stat(filePath, (error, exists) => {
    if (error || !exists) {
      return res.status(404).json({
        status: "error",
        message: "Error file does not exist",
      });
    }

    return res.sendFile(path.resolve(filePath));
  });
};

const deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  Post.find({ user: userId, _id: postId }).remove((error) => {
    if (error) {
      return res.status(500).json({
        status: "error",
        message: "Post could not be deleted",
      });
    }
    return res.status(200).json({
      status: "Success",
      message: "Post deleted sucessfully",
      postDeleted: postId,
    });
  });
};

module.exports = {
  createPost,
  uploadImgPost,
  getOnePost,
  getUserPosts,
  getFeedPosts,
  deletePost,
  getImage,
};

// return res.status(200).json({
//   status: "Success",
//   message: "It is all Ok",
// });
