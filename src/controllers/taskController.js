const { Task, User, TaskAssignment } = require('../../models');
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
