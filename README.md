# Full Stack CRM Dashboard Application

This repository contains a full-stack CRM (Customer Relationship Management) application.
It includes a React frontend (`dashboard-ui`) and an Express.js backend API.

## Frontend Application (`dashboard-ui`)

Please refer to the `README.md` file within the `dashboard-ui` directory for specific instructions and details about the frontend application.

---

## Backend API (Express.js)

This is the backend API for the CRM dashboard application, built with Express.js.
It uses JWT for authentication and an in-memory database for data storage.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (comes with Node.js)

### Dependencies

The main backend dependencies are managed by `package.json` at the root of the project. Key dependencies include:
*   `express`: Web framework
*   `cors`: For enabling Cross-Origin Resource Sharing
*   `jsonwebtoken`: For JWT-based authentication
*   `bcryptjs`: For password hashing

To install all backend dependencies, run the following command from the root directory:
```bash
npm install
```

### Running the Backend Server

1.  Navigate to the root directory of the project.
2.  Ensure all dependencies are installed (`npm install`).
3.  Start the backend server using:
    ```bash
    npm start
    ```
    Alternatively, you can run `node index.js`.

The backend server will start on `http://localhost:3001` by default.

### API Endpoints Overview

All API endpoints are prefixed with `/api`.

#### 1. Authentication (`/api/auth`)

*   **`POST /signup`**: Register a new user.
    *   **Request Body:** `{ "username": "testuser", "email": "user@example.com", "password": "password123" }`
    *   **Response:** Success message and user object (excluding password).
*   **`POST /login`**: Log in an existing user.
    *   **Request Body:** `{ "email": "user@example.com", "password": "password123" }`
    *   **Response:** Success message, JWT token, and user object.
*   **`POST /logout`**: (Nominal) Logout user.
    *   **Note:** JWT logout is primarily client-side (clearing the token). This endpoint is provided for completeness.

#### 2. User Management (`/api/users` - Protected)

These routes require a valid JWT in the `Authorization: Bearer <token>` header.

*   **`GET /me`**: Get the profile of the currently authenticated user.
*   **`PUT /me`**: Update the profile (e.g., username, email) of the currently authenticated user.
*   **`DELETE /me`**: Delete the account of the currently authenticated user.

#### 3. Customers (`/api/customers` - Protected)

These routes require a valid JWT. Customers are associated with the user who created them.

*   **`GET /`**: Get all customers created by the authenticated user.
*   **`POST /`**: Create a new customer.
    *   **Request Body Example:** `{ "name": "Acme Corp", "email": "contact@acme.com", "company": "Acme Solutions", "status": "Active" }`
*   **`GET /:id`**: Get a specific customer by ID.
*   **`PUT /:id`**: Update a specific customer by ID.
*   **`DELETE /:id`**: Delete a specific customer by ID.

#### 4. Leads (`/api/leads` - Protected)

These routes require a valid JWT. Leads are associated with the user who created them.

*   **`GET /`**: Get all leads created by the authenticated user.
*   **`POST /`**: Create a new lead.
    *   **Request Body Example:** `{ "contactName": "John Doe", "companyName": "Doe Industries", "email": "john@doe.com", "phone": "555-1234", "status": "New" }`
*   **`GET /:id`**: Get a specific lead by ID.
*   **`PUT /:id`**: Update a specific lead by ID.
*   **`DELETE /:id`**: Delete a specific lead by ID.

#### 5. Notes (`/api/notes` - Protected)

These routes require a valid JWT. Notes are associated with the user who created them.

*   **`GET /`**: Get all notes created by the authenticated user.
*   **`POST /`**: Create a new note.
    *   **Request Body Example:** `{ "title": "Meeting Summary", "content": "Detailed notes about the meeting..." }`
*   **`GET /:id`**: Get a specific note by ID.
*   **`PUT /:id`**: Update a specific note by ID.
*   **`DELETE /:id`**: Delete a specific note by ID.

#### 6. Tasks (`/api/tasks` - Protected)

These routes require a valid JWT. Tasks are associated with the user who created them and can be assigned.

*   **`GET /`**: Get all tasks created by the authenticated user.
*   **`POST /`**: Create a new task.
    *   **Request Body Example:** `{ "title": "Follow up call", "description": "Call client about proposal.", "dueDate": "2024-09-15", "status": "Pending", "assignedTo": "userId" }` (assignedTo defaults to creator if not provided)
*   **`GET /:id`**: Get a specific task by ID.
*   **`PUT /:id`**: Update a specific task by ID.
*   **`DELETE /:id`**: Delete a specific task by ID.

### Route Protection

Most data-related routes (users, customers, leads, notes, tasks) are protected using JWT authentication. A valid token must be included in the `Authorization` header as a Bearer token for these routes to be accessed.

### Data Storage

The backend API currently uses an **in-memory database**. This means all data (users, customers, etc.) will be **reset if the server restarts**. This is for development and demonstration purposes. For persistent storage, a database like PostgreSQL, MongoDB, or SQLite would be integrated.

---

For development, ensure both the backend server and the frontend development server (from the `dashboard-ui` directory) are running simultaneously. The frontend is typically configured to proxy API requests to the backend server.
