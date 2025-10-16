# Murmura

An anonymous confession site where you can post your confessions and stories as you wish.

Currently this project is in very early development stages - the purpose is to improve it while improving myself.

## Project Structure

```
murmura/
├── client/          # Frontend (React + Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── index.css
│   └── package.json
├── server/          # Backend (Express + PostgreSQL)
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   └── package.json
└── package.json     # Root package for managing both
```

## Tech Stack

### Frontend
- React 19.1.1
- Vite 7.1.2
- Tailwind CSS v4 (with dark pastel theme)
- React Router 7.8.2
- React Infinite Scroll Component

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Bcrypt for password hashing

## Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd murmura
```

2. Install all dependencies:
```bash
npm run install:all
```

Or install separately:
```bash
# Install root dependencies
npm install

# Install client dependencies
npm run install:client

# Install server dependencies
npm run install:server
```

3. Configure environment variables:

Create a `.env` file in the `server/` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=murmura
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=10
```

4. Run database migrations:
```bash
cd server
node -e "require('./utils/database.js').migrateTables()"
```

## Development

### Run both client and server concurrently:
```bash
npm run dev
```

### Run separately:
```bash
# Run client (frontend)
npm run dev:client

# Run server (backend)
npm run dev:server
```

The client will be available at `http://localhost:5173` (Vite default)

The server will be available at `http://localhost:3000` (or your configured port)

## Build

Build the client for production:
```bash
npm run build:client
```

## Features

- User registration and authentication (JWT)
- Post creation, viewing, and deletion
- Like functionality
- Infinite scroll for posts
- Dark pastel theme
- Responsive design

## Database Schema

### Users Table
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- created_at

### Posts Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users)
- content
- created_at
- likes_count

### Additional Tables
- likes
- comments
- categories
- post_categories

## License

ISC
