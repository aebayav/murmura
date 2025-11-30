import logger from "./logger.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

export const unknownEndpoint = (request,response) => {
    return response.status(404).send({message:'Unknown Endpoint'})
}

// Middleware to verify access token
export const verifyAccessToken = (request, response, next) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
    
    if (!token) {
        return response.status(401).json({ error: 'Access token required' })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        request.user = decoded // Attach user info to request
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return response.status(401).json({ error: 'Token expired', expired: true })
        }
        return response.status(403).json({ error: 'Invalid token' })
    }
}