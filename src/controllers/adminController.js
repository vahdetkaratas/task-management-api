const { sendEmail } = require('../utils/emailService');
const users = []; // Replace with actual database later
const tasks = []; // Replace with actual database later


// Get all users (admin only)
exports.getUsers = (req, res) => {
    req.users = users; // Attach users to the request for pagination middleware
    res.status(200).json(req.paginatedResults);
};

// Get all tasks (admin only)
exports.getAllTasks = (req, res) => {
    res.status(200).json(tasks);
};

// Delete a user (admin only)
exports.deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const [deletedUser] = users.splice(userIndex, 1);

    // Notify the user with a customized email
    sendEmail(
        deletedUser.email,
        'Account Deletion Notice',
        'accountDeletion',
        { name: deletedUser.name }
    );

    res.status(200).json({ message: 'User deleted successfully' });
};
