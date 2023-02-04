const router = require('express').Router();
const { register, login, getUser } = require('../controllers/user');
const { auth } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', auth, getUser);

module.exports = router;