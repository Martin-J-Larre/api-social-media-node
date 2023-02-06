const router = require('express').Router();
const multer = require('multer');
const { auth } = require('../middlewares/auth');
const { 
  register, 
  login, 
  getUserProfile, 
  getUsersProfiles, 
  updateUser,
  uploadAvatar} = require('../controllers/user');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + Date.now() + '-' + file.originalname);
  }
});  

const uploads = multer({storage});

router.post('/register', register);
router.post('/login', login);
router.post('/upload-avatar', [auth, uploads.single('file')], uploadAvatar);
router.get('/profile/:id', auth, getUserProfile);
router.get('/profiles/:page?', auth, getUsersProfiles);
router.put('/profile', auth, updateUser);

module.exports = router;