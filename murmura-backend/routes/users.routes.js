import { registerUser,loginUser } from "../controllers/users.js";
import express from "express"

const usersRouter = express.Router()

usersRouter.post('/register', registerUser)
usersRouter.post('/login', loginUser)

export default usersRouter