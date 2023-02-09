const router = require("express").Router();
const {
  savePost,
  getOnePost,
  deletePost,
  getUserPosts,
} = require("../controllers/post");
const { auth } = require("../middlewares/auth");

router.post("/save", auth, savePost);
router.get("/detail/:id", auth, getOnePost);
router.get("/user/:id/:page?", auth, getUserPosts);
router.delete("/delete/:id", auth, deletePost);

module.exports = router;
