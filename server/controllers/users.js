
import logger from "../utils/logger.js"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getPool } from "../utils/database.js"

dotenv.config()

// Generate short-lived access token

const generateAccessToken = (userId) => {
    return jwt.sign({id: userId}, process.env.SECRET, {
        expiresIn: '15m' // 15 minutes
    })
}

const generateRefreshToken = (userId) => {
    return jwt.sign({id: userId}, process.env.SECRET, {
        expiresIn: '7d'
    })
}

const storeRefreshToken = async (userId, token) => {
    const pool = getPool()
    const expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // Fixed: added milliseconds
    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt] // Fixed: changed refreshToken to token
    );
}


export const registerUser = async (request, response) => {
    const {username, password, email, birth_date} = request.body;
    try{
        const pool = getPool()
        //Check if user already exists
        const exitstingUser = await pool.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );
        
        if(exitstingUser.rows.length > 0){
            return response.status(401).send({message: "Username already taken"})
        }
        
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS) || 10)
        const result = await pool.query(
            `INSERT INTO users VALUES ($1,$2,$3,$4) RETURNING id, username`, 
            [username,email,hashedPassword,birth_date]
        )

        const user = result.rows[0]

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        await storeRefreshToken(user.id, refreshToken)
        
        response.status(201).json({
            message: 'user registered successfuly.',
            user: {id: user.id, username: user.username},
            accessToken,
            refreshToken
        });
    }
    catch(error){
        logger.error('Error registering user', error);
        response.status(500).json({error: 'Internal server error'})
    }
}

export const loginUser = async (request, response) => {
    const {username, password} = request.body;
    try{
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        if(result.rows.length === 0){
            return response.status(401).json({error: 'Invalid Credentials'})
        }
        const user = result.rows[0]

        const isValidPassword = await bcrypt.compare(password, user.password)

        if(!isValidPassword){
            return response.status(401).json({error: 'Invalid credentials'})
        }
        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        await storeRefreshToken(user.id, refreshToken)

        response.status(200).json({
            message: 'Login successful',
            user: {id: user.id, username: user.username},
            accessToken,
            refreshToken
        })
    }
    catch(error){
        logger.error('Error logging in:', error);
        response.status(500).json({error: 'Internal server error'})
    }
};

export const refreshToken = async (request, response) => {
    const {refreshToken} = request.body

    if(!refreshToken){
        return response.status(401).json({error: 'Refresh token required'})
    }
    try{
        const pool = getPool()
        const decoded = jwt.verify(refreshToken, process.env.SECRET)
        const result = await pool.query(
            'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND is_revoked = FALSE AND expires_at > NOW()',
            [refreshToken, decoded.id]
        );

        if(result.rows.length === 0){
            return response.status(403).json({message: 'Invalid or expired refresh token'})
        }

        const newAccessToken = generateAccessToken(decoded.id)

        response.status(200).json({
            accessToken: newAccessToken
        })
        
    }
    catch(error){
        logger.error('Error refreshing token:', error)
        response.status(403).json({error: 'Invalid refresh token'})
    }

};

export const logoutUser = async (request, response) => {
    const { refreshToken } = request.body;

    if(!refreshToken){
        return response.status(200).json({message: 'Logged out successfully'})

    }

    try{
        const pool = getPool()
        await pool.query(
            'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1',
            [refreshToken]
        )
        response.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        logger.error('Error logging out:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};