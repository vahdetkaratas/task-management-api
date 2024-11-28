const express = require('express');
const { createTask, getTasks, deleteTask } = require('../controllers/taskController');
const authenticate = require('../middlewares/authMiddleware');
const { checkRoles } = require('../middlewares/authMiddleware');
const logAction = require('../middlewares/logMiddleware');
const pagination = require('../middlewares/paginationMiddleware');

const router = express.Router();

router.get('/', authenticate, pagination('tasks'), getTasks);

// Log task creation
router.post('/', authenticate, logAction('Create Task'), createTask);

// Restrict delete route to admins
// Log task deletion
router.delete('/:id', authenticate, logAction('Delete Task'), checkRoles(['admin', 'moderator']), deleteTask);

module.exports = router;
