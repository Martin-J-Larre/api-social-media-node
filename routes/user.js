const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { 
  register, 
  login, 
  getUserProfile, 
  getUsersProfiles, 
  updateUser} = require('../controllers/user');

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', auth, getUserProfile);
router.get('/profiles/:page?', auth, getUsersProfiles);
router.put('/profile', auth, updateUser);

module.exports = router;