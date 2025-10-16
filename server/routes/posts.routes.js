import express from "express"
import { getAllPost, newPost } from "../controllers/posts.js"
const postsRouter = express.Router()


postsRouter.post('/', newPost)
postsRouter.get('/', getAllPost)

export default postsRouter