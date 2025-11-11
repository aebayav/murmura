import dotenv from 'dotenv';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

dotenv.config();

const dbConfig = {
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASS,
    host: process.env.POSTGRE_HOST || 'localhost',
    port: process.env.POSTGRE_PORT || 5432,
    database: process.env.POSTGRE_DB || 'postgres'
};

async function populateDatabase() {
    const client = new Client(dbConfig);

    try {
        await client.connect();
        console.log('Connected to database');

        // Clear existing data
        console.log('Clearing existing data...');
        await client.query('DELETE FROM likes');
        await client.query('DELETE FROM comments');
        await client.query('DELETE FROM posts');
        await client.query('DELETE FROM users');
        await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE posts_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE likes_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE comments_id_seq RESTART WITH 1');

        // Create sample users
        console.log('Creating sample users...');
        const password = await bcrypt.hash('password123', 10);
        
        const users = [
            { username: 'john_doe', email: 'john@example.com', birth_date: '1995-05-15' },
            { username: 'jane_smith', email: 'jane@example.com', birth_date: '1998-08-22' },
            { username: 'bob_wilson', email: 'bob@example.com', birth_date: '1992-03-10' },
            { username: 'alice_jones', email: 'alice@example.com', birth_date: '1997-11-30' },
            { username: 'charlie_brown', email: 'charlie@example.com', birth_date: '1994-07-18' }
        ];

        const userIds = [];
        for (const user of users) {
            const result = await client.query(
                'INSERT INTO users (username, email, password_hash, birth_date) VALUES ($1, $2, $3, $4) RETURNING id',
                [user.username, user.email, password, user.birth_date]
            );
            userIds.push(result.rows[0].id);
            console.log(`Created user: ${user.username}`);
        }

        // Create sample posts
        console.log('Creating sample posts...');
        const posts = [
            { user_id: userIds[0], content: 'Just had an amazing coffee at the new cafe downtown! ☕', category: 'lifestyle' },
            { user_id: userIds[1], content: 'Working on a new project today. Excited to share progress soon! 💻', category: 'technology' },
            { user_id: userIds[2], content: 'Beautiful sunset at the beach this evening 🌅', category: 'nature' },
            { user_id: userIds[0], content: 'Anyone have good book recommendations? Looking for something inspiring.', category: 'books' },
            { user_id: userIds[3], content: 'Finally finished my first marathon! Feeling accomplished 🏃‍♀️', category: 'sports' },
            { user_id: userIds[4], content: 'Trying out a new recipe tonight. Wish me luck! 🍳', category: 'food' },
            { user_id: userIds[1], content: 'The weather is perfect for a hike today! Who wants to join?', category: 'outdoors' },
            { user_id: userIds[2], content: 'Just finished reading an incredible article about climate change.', category: 'environment' },
            { user_id: userIds[3], content: 'Movie night recommendations? Looking for something fun!', category: 'entertainment' },
            { user_id: userIds[4], content: 'Started learning guitar. Any tips for beginners?', category: 'music' },
            { user_id: userIds[0], content: 'Weekend plans: absolutely nothing and I love it! 😊', category: 'lifestyle' },
            { user_id: userIds[1], content: 'Coffee shops are my favorite place to work. What about you?', category: 'lifestyle' },
            { user_id: userIds[2], content: 'Just adopted a puppy! Meet Max 🐕', category: 'pets' },
            { user_id: userIds[3], content: 'Traveling to Japan next month. Any must-visit places?', category: 'travel' },
            { user_id: userIds[4], content: 'Code review day. Time to help the team improve! 👨‍💻', category: 'technology' }
        ];

        const postIds = [];
        for (const post of posts) {
            const result = await client.query(
                'INSERT INTO posts (user_id, content, category) VALUES ($1, $2, $3) RETURNING id',
                [post.user_id, post.content, post.category]
            );
            postIds.push(result.rows[0].id);
        }
        console.log(`Created ${postIds.length} posts`);

        // Create sample likes (random distribution)
        console.log('Creating sample likes...');
        let likeCount = 0;
        for (const postId of postIds) {
            // Each post gets random number of likes (0-4)
            const numLikes = Math.floor(Math.random() * 5);
            const likers = new Set();
            
            for (let i = 0; i < numLikes; i++) {
                const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
                if (!likers.has(randomUser)) {
                    likers.add(randomUser);
                    await client.query(
                        'INSERT INTO likes (post_id, user_id) VALUES ($1, $2)',
                        [postId, randomUser]
                    );
                    likeCount++;
                }
            }

            // Update likes_count in posts table
            await client.query(
                'UPDATE posts SET likes_count = $1 WHERE id = $2',
                [likers.size, postId]
            );
        }
        console.log(`Created ${likeCount} likes`);

        // Create sample comments
        console.log('Creating sample comments...');
        const comments = [
            { post_id: postIds[0], user_id: userIds[1], content: 'Which cafe? I need to check it out!' },
            { post_id: postIds[0], user_id: userIds[2], content: 'Looks amazing! ☕' },
            { post_id: postIds[1], user_id: userIds[3], content: 'Can\'t wait to see what you\'re building!' },
            { post_id: postIds[2], user_id: userIds[0], content: 'Stunning view! 😍' },
            { post_id: postIds[3], user_id: userIds[4], content: 'Try "Atomic Habits" - life changing!' },
            { post_id: postIds[4], user_id: userIds[1], content: 'Congratulations! That\'s incredible! 🎉' },
            { post_id: postIds[5], user_id: userIds[2], content: 'Share the recipe if it turns out good!' },
            { post_id: postIds[6], user_id: userIds[3], content: 'I\'m in! What time?' },
            { post_id: postIds[8], user_id: userIds[0], content: 'Have you seen the new Marvel movie?' },
            { post_id: postIds[9], user_id: userIds[1], content: 'Practice makes perfect! Keep going!' }
        ];

        for (const comment of comments) {
            await client.query(
                'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)',
                [comment.post_id, comment.user_id, comment.content]
            );
        }
        console.log(`Created ${comments.length} comments`);

        console.log('\n✅ Database populated successfully!');
        console.log('\nSample credentials:');
        console.log('Email: john@example.com');
        console.log('Password: password123');
        console.log('\n(All users have the same password: password123)');

    } catch (error) {
        console.error('Error populating database:', error);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\nDatabase connection closed');
    }
}

// Run the population script
populateDatabase();
