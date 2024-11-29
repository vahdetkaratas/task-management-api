# Task Management API

A Node.js-based Task Management API with real-time collaboration and robust authentication. This API allows users to manage tasks, collaborate in real-time, and provides admin-level features for user management.

---

## Features

### **Implemented Features**

#### Authentication
- User **Sign Up** and **Log In** with secure password handling (`bcrypt`).
- **JWT-based Authentication** with token expiry (1 hour).
- Role-based access control (RBAC) for admin and user privileges.

#### Task Management
- **Create Tasks**: Add tasks with attributes such as title, description, priority, due date, and status.
- **Retrieve Tasks**: View all tasks with support for filtering, sorting, and pagination.
- **Update Tasks**: Edit task details like status and priority.
- **Delete Tasks**: Remove tasks by ID.

#### Admin Features
- **View Users**: Admins can retrieve a list of all registered users.
- **Delete Users**: Admins can delete user accounts.

#### Real-Time Collaboration
- **Collaborative Task Editing**:
  - Multiple users can join task-specific rooms.
  - Real-time updates are broadcast to all connected users in the room via WebSocket.

#### API Documentation
- **Swagger/OpenAPI Documentation**:
  - View complete API documentation at `/api-docs`.

---

## Features Not Implemented
- **Email Notifications**: Sending task-related updates via email.
- **Rate Limiting**: Preventing excessive API requests.
- **CORS**: Restricting access to the API from specific domains.
- **Recurring Tasks**: Support for tasks that repeat periodically.
- **Activity Feed**: Logging and displaying user actions for admin review.
- **Drag-and-Drop Task Prioritization**: Visual task prioritization (requires front-end).

---
