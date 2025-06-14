require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Graceful shutdown handler
let isShuttingDown = false;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) {
    logger.warn(`${signal} received again, forcing exit...`);
    process.exit(1);
  }
  
  isShuttingDown = true;
  logger.info(`${signal} received, starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    logger.info('Server closed successfully');
    
    // Close database connection
    if (process.env.NODE_ENV !== 'test') {
      require('mongoose').connection.close(() => {
        logger.info('Database connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
  
  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Enhanced error handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
  
  // Don't exit in development for debugging
  if (process.env.NODE_ENV === 'production') {
    gracefulShutdown('UNHANDLED_REJECTION');
  }
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  
  // Always exit on uncaught exception
  if (isShuttingDown) {
    process.exit(1);
  }
  
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Graceful shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Memory usage monitoring
const logMemoryUsage = () => {
  const used = process.memoryUsage();
  const memoryInfo = {};
  
  for (let key in used) {
    memoryInfo[key] = Math.round(used[key] / 1024 / 1024 * 100) / 100 + ' MB';
  }
  
  logger.debug('Memory usage:', memoryInfo);
  
  // Log warning if memory usage is high
  const heapUsedMB = used.heapUsed / 1024 / 1024;
  if (heapUsedMB > 100) { // Adjust threshold as needed
    logger.warn(`High memory usage detected: ${heapUsedMB.toFixed(2)} MB`);
  }
};

// Connect to MongoDB with enhanced error handling
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();    
    // Start the server
    const server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔧 Node.js version: ${process.version}`);
      logger.info(`💾 Process ID: ${process.pid}`);
      logger.info(`📈 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
      
      // Log memory usage every 30 minutes in production
      if (process.env.NODE_ENV === 'production') {
        setInterval(logMemoryUsage, 30 * 60 * 1000);
      }
    });
    
    // Server timeout configuration
    server.timeout = 30000; // 30 seconds
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds
    
    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        logger.error('Server error:', err);
        process.exit(1);
      }
    });
    
    // Log server events
    server.on('connection', (socket) => {
      logger.debug('New connection established');
      
      socket.on('error', (err) => {
        logger.error('Socket error:', err);
      });
    });
    
    // Export server for testing
    module.exports = server;
    
    return server;
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = startServer;