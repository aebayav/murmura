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
    const { userToken } = request.query; // Get token from query params
    
    try {
        const pool = getPool();
        let user_id = null;
        
        // Decode token if provided
        if (userToken) {
            try {
                const decodedToken = jwt.decode(userToken, process.env.SECRET);
                if (decodedToken) {
                    user_id = decodedToken.id;
                }
            } catch (err) {
                logger.warn("Invalid token in getAllPost");
            }
        }
        
        // Get posts with like status and username
        const sql = `
            SELECT 
                posts.*,
                users.username,
                CASE 
                    WHEN likes.user_id IS NOT NULL THEN true 
                    ELSE false 
                END as is_liked_by_user
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            LEFT JOIN likes ON posts.id = likes.post_id AND likes.user_id = $1
            ORDER BY posts.created_at DESC
        `;
        
        const result = await pool.query(sql, [user_id]);
        return response.status(200).send(result.rows);
    } catch (err) {
        logger.error("Error in getAllPost:", err);
        return response.status(500).send({ message: "Server error" });
    }
}

export const deletePost = async (request, response) => {
    const id = request.params.id; // Get post ID from URL parameters
    const { userToken } = request.body; // Get user token from request body

    logger.info("Delete request - ID:", id, "Token:", userToken ? "present" : "missing");

    // Validate credentials
    if (!userToken || !id) {
        return response.status(400).send({ message: "Token or post id is required" });
    }

    // Decode JWT
    const decodedToken = jwt.decode(userToken, process.env.SECRET);
    if (!decodedToken) {
        return response.status(401).send({ error: "token invalid or unidentified" });
    }

    // Check if the user owns the post and delete it
    try {
        const user_id = decodedToken.id;
        const pool = getPool();
        
        logger.info("Attempting to delete post", id, "for user", user_id);
        
        // Delete only if user owns the post
        const deleteSql = "DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *";
        const result = await pool.query(deleteSql, [id, user_id]);

        if (result.rows.length === 0) {
            logger.info("Post not found or unauthorized");
            return response.status(404).send({ message: "Post not found or unauthorized" });
        }

        logger.info("Post deleted:", result.rows[0]);
        return response.status(200).send({
            message: "Post deleted successfully",
            post: result.rows[0]
        });

    } catch (err) {
        logger.error("Error deleting post:", err);
        return response.status(500).send({ message: "Server error" });
    }
}

export const likePost = async (request, response) => {
    const postId = request.params.id;
    const { userToken } = request.body;

    if (!userToken) {
        return response.status(400).send({ message: "Token required" });
    }

    const decodedToken = jwt.decode(userToken, process.env.SECRET);

    if (!decodedToken) {
        return response.status(401).send({ message: "User token not found" });
    }

    try {
        const user_id = decodedToken.id;
        const pool = getPool();

        const checkLikeSql = "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2";
        const likeExists = await pool.query(checkLikeSql, [postId, user_id]);

        if (likeExists.rows.length > 0) {
            // Unlike
            await pool.query("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", [postId, user_id]);
            await pool.query("UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1", [postId]);
            
            logger.info(`User ${user_id} unliked post ${postId}`);
            return response.status(200).send({ 
                message: "Post unliked",
                liked: false 
            });
        } else {
            // Like
            await pool.query("INSERT INTO likes (post_id, user_id) VALUES ($1, $2)", [postId, user_id]);
            await pool.query("UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1", [postId]);
            
            logger.info(`User ${user_id} liked post ${postId}`);
            return response.status(200).send({ 
                message: "Post liked",
                liked: true 
            });
        }
    } catch (err) {
        logger.error("Error liking post:", err);
        return response.status(500).send({ message: "Server error" });
    }
}
