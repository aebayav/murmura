import express from "express"
import { migrateTables, createPool } from "./utils/database.js"
import { requestLogger, unknownEndpoint } from "./utils/middleware.js"
import { limiter, helmetConfig, corsOptions, errorHandler } from "./utils/security.js"
import postsRouter from "./routes/posts.routes.js"
import logger from "./utils/logger.js"
import usersRouter from "./routes/users.routes.js"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Trust proxy for Railway (behind reverse proxy)
app.set('trust proxy', 1)

// Security middleware
app.use(helmetConfig)
app.use(cors(corsOptions))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
app.use(requestLogger)

// Rate limiting
app.use('/api/', limiter)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    })
})

// API routes
app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)

// Error handling
app.use(unknownEndpoint)
app.use(errorHandler)

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('Received shutdown signal, closing server gracefully...')
    
    // Close database pool
    const pool = await import('./utils/database.js').then(m => m.getPool())
    if (pool) {
        await pool.end()
        logger.info('Database pool closed')
    }
    
    process.exit(0)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

// Start server
const startServer = async () => {
    try {
        await migrateTables()
        createPool()
        
        app.listen(PORT,'0.0.0.0' ,() => {
            logger.info(`Server running on port ${PORT}`)
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
        })
    } catch (err) {
        logger.error('Failed to start server:', err)
        process.exit(1)
    }
}

startServer()