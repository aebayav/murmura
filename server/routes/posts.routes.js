import express from "express"
import { getAllPost, newPost, updatePost, deletePost, likePost } from "../controllers/posts.js"
import { verifyAccessToken } from "../utils/middleware.js"

const postsRouter = express.Router()

// Public route - no auth required (optional user context)
postsRouter.get('/', (req, res, next) => {
    // Try to verify token if present, but don't fail if missing
    const authHeader = req.headers['authorization']
    if (authHeader) {
        verifyAccessToken(req, res, next)
    } else {
        next()
    }
}, getAllPost)

// Protected routes - require authentication
postsRouter.post('/', verifyAccessToken, newPost)
postsRouter.put('/:id', verifyAccessToken, updatePost)
postsRouter.delete('/:id', verifyAccessToken, deletePost)
postsRouter.post('/:id/like', verifyAccessToken, likePost)

export default postsRouter