const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server);

const tasksInEdit = {}; // Store the current state of tasks being edited

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Event: Join a task room
    socket.on('joinTask', (taskId) => {
        socket.join(taskId); // Join the task-specific room
        console.log(`User ${socket.id} joined task ${taskId}`);

        // Notify others in the room
        socket.to(taskId).emit('userJoined', { userId: socket.id, taskId });
    });

    // Event: Edit task
    socket.on('editTask', (taskId, taskData) => {
        tasksInEdit[taskId] = taskData; // Update the in-memory state
        console.log(`Task ${taskId} edited by user ${socket.id}`);

        // Notify all users in the task room except the sender
        socket.to(taskId).emit('taskUpdated', { taskId, taskData });
    });

    // Event: Leave a task room
    socket.on('leaveTask', (taskId) => {
        socket.leave(taskId); // Leave the task-specific room
        console.log(`User ${socket.id} left task ${taskId}`);

        // Notify others in the room
        socket.to(taskId).emit('userLeft', { userId: socket.id, taskId });
    });

    // Event: Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Export io for notifications
module.exports = io;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
