const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

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
