import express from "express"
import { migrateTables, createPool } from "./utils/database.js"
import {requestLogger,unknownEndpoint} from "./utils/middleware.js"
import postsRouter from "./routes/posts.routes.js"
import logger from "./utils/logger.js"
import usersRouter from "./routes/users.routes.js"

const app = express()
app.use(express.json())
app.use(requestLogger)


app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.listen(3000, () => {
    migrateTables()
    createPool()
    logger.info(`Server listens port 3000`)
})