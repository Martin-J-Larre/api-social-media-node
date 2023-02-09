const Post = require("../models/Post");

const savePost = (req, res) => {
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

const saveImgPost = (req, res) => {};

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
    .populate("user", "-password -__v -role")
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

const updatePost = (req, res) => {};

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
  savePost,
  saveImgPost,
  getOnePost,
  getUserPosts,
  updatePost,
  deletePost,
};

// return res.status(200).json({
//   status: "Success",
//   message: "It is all Ok",
// });
