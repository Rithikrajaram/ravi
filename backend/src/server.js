require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./db');
const logger = require('./utils/logger');
const { initSocket } = require('./sockets/socketHandler');
const setupCronJobs = require('./jobs/cronJobs');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Start Database and Server
const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);

        // Initialize Cron Jobs
        setupCronJobs();
    });
};

startServer();
