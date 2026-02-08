# Issue Tracker Application

A full-stack Issue Tracker application built as a technical assignment to demonstrate practical skills in designing, developing, and deploying a data-driven CRUD system with authentication, role-based access patterns, and a clean user experience.

The application allows users to register, log in, create and manage issues, track their status, and interact with a modern dashboard interface.

---

## 🔗 Live Application

- **Frontend (Netlify)**  
  👉 [https://issue-hub.netlify.app/](https://issue-hub.netlify.app/)

- **Backend API (Render)**  
  👉 https://newnop-associate-frontend-developer.onrender.com/api/v1

> The application is fully functional and can be used directly via the live frontend without any local setup.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Axios
- JWT-based authentication

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MongoDB
- JSON Web Tokens (JWT)
- bcrypt for password hashing

### Deployment
- Frontend: **Netlify**
- Backend: **Render**

---

## ✨ Core Features

### 🔐 Authentication & Authorization
- User registration using email and password
- Secure password hashing
- User login with JWT authentication
- Token-based session handling
- Protected API routes

---

### 🐞 Issue Management (CRUD)
- Create new issues with:
  - Title
  - Description
  - Status (Open, In Progress, Resolved, Closed)
  - Priority (Low, Medium, High)
  - Severity (Minor, Major, Critical, Enhancement)
- View all issues in a centralized dashboard
- View detailed information for a single issue
- Update issue details
- Delete issues
- Change issue status with confirmation logic

---

### 📊 Dashboard & UX
- Sidebar-based dashboard layout
- Issue counts by status
- Visual indicators for:
  - Status
  - Priority
  - Severity
- Search and filter issues
- Clean and reusable UI components
- Responsive design for all screen sizes

---

### 📤 Data Export
- Export issue list as CSV
- Export issue list as JSON

---

## 🌍 API Overview

All API endpoints are versioned and follow RESTful conventions.

### Authentication
- `POST /api/v1/auth/signup` – Register a new user
- `POST /api/v1/auth/login` – Authenticate user and receive tokens
- `GET /api/v1/auth/me` – Get current authenticated user

### Issues
- `GET /api/v1/issues` – Fetch all issues (with filters)
- `GET /api/v1/issues/:id` – Fetch issue by ID
- `POST /api/v1/issues` – Create a new issue
- `PUT /api/v1/issues/:id` – Update an issue
- `DELETE /api/v1/issues/:id` – Delete an issue
- `GET /api/v1/issues/export/csv` – Export issues as CSV

> All issue-related endpoints are protected and require a valid JWT.

---

## 🧪 Using the Application

1. Visit the live frontend link.
2. Register using a valid email and password.
3. Log in to access the dashboard.
4. Create, manage, filter, and export issues directly from the UI.

No local setup or configuration is required to use the application.

---

## 🧠 Design & Development Notes

- The project follows a clean separation of concerns between frontend and backend.
- Prisma ORM is used for type-safe database access.
- API requests are optimized with filtering and pagination support.
- Authentication logic follows industry best practices.
- The system is designed to be scalable and easily extensible.

---



## 🚀 Deployment Ready

The application is production-ready and successfully deployed:
- Backend runs as a stateless API service on Render
- Frontend is served via Netlify CDN
- Environment variables are managed securely in production

---

## 👤 Author

**Nishan Tharaka**  
Undergraduate Software Engineer  
Specialized in backend development, databases, and modern web technologies.

---

## 📌 Notes for Reviewers

This project was developed as part of an interview assignment to demonstrate:
- Problem-solving approach
- API design
- Secure authentication
- Full-stack integration
- Deployment and real-world readiness

Thank you for taking the time to review this submission.


