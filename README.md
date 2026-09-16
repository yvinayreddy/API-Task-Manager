# API Task Manager

A simple full-stack task manager app built with Node.js, Express, MongoDB, and Mongoose. It includes JWT-based authentication and a lightweight browser frontend for login, register, and task management.

## Project Structure

```bash
API_Task_manager/
├── app.js
├── server.js
├── package.json
├── .env
├── README.md
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── taskController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── taskModel.js
│   └── userModel.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── routes/
│   ├── authRoutes.js
│   └── taskRoute.js
└── node_modules/
```

## Features

- User registration
- User login
- JWT authentication
- Create tasks
- Get all user tasks
- Update task status/completion
- Delete tasks
- Simple frontend UI served from the Express app

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- HTML, CSS, JavaScript

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Run the App

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## API Endpoints

### Auth

```http
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```http
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

All task routes require a valid Bearer token in the Authorization header.

## Example Request

```http
Authorization: Bearer <your_token>
```

## Notes

- Tasks are stored per logged-in user.
- The frontend is a basic UI for testing the backend quickly.
- MongoDB connection is configured through the `MONGO_URI` environment variable.
