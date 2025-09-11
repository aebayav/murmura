import { getPool } from "../utils/database.js"
import logger from "../utils/logger.js"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
dotenv.config()


export const registerUser = async (request, response) => {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    const { username, password, email, birth_date } = request.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (err) {
        logger.error("Error hashing password:", err);
        return response.status(500).send({ message: "Error hashing password" });
    }

    const sql = "INSERT INTO users (username, email, password_hash, created_at) values ($1, $2, $3, NOW()) RETURNING *";
    const pool = getPool();
    try {
        const result = await pool.query(sql, [username, email, hashedPassword]);
        return response.status(201).send({ message: `User ${JSON.stringify(result.rows[0])} registered successfully` });
    } catch (err) {
        logger.error("Database error:", err);
        return response.status(500).send({ message: "Database error" });
    }
}

export const loginUser = async (request, response) => {
    const { username, password } = request.body;
    const sql = "SELECT * FROM users WHERE username = $1";
    const pool = getPool();
    try {
        const dbResult = await pool.query(sql, [username]);
        const user = dbResult.rows[0];
        if (!user) {
            return response.status(401).send({ message: "invalid username or password" });
        }
        const comparePassword = await bcrypt.compare(password, user.password_hash);
        if (!comparePassword) {
            return response.status(401).send({ message: "invalid username or password" });
        }
        const userForToken = {
            username:user.username,
            id: user.id
        }
        const userToken = jwt.sign(userForToken,process.env.SECRET ,{
            expiresIn: 60 * 60
        })

        const message= {
            username:username,
            token:userToken
        }

        return response.status(201).send(message)
        
    } catch (err) {
        logger.error("Database error:", err);
        return response.status(500).send({ message: "Database error" });
    }
}

