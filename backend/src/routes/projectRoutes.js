const express = require('express');
const router = express.Router();
const { createProject, getProjects, addMember } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, createProject)
    .get(protect, getProjects);

router.post('/:id/members', protect, addMember);

module.exports = router;
