import dotenv from "dotenv"
import { Client,Pool } from "pg"
import logger from "./logger.js"

dotenv.config()
const dbUser = process.env.POSTGRE_USER
const dbPass = process.env.POSTGRE_PASS
const dbHost = process.env.POSTGRE_HOST || 'localhost'
const dbPort = process.env.POSTGRE_PORT || 5432
const dbName = process.env.POSTGRE_DB || 'postgres'

const migrationStatements = [
    `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        birth_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        likes_count INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        post_id INT REFERENCES posts(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(post_id, user_id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id)`,
    `CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id)`,
    `CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INT REFERENCES posts(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS post_categories (
        post_id INT REFERENCES posts(id) ON DELETE CASCADE,
        category_id INT REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY(post_id, category_id)
    )`,
    `ALTER TABLE posts ADD COLUMN IF NOT EXISTS category VARCHAR(100)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE`
];

export async function migrateTables() {
        const client = new Client({
                user: dbUser,
                password: dbPass,
                host: dbHost,
                port: dbPort,
                database: dbName
        });

        try {
                await client.connect();
                for (const sql of migrationStatements) {
                        await client.query(sql);
                }
                logger.info('Migration completed successfully.');
        } catch (err) {
                logger.error('Migration error:', err);
                throw err; // Fail fast on migration errors
        } finally {
                await client.end();
        }
}


let pool;
export function createPool() {
    if (!pool) {
        pool = new Pool({
            host: dbHost,
            user: dbUser,
            password: dbPass,
            port: dbPort,
            database: dbName,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            maxLifetimeSeconds: 60
        });
        
        // Handle pool errors
        pool.on('error', (err) => {
            logger.error('Unexpected error on idle client', err)
            process.exit(-1)
        })
        
        logger.info("Database pool created successfully")
    }
    return pool;
}

export function getPool(){
    if(!pool) throw new Error("Pool not initilized. Call createPool() first")
    return pool;
}



