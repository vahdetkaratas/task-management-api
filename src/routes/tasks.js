const express = require('express');
const { createTask, getTasks } = require('../controllers/taskController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect routes using the "authenticate" middleware
router.post('/', authenticate, createTask);
router.get('/', authenticate, getTasks);

module.exports = router;
