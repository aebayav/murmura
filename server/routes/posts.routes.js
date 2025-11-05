import express from "express"
import { getAllPost, newPost, updatePost } from "../controllers/posts.js"
const postsRouter = express.Router()


postsRouter.post('/', newPost)
postsRouter.get('/', getAllPost)
postsRouter.put('/:id', updatePost)

export default postsRouter