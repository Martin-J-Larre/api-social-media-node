const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const { saveFallow, deleteFollow } = require('../controllers/follow');

router.post('/save', auth, saveFallow);
router.delete('/delete/:id', auth, deleteFollow);

module.exports = router;