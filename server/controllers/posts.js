import express, { json, response } from "express"
import { getPool } from "../utils/database.js"
import logger from "../utils/logger.js"


export const newPost = async (request,response) => {
    const {content, category} = request.body
    const user_id = request.user.id // Get from middleware
    
    if(!content){
        return response.status(400).send({message: "Content is required"})
    }
    
    try{
        const pool = getPool()
        const sql = "INSERT INTO posts (user_id, content, category) VALUES ($1, $2, $3) RETURNING *"
        const result = await pool.query(sql, [user_id, content, category])
        logger.info(JSON.stringify(result.rows))
        return response.status(201).send({message:"new post created successfully", post: result.rows[0]})
    }
    catch(err){
        logger.error("Error:",err)
        return response.status(500).send({message: "Server error"})
    }
}

export const updatePost = async (request, response) => {
    const id = request.params.id;
    const {content, category} = request.body;
    const user_id = request.user.id; // Get from middleware

    if(!id){
        return response.status(400).send({message: "Post id is required"})
    }

    try {
        const pool = getPool()
        const checkSql = "SELECT * FROM posts WHERE id = $1 AND user_id = $2"
        const checkResult = await pool.query(checkSql,[id, user_id])

        if(checkResult.rows.length === 0){
            return response.status(404).send({message: "Post not found or unauthorized"})
        }
        
        const updateSql = `
            UPDATE posts 
            SET content = COALESCE($1, content),
                category = COALESCE($2, category)
            WHERE id = $3 AND user_id = $4
            RETURNING *`

        const result = await pool.query(updateSql, [
            content || null,
            category || null,
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
        const user_id = request.user?.id || null; // Optional from middleware
        
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
    const id = request.params.id;
    const user_id = request.user.id; // Get from middleware

    if (!id) {
        return response.status(400).send({ message: "Post id is required" });
    }

    try {
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
    const user_id = request.user.id; // Get from middleware

    try {
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
