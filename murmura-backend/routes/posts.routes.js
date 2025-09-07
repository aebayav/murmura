import express from "express"
import { newPost } from "../controllers/posts.js"
const postsRouter = express.Router()


postsRouter.post('/', newPost)

export default postsRouter