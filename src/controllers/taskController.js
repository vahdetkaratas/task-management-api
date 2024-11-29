const { sequelize,Task, TaskAssignment,User, TaskHistory } = require('../../models');
const io = require('../server');


exports.createTask = async (req, res) => {
    const { title, description, priority, dueDate, status, assignedUserIds } = req.body;

    try {
        // Create the task
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            status: status || 'pending',
            userId: req.user.id,
        });

        // Assign users to the task
        if (assignedUserIds && assignedUserIds.length) {
            const assignments = assignedUserIds.map(userId => ({ taskId: task.id, userId }));
            await TaskAssignment.bulkCreate(assignments);
        }

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};




// Retrieve tasks for the logged-in user
exports.getTasks = async (req, res) => {
    try {
        // Use pagination middleware to fetch paginated results
        const { data, total, next, previous } = req.paginatedResults;

        // Enhance the task data to include assigned users
        const tasks = await Task.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'], // Task creator
                },
                {
                    model: TaskHistory,
                    as: 'histories',
                },
                {
                    model: TaskAssignment,
                    as: 'assignments',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'email'], // Assigned users
                        },
                    ],
                },
            ],
        });

        // Send the paginated tasks response
        res.status(200).json({
            total,
            tasks,
            next,
            previous,
        });
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'], // Task creator
                },
                {
                    model: TaskHistory,
                    as: 'histories',
                },
                {
                    model: TaskAssignment,
                    as: 'assignments',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'email'], // Assigned users
                        },
                    ],
                },
            ],
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task by ID:', error.message);
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
};


// Delete a task
exports.deleteTask = async (req, res) => {
    const taskId = req.params.id;

    try {
        // Find the task to ensure it exists and belongs to the logged-in user
        const task = await Task.findOne({
            where: { id: taskId, userId: req.user.id }
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or access denied' });
        }

        // Delete the task
        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};




// Update a task and notify assigned users
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, dueDate, status } = req.body;

    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access forbidden: Only admins can update tasks.' });
        }

        // Find the task by ID
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Validate input data
        if (!title && !description && !priority && !dueDate && !status) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Prepare a log of changes
        const changes = [];
        const fieldsToTrack = { title, description, priority, dueDate, status };

        for (const field in fieldsToTrack) {
            if (
                fieldsToTrack[field] !== undefined && // Ensure field is provided
                fieldsToTrack[field] !== task[field] // Check if the field has changed
            ) {
                changes.push({
                    taskId: task.id,
                    userId: req.user.id,
                    changeType: field,
                    oldValue: task[field],
                    newValue: fieldsToTrack[field],
                    changeDate: new Date(),
                });
                task[field] = fieldsToTrack[field]; // Update the field
            }
        }

        // Use transaction for data integrity
        const transaction = await sequelize.transaction();
        try {
            if (changes.length > 0) {
                await task.save({ transaction });
                await TaskHistory.bulkCreate(changes, { transaction });
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        // Notify assigned users of the update
        const assignments = await TaskAssignment.findAll({ where: { taskId: id } });
        const assignedUserIds = assignments.map(a => a.userId);

        if (assignedUserIds.length > 0 && changes.length > 0) {
            assignedUserIds.forEach(userId => {
                io.emit(`user:${userId}`, { message: 'Task updated', task });
            });
        }

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error(`Error updating task ${id} by user ${req.user.id}:`, error.message);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// Retrieve task history
exports.getTaskHistory = async (req, res) => {
    const { id } = req.params; // Task ID

    try {
        // Fetch task history with associated user
        const history = await TaskHistory.findAll({
            where: { taskId: id },
            include: [
                {
                    model: User,
                    as: 'user', // Use the alias defined in the TaskHistory model
                    attributes: ['id', 'name', 'email'], // Select only necessary fields
                },
            ],
        });

        if (!history || history.length === 0) {
            return res.status(404).json({ message: 'Task history not found' });
        }

        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching task history:', error.message);
        res.status(500).json({ message: 'Error fetching task history', error: error.message });
    }
};
