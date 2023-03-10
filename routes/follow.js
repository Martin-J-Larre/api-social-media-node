const router = require("express").Router();

const { auth } = require("../middlewares/auth");
const {
  saveFallow,
  deleteFollow,
  listFollowing,
  listFollowers,
} = require("../controllers/follow");

router.post("/save", auth, saveFallow);
router.get("/following/:id?/:page?", auth, listFollowing);
router.get("/followers/:id?/:page?", auth, listFollowers);
router.delete("/delete/:id", auth, deleteFollow);

module.exports = router;
