const { Task, TaskAssignment, TaskHistory } = require('../../models');
const io = require('../server');


exports.createTask = async (req, res) => {
    const { title, description, priority, dueDate, assignedUserIds } = req.body;

    try {
        const task = await Task.create({ title, description, priority, dueDate, userId: req.user.id });

        if (assignedUserIds && assignedUserIds.length) {
            const assignments = assignedUserIds.map(userId => ({ taskId: task.id, userId }));
            await TaskAssignment.bulkCreate(assignments);

            // Notify assigned users
            assignedUserIds.forEach(userId => {
                io.emit(`user:${userId}`, { message: 'New task assigned', task });
            });
        }

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};


// Retrieve tasks for the logged-in user
exports.getTasks = async (req, res) => {
    try {
        // Find all tasks assigned to the logged-in user
        const tasks = await Task.findAll({
            include: [
                {
                    model: User,
                    through: { attributes: [] }, // Exclude TaskAssignment details
                    where: { id: req.user.id }
                }
            ]
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
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
    const { id } = req.params; // Task ID
    const { title, description, priority, dueDate, status } = req.body;

    try {
        // Find the task by ID and verify ownership
        const task = await Task.findOne({ where: { id, userId: req.user.id } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or access denied' });
        }

        // Prepare a log of changes
        const changes = [];
        const fieldsToTrack = { title, description, priority, dueDate, status };

        for (const field in fieldsToTrack) {
            if (fieldsToTrack[field] && fieldsToTrack[field] !== task[field]) {
                changes.push({
                    taskId: task.id,
                    userId: req.user.id,
                    changeType: field,
                    oldValue: task[field],
                    newValue: fieldsToTrack[field],
                    changeDate: new Date()
                });
                task[field] = fieldsToTrack[field]; // Update the field
            }
        }

        // Save the task
        await task.save();

        // Save the changes in TaskHistory
        if (changes.length > 0) {
            await TaskHistory.bulkCreate(changes);
        }

        // Notify assigned users of the update
        const assignments = await TaskAssignment.findAll({ where: { taskId: id } });
        const assignedUserIds = assignments.map(a => a.userId);

        assignedUserIds.forEach(userId => {
            io.emit(`user:${userId}`, { message: 'Task updated', task });
        });

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};
// Retrieve task history
exports.getTaskHistory = async (req, res) => {
    const { id } = req.params; // Task ID

    try {
        // Fetch task history
        const history = await TaskHistory.findAll({
            where: { taskId: id },
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['changeDate', 'DESC']]
        });

        if (!history.length) {
            return res.status(404).json({ message: 'No history found for this task' });
        }

        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching task history:', error.message);
        res.status(500).json({ message: 'Error fetching task history', error: error.message });
    }
};
