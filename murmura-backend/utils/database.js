import dotenv from "dotenv"
import { Client,Pool } from "pg"
import logger from "./logger"

dotenv.config()
const dbUser = process.env.POSTGRE_USER
const dbPass = process.env.POSTGRE_PASS

const migrationStatements = [
    `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
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
    )`
];

export async function migrateTables() {
        const client = new Client({
                user: dbUser,
                password: dbPass,
                host: 'localhost',
                port: 5432,
                database: 'postgres'
        });

        try {
                await client.connect();
                for (const sql of migrationStatements) {
                        await client.query(sql);
                }
                logger.info('Migration completed successfully.');
        } catch (err) {
                logger.info('Migration error:', err);
        } finally {
                await client.end();
        }
}


let pool;
export function createPool() {
    if (!pool) {
        pool = new Pool({
            host: 'localhost',
            user: dbUser,
            password: dbPass,
            port: 5432,
            database: 'postgres',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            maxLifetimeSeconds: 60
        });
        logger.info("Pool created successfuly")
    }
    return pool;
}

export function getPool(){
    if(!pool) throw new Error("Pool not initilized. Call createPool() first")
    return pool;
}



