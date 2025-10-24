import express, { json, response } from "express"
import { getPool } from "../utils/database.js"
import logger from "../utils/logger.js"
import jwt from "jsonwebtoken"


export const newPost = async (request,response) => {
    
    const {userToken, content, category} = request.body
    const decodedToken = jwt.decode(userToken, process.env.SECRET)
    if(decodedToken){
        const user_id = decodedToken.id  // Changed from decodedToken.user_id to decodedToken.id
        const pool = getPool()
        const sql = "INSERT INTO posts (user_id, content, category) VALUES ($1, $2, $3) RETURNING *"
        if(!user_id || !content){
            return response.status(400).send({message: "all fields are required"})
        }
        try{
            const result = await pool.query(sql, [user_id, content, category])
            logger.info(JSON.stringify(result.rows))
            return response.status(201).send({message:"new post created successfully"})
        }
        catch(err){
            logger.error("Error:",err)
            return response.status(500).send({message: "Server error"})
        }
    }
    else{
        return response.status(401).send({error: "token invalid or unidentified"})
    }  
}
    

export const getAllPost = async (request, response) => {
    try {
        const pool = getPool();
        const sql = "SELECT * FROM posts";
        const result = await pool.query(sql);
        return response.status(200).send(result.rows);
    } catch (err) {
        return response.status(500).send({ message: "Server error" });
    }
}