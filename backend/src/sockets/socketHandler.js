const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust for production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        logger.info(`New client connected: ${socket.id}`);

        socket.on('join_project', (projectId) => {
            socket.join(projectId);
            logger.info(`Socket ${socket.id} joined project ${projectId}`);
        });

        socket.on('disconnect', () => {
            logger.info('Client disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };
