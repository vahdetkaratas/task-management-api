const express = require('express');
const { createTask, getTasks, deleteTask } = require('../controllers/taskController');
const authenticate = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createTask);
router.get('/', authenticate, getTasks);

// Restrict delete route to admins
router.delete('/:id', authenticate, checkRole('admin'), deleteTask);

module.exports = router;
