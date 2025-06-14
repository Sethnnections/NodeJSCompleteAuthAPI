const logger = require('../utils/logger');
const crypto = require('crypto');

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = crypto.randomBytes(16).toString('hex');
  
  // Add request ID to request object
  req.requestId = requestId;
  
  // Log request start
  logger.info(`[${requestId}] ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    requestId: requestId,
    timestamp: new Date().toISOString()
  });
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Response ${res.statusCode} - ${responseTime}ms`, {
      statusCode: res.statusCode,
      responseTime: responseTime,
      requestId: requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    });
    
    return originalJson.call(this, data);
  };
  
  // Override res.send to log response
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    logger.info(`[${requestId}] Response ${res.statusCode} - ${responseTime}ms`, {
      statusCode: res.statusCode,
      responseTime: responseTime,
      requestId: requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    });
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Security event logging middleware
const securityLogger = (req, res, next) => {
  // Log security-sensitive events
  const sensitiveEndpoints = ['/login', '/register', '/logout', '/password', '/reset'];
  const isSensitive = sensitiveEndpoints.some(endpoint => 
    req.originalUrl.toLowerCase().includes(endpoint)
  );
  
  if (isSensitive) {
    logger.warn(`Security event: ${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer'),
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
  }
  
  next();
};

// API usage logging middleware
const apiUsageLogger = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Log API usage statistics
    logger.info(`API Usage: ${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      responseSize: JSON.stringify(data).length,
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error(`[${req.requestId}] Error: ${err.message}`, {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
  
  next(err);
};

module.exports = {
  requestLogger,
  securityLogger,
  apiUsageLogger,
  errorLogger
};