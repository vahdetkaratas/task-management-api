let tasks = []; // Temporary in-memory "database"

exports.createTask = (req, res) => {
    const { title, description, priority, dueDate } = req.body;
    const task = {
        id: Date.now(),
        userId: req.user.id, // Associate task with the logged-in user
        title,
        description,
        priority,
        dueDate,
        status: 'pending'
    };
    tasks.push(task);
    res.status(201).json({ message: 'Task created successfully', task });
};

exports.getTasks = (req, res) => {
    // Attach tasks to the request for pagination middleware
    req.tasks = tasks.filter(task => task.userId === req.user.id);

    res.status(200).json(req.paginatedResults);
};

exports.deleteTask = (req, res) => {
    const taskId = parseInt(req.params.id);

    // Check if task exists
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: 'Task deleted successfully' });
};
