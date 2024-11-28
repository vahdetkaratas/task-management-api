const express = require('express');
const { getUsers, getAllTasks, deleteUser } = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');
const { checkRoles } = require('../middlewares/authMiddleware');
const { getLogs } = require('../controllers/auditController');
const logAction = require('../middlewares/logMiddleware');
const pagination = require('../middlewares/paginationMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations for managing users, tasks, and logs
 */

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: View audit logs
 *     description: Retrieve audit logs for all actions. Admin access only.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/logs', authenticate, checkRoles(['admin']), getLogs);

/**
 * @swagger
 * /api/admin/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve all tasks. Admin access only.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/tasks', authenticate, checkRoles(['admin']), getAllTasks);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID. Admin access only.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', authenticate, logAction('Delete User'), checkRoles(['admin']), deleteUser);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users with pagination. Admin access only.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of users per page
 *         required: false
 *         schema:
 *           type: integer
 *       - name: role
 *         in: query
 *         description: Filter users by role
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/users', authenticate, checkRoles(['admin']), pagination('users', ['role']), getUsers);

module.exports = router;
