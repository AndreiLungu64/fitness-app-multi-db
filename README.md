# 💪 Fitness App - Dual Database System

A full-stack fitness application demonstrating distributed database architecture with PostgreSQL and MongoDB integration.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Database Architecture](#database-architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project implements a REST API backend with a dual database architecture, showcasing the integration of both relational (PostgreSQL) and document-based (MongoDB) databases in a single application. Built for a distributed databases course, it demonstrates proper database selection, cross-database relationships, and modern backend development practices.

### Why Two Databases?

- **PostgreSQL**: Handles structured, relational fitness data (exercises, workout plans, employees)
- **MongoDB**: Manages flexible, document-based user authentication and profiles

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🏋️ **Exercise Management** - Complete CRUD operations for exercises
- 📊 **Workout Plans** - Create and manage personalized workout routines
- 👥 **Employee Management** - Track gym staff with role-based access
- 🔄 **Cross-Database Relationships** - Workout plans reference users across databases
- 🎨 **React Frontend** - Simple UI to demonstrate API functionality
- 🛡️ **Role-Based Access Control** - Admin, Editor, and User roles
- 📱 **RESTful API** - Clean, documented endpoints

## 🗄️ Database Architecture

### Database 1: PostgreSQL (`fitness_app_db`)

**Tables:**

- `fitapp_exercises` - Exercise catalog
- `fitapp_workout_plans` - User workout plans
- `fitapp_workout_plan_exercises` - Junction table (many-to-many)
- `fitapp_employees` - Employee records

### Database 2: MongoDB (`fitness_app_users`)

**Collections:**

- `fitapp_users` - User authentication and profiles

### Architecture Diagram

```
┌─────────────────┐
│  React Frontend │
│  (Port 5173)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Express Server │
│  (Port 3500)    │
└────┬───────┬────┘
     │       │
     ↓       ↓
┌──────────┐ ┌──────────┐
│PostgreSQL│ │ MongoDB  │
│  (5432)  │ │ (27017)  │
└──────────┘ └──────────┘
```

## 🚀 Tech Stack

### Backend

- **Node.js** v20+ - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **MongoDB** - Document database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites

- Node.js v20+
- PostgreSQL 14+
- MongoDB 6+
- npm or yarn

### Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/fitness-app.git
cd fitness-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```bash
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
FITNESS_DB_NAME=fitness_app_db

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=fitness_app_users

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_secret_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here

# Server
PORT=3500
```

4. **Create PostgreSQL database**

```bash
createdb fitness_app_db
```

5. **Initialize PostgreSQL tables**

```bash
npx tsx db/init.ts
```

6. **Seed MongoDB users**

Open MongoDB Compass or shell and run:

```javascript
use fitness_app_users

db.fitapp_users.insertMany([
  {
    username: "dave1",
    password: "$2b$10$oEbHZlazDHE1YnnJ4XdpGuGh9a/JZOO7Xe6WZtRRsSMgprxMXnKza",
    roles: { User: 2001 },
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: "walt1",
    password: "$2b$10$33Q9jtAoaXC4aUX9Bjihxum2BHG.ENB6JyoCvPjnuXpITtUd8x8/y",
    roles: { User: 2001, Editor: 1984, Admin: 5150 },
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.fitapp_users.createIndex({ username: 1 }, { unique: true });
```

7. **Add sample employees to PostgreSQL**

```sql
INSERT INTO fitapp_employees (firstname, lastname) VALUES
('John', 'Doe'),
('Jane', 'Smith'),
('Mike', 'Johnson'),
('Sarah', 'Williams'),
('Tom', 'Brown');
```

8. **Start the backend server**

```bash
npm run dev
```

The backend should now be running on `http://localhost:3500`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd fitness-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /register
Content-Type: application/json

{
  "user": "testuser",
  "pwd": "password123"
}
```

#### Login

```http
POST /auth
Content-Type: application/json

{
  "user": "testuser",
  "pwd": "password123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```http
GET /logout
```

### Exercise Endpoints (PostgreSQL)

#### Get All Exercises

```http
GET /api/exercises
```

#### Get Exercise by ID

```http
GET /api/exercises/:id
```

#### Get Exercises by Muscle Group

```http
GET /api/exercises/muscle/:muscleGroup
```

#### Create Exercise (Requires JWT)

```http
POST /api/exercises
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Bench Press",
  "description": "Upper body exercise",
  "muscle_group": "chest",
  "difficulty": "intermediate",
  "equipment": "barbell",
  "instructions": "Lie on bench, lower bar to chest, press up"
}
```

### Employee Endpoints (PostgreSQL)

#### Get All Employees

```http
GET /employees
```

#### Get Employee by ID

```http
GET /employees/:id
```

### Workout Plan Endpoints (Requires JWT)

#### Get All Workout Plans

```http
GET /api/workout-plans
Authorization: Bearer {accessToken}
```

#### Create Workout Plan

```http
POST /api/workout-plans
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "user_id": "user_objectid_here",
  "name": "Full Body Workout",
  "description": "Complete body routine"
}
```

#### Add Exercise to Workout Plan

```http
POST /api/workout-plans/:id/exercises
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "exercise_id": 1,
  "sets": 3,
  "reps": 12,
  "order_index": 0,
  "notes": "Focus on form"
}
```

## 📁 Project Structure

```
fitness-app/
├── config/
│   ├── mongo.ts              # MongoDB connection
│   ├── corsOptions.ts        # CORS configuration
│   ├── allowedOrigins.ts     # Allowed domains
│   └── rolesList.ts          # Role definitions
├── controllers/
│   ├── authController.ts
│   ├── registerController.ts
│   ├── exercisesController.ts
│   ├── employeesController.ts
│   └── workoutPlansController.ts
├── db/
│   ├── db.ts                 # PostgreSQL connection
│   ├── init.ts               # Database initialization
│   └── queries/
│       └── schema_fitness_app.sql
├── middleware/
│   ├── verifyJWT.ts          # JWT verification
│   ├── verifyRoles.ts        # Role-based access
│   ├── credentials.ts        # CORS credentials
│   ├── errorHandler.ts       # Error handling
│   └── logEvents.ts          # Request logging
├── repository/
│   ├── exercisesRepository.ts
│   ├── employeesRepository.ts
│   ├── workoutPlansRepository.ts
│   └── usersRepository.mongo.ts
├── routes/api/
│   ├── auth.ts
│   ├── register.ts
│   ├── exercises.ts
│   ├── employees.ts
│   └── workoutPlans.ts
├── types/
│   └── globalTypes.ts        # TypeScript interfaces
├── server.ts                 # Main application
├── package.json
└── tsconfig.json
```

## 🎮 Usage

### Testing with Thunder Client / Postman

1. **Register a new user**

   - POST to `http://localhost:3500/register`
   - Body: `{ "user": "testuser", "pwd": "password123" }`

2. **Login**

   - POST to `http://localhost:3500/auth`
   - Copy the returned `accessToken`

3. **Get exercises**

   - GET to `http://localhost:3500/api/exercises`

4. **Create workout plan** (Protected)
   - POST to `http://localhost:3500/api/workout-plans`
   - Header: `Authorization: Bearer {accessToken}`

### Using the React Frontend

1. Open `http://localhost:5173`
2. Click "Get Exercises" to fetch exercises from PostgreSQL
3. Click "Get Employees" to fetch employees from PostgreSQL
4. View the data displayed in cards/lists

## 📸 Screenshots

### Frontend UI

![Frontend Screenshot](./screenshots/frontend.png)

### API Testing

![API Testing](./screenshots/api-test.png)

### Database Structure

![Database Diagram](./screenshots/db-structure.png)

## 🧪 Testing

### Test Users (Already Seeded)

| Username | Password | Roles               |
| -------- | -------- | ------------------- |
| dave1    | dave1    | User                |
| walt1    | walt1    | User, Editor, Admin |

### Sample Test Scenarios

1. ✅ User registration and authentication
2. ✅ Fetching exercises from PostgreSQL
3. ✅ Creating workout plans with cross-database references
4. ✅ Role-based access control
5. ✅ CORS configuration
6. ✅ Error handling

## 📝 License

## This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
