const express = require('express');
const { getUsers, getAllTasks, deleteUser } = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');
const { checkRoles } = require('../middlewares/authMiddleware');
const { getLogs } = require('../controllers/auditController');
const logAction = require('../middlewares/logMiddleware');


const router = express.Router();

// Route to view audit logs (admin only)
router.get('/logs', authenticate, checkRoles(['admin']), getLogs);
router.get('/tasks', authenticate, checkRoles(['admin']), getAllTasks);
router.delete('/users/:id', authenticate, logAction('Delete User'), checkRoles(['admin']), deleteUser);
router.get('/users', authenticate, checkRoles(['admin']), pagination('users', ['role']), getUsers);




module.exports = router;
