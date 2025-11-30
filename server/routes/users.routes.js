import { registerUser, loginUser, logoutUser, refreshToken } from "../controllers/users.js";
import express from "express"

const usersRouter = express.Router()

usersRouter.post('/register', registerUser)
usersRouter.post('/login', loginUser)
usersRouter.post('/logout', logoutUser);
usersRouter.post('/refresh', refreshToken);

export default usersRouter