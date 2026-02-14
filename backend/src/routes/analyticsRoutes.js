const express = require('express');
const router = express.Router();
const { getUserDashboard, getTeamPerformance } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, getUserDashboard);
router.get('/team-performance', protect, authorize('admin', 'manager'), getTeamPerformance);

module.exports = router;
