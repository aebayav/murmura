import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

// Rate limiting configuration
export const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
})

// Stricter rate limit for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true,
})

// Helmet configuration for security headers
export const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
})

// CORS configuration
export const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            'http://localhost:5173',
            'http://localhost:3000'
        ].filter(Boolean)
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true)
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

// Input validation helper
export const validateInput = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body)
        if (error) {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.details.map(d => d.message) 
            })
        }
        next()
    }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    
    // Don't leak error details in production
    const response = {
        success: false,
        message: message,
    }
    
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack
    }
    
    res.status(statusCode).json(response)
}
