import express, { json } from "express"
import { getPool } from "../utils/database.js"
import logger from "../utils/logger.js"


export const newPost = async (request,response) => {
    const {user_id, content} = request.body
    const pool = getPool()
    const sql = "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *"
    if(!user_id || !content){
        return response.status(400).send({message: "all fields are required"})
    }
    try{
        const result = await pool.query(sql, [user_id,content])
        logger.info(JSON.stringify(result.rows))
        return response.status(201).send({message:"new post created successfully"})
    }
    catch(err){
        logger.error("Error:",err)
    }
}

