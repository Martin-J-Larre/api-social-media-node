const router = require("express").Router();
const multer = require("multer");

const {
  createPost,
  getOnePost,
  deletePost,
  getUserPosts,
  uploadImgPost,
  getImage,
  getFeedPosts,
} = require("../controllers/post");
const { auth } = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/posts/");
  },
  filename: (req, file, cb) => {
    cb(null, "post-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

router.post("/save", auth, createPost);
router.post("/upload-img/:id", [auth, uploads.single("image")], uploadImgPost);
router.get("/image/:file", getImage);
router.get("/feed/:page?", auth, getFeedPosts);
router.get("/detail/:id", auth, getOnePost);
router.get("/user/:id/:page?", auth, getUserPosts);
router.delete("/delete/:id", auth, deletePost);

module.exports = router;
