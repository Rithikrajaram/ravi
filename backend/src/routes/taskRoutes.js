const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, getActivityLog } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, createTask)
    .get(protect, getTasks);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.get('/:id/activity', protect, getActivityLog);

module.exports = router;
