# Task Nexus - Premium Task Management System

Task Nexus is a production-ready, scalable Task Management System designed for modern teams. It features a stunning glassmorphism UI, real-time collaboration, and smart task management features.

## 🚀 Features

### Core Modules
- **Auth & RBAC**: Secure JWT-based authentication with Refresh Tokens. Roles: Admin, Manager, User.
- **Task Management**: Full CRUD, Kanban board, priorities, and status workflows.
- **Analytics**: Beautiful dashboards using Chart.js with productivity trends and task distribution.
- **Real-time**: Live updates for task changes using Socket.io.

### Smart & Unique Features
- **AI Priority Suggestion**: Automatically suggests 'Critical' priority based on task description keywords (rule-based simulation).
- **Productivity Scoring**: Tracks user productivity based on task completion density.
- **Activity Logs**: Full audit trail of who changed what and when.
- **Glassmorphism UI**: Premium design with blurred backgrounds, vibrant gradients, and smooth animations.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Redux Toolkit, Framer Motion, Chart.js.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, Node-cron.
- **Security**: Helmet, Rate Limiting, Input Validation, BCrypt.

## 📋 Prerequisites
- Node.js (v16+)
- MongoDB (running locally or a connection URI)

## 🏁 Getting Started

### 1. Clone & Setup Backend
```bash
cd backend
npm install
# Update .env with your MongoDB URI
npm run seed  # To populate initial data
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Default Login Credentials
- **Admin**: `admin@tasknexus.com` / `password123`
- **Manager**: `manager@tasknexus.com` / `password123`
- **User**: `joe@tasknexus.com` / `password123`

## 🏗️ Architecture
The system follows a Controller-Service-Repository pattern (implemented via Mongoose models) to ensure scalability and maintainability.

- **Models**: Define data structures and business rules (e.g., password hashing).
- **Controllers**: Handle HTTP request/response logic.
- **Middleware**: Manage Auth, Logging, and Validation.
- **Realtime**: Sockets handle live notifications and board updates.

## 🧪 API Documentation (Sample)
- `POST /api/auth/login`: Authenticate user
- `GET /api/tasks`: Get all tasks (supports filters)
- `POST /api/tasks`: Create new task (triggers AI suggestion)
- `GET /api/analytics/dashboard`: Get dashboard statistics
