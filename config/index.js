require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',

    // Database configuration
    database: {
        uri: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferMaxEntries: 0,
            bufferCommands: false,
        }
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpiration: process.env.JWT_EXPIRATION || '15m',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d'
    },

    // CORS Configuration
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173']
    },

    // Rate Limiting Configuration
    rateLimit: {
        requests: parseInt(process.env.RATE_LIMIT_REQUESTS) || 100,
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        authRequests: parseInt(process.env.AUTH_RATE_LIMIT_REQUESTS) || 5
    },

    // Security Configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
        sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
        cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
        csrfToken: process.env.CSRF_TOKEN_SECRET || 'csrf-secret-change-this'
    },

    // Email Configuration (if using email)

    email: {
        smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        },
        from: process.env.EMAIL_FROM
    },
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        file: process.env.LOG_FILE || 'logs/app.log',
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        maxFiles: process.env.LOG_MAX_FILES || '14d'
    },

    // File Upload Configuration
    upload: {
        maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024, // 5MB
        allowedTypes: process.env.UPLOAD_ALLOWED_TYPES
            ? process.env.UPLOAD_ALLOWED_TYPES.split(',')
            : ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    },

    // API Configuration
    api: {
        version: process.env.API_VERSION || 'v1',
        timeout: parseInt(process.env.API_TIMEOUT) || 30000,
        maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb'
    },

    // Feature Flags
    features: {
        enableRegistration: process.env.ENABLE_REGISTRATION !== 'false',
        enablePasswordReset: process.env.ENABLE_PASSWORD_RESET !== 'false',
        enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
        enableTwoFactor: process.env.ENABLE_TWO_FACTOR === 'true'
    },

    // Development specific settings
    development: {
        enableDetailedErrors: process.env.NODE_ENV === 'development',
        enableDebugLogging: process.env.NODE_ENV === 'development',
        enableApiDocs: process.env.ENABLE_API_DOCS !== 'false'
    }
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];

if (config.env === 'production') {
    requiredEnvVars.push('MONGODB_URI', 'SESSION_SECRET');
}

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

module.exports = config;