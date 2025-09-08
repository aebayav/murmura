import express from "express"
import { migrateTables, createPool } from "./utils/database.js"
import {requestLogger,unknownEndpoint} from "./utils/middleware.js"
import postsRouter from "./routes/posts.routes.js"

const app = express()
app.use(express.json())
app.use(requestLogger)


app.use('/api/posts', postsRouter)

app.use(unknownEndpoint)
app.listen(3000, () => {
    migrateTables()
    createPool()
    logger.info(`Server listens port 3000`)
})