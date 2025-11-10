import express from "express"
import { getAllPost, newPost, updatePost, deletePost, likePost } from "../controllers/posts.js"
const postsRouter = express.Router()


postsRouter.post('/', newPost)
postsRouter.get('/', getAllPost)
postsRouter.put('/:id', updatePost)
postsRouter.delete('/:id', deletePost)
postsRouter.post('/:id/like', likePost)

export default postsRouter