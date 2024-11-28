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
    // Filter tasks belonging to the logged-in user
    const userTasks = tasks.filter(task => task.userId === req.user.id);
    res.status(200).json(userTasks);
};
