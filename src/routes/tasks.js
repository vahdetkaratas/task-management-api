const express = require('express');
const { createTask, getTasks, deleteTask, updateTask, getTaskHistory } = require('../controllers/taskController');
const authenticate = require('../middlewares/authMiddleware');
const { checkRoles } = require('../middlewares/authMiddleware');
const logAction = require('../middlewares/logMiddleware');
const pagination = require('../middlewares/paginationMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and operations
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve tasks
 *     description: Get all tasks for the authenticated user, with optional filters and pagination.
 *     tags: [Tasks]
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
 *         description: Number of tasks per page
 *         required: false
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter tasks by status
 *         required: false
 *         schema:
 *           type: string
 *       - name: priorityMin
 *         in: query
 *         description: Minimum priority for filtering
 *         required: false
 *         schema:
 *           type: integer
 *       - name: priorityMax
 *         in: query
 *         description: Maximum priority for filtering
 *         required: false
 *         schema:
 *           type: integer
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
 */
router.get(
    '/',
    authenticate,
    pagination('tasks', ['status'], ['priority', 'dueDate']),
    getTasks
);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     description: Add a new task for the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: New Task
 *               description:
 *                 type: string
 *                 example: Task description
 *               priority:
 *                 type: integer
 *                 example: 2
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-01
 *               assignedUserIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, logAction('Create Task'), createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Delete a task by ID. Restricted to admins or moderators.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.delete('/:id', authenticate, logAction('Delete Task'), checkRoles(['admin', 'moderator']), deleteTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update details of a task.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.put('/:id', authenticate, updateTask);

/**
 * @swagger
 * /api/tasks/{id}/history:
 *   get:
 *     summary: Get task history
 *     description: Retrieve the update history for a specific task.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get('/:id/history', authenticate, getTaskHistory);

module.exports = router;
