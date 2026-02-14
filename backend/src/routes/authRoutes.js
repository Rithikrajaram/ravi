const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getMe, getUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

module.exports = router;
