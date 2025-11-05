import express, { json, response } from "express"
import { getPool } from "../utils/database.js"
import logger from "../utils/logger.js"
import jwt, { decode } from "jsonwebtoken"


export const newPost = async (request,response) => {
    
    const {userToken, content, category} = request.body // Get user credentials from request
    const decodedToken = jwt.decode(userToken, process.env.SECRET) // Decode token
    if(decodedToken){
        const user_id = decodedToken.id 
        const pool = getPool()
        const sql = "INSERT INTO posts (user_id, content, category) VALUES ($1, $2, $3) RETURNING *" //Add post according to credentials
        if(!user_id || !content){
            return response.status(400).send({message: "all fields are required"}) //error catching
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

export const updatePost = async (request, response) => {
    const id = request.params.id; // Get post ID from URL parameters
    const {userToken, content, category} = request.body; // Get user and post data from request body

    // Validate existence of credentials
    if(!userToken || !id){
        return response.status(400).send({message: "Token or post id is required"})
    }

    //If credentials exist decode JWT
    const decodedToken = jwt.decode(userToken, process.env.SECRET)
    if(!decodedToken){
        return response.status(401).send({error:"token invalid or unidentified"})
    }

    //Check if the user owns the post 
    try {
        const user_id = decodedToken.id
        const pool = getPool()
        const checkSql = "SELECT * FROM posts WHERE id = $1 AND user_id = $2"
        const checkResult = await pool.query(checkSql,[id, user_id])

        if(checkResult.rows.length === 0){
            return response.status(404).send({message: "Post not found or unauthorized"})
        }
        
        // coalesce for merge the new post data and old post data
        const updateSql = `
            UPDATE posts 
            SET content = COALESCE($1, content),
                category = COALESCE($2, category)
            WHERE id = $3 AND user_id = $4
            RETURNING *`

        //update database   
        const result = await pool.query(updateSql, [
            content || null,  // If content is empty/undefined, pass null
            category || null, // If category is empty/undefined, pass null
            id, 
            user_id
        ])
    
        logger.info("Post updated:", result.rows[0])
        return response.status(200).send({
            message: "Post updated successfully", 
            post: result.rows[0]
        })
        
    }


    catch(err) {
        logger.error("Error updating post:", err)
        return response.status(500).send({message: "Server error"})
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