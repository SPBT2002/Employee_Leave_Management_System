# Employee Management System - Backend API

A RESTful API for managing employee leave requests with JWT authentication and role-based authorization.

## Features

- 🔐 JWT-based authentication
- 🔒 Password hashing with bcryptjs
- 👥 Role-based authorization (Admin & Employee)
- 📝 Leave request management
- ✅ Automatic leave duration calculation
- 📊 Leave history tracking
- 🛡️ Input validation and error handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Quick Start

### Step 1: Start Backend Server

1. Navigate to Backend folder:
```bash
cd Backend
npm install
```

2. The `.env` file is already configured with your MongoDB credentials

3. Start the server:
```bash
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.jkhnc0x.mongodb.net
Server is running on port 5000
```

### Step 2: Seed Database (Optional - First Time Only)

Create test accounts in the database:

```bash
npm run seed
```

This creates:
- **Admin:** admin@ems.com / admin123
- **Employees:** employee1@ems.com / emp123, employee2@ems.com / emp123, employee3@ems.com / emp123

### Step 3: Start Frontend

Open a new terminal and navigate to Frontend folder:

```bash
cd ../Frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173` (or similar)

### Step 4: Use the Application

1. Open your browser to the frontend URL
2. Login with test credentials or create a new account
3. All data is now saved to MongoDB database!

**Important:** Backend must be running on `http://localhost:5000` for frontend to work.

## Project Structure

```
Backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── leaveController.js    # Leave management logic
├── middleware/
│   └── auth.js               # JWT verification & authorization
├── models/
│   ├── User.js               # User schema
│   └── Leave.js              # Leave schema
├── routes/
│   ├── auth.js               # Auth routes
│   └── leaves.js             # Leave routes
├── .env                      # Environment variables
├── .gitignore
├── app.js                    # Main application file
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file and replace the placeholder values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://supunthennakoon27_db_user:YOUR_PASSWORD@cluster0.jkhnc0x.mongodb.net/ems_database?retryWrites=true&w=majority
JWT_SECRET=your_strong_jwt_secret_key_here
NODE_ENV=development
```

**Important:** Replace `YOUR_PASSWORD` with your actual MongoDB password.

### 3. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "fullName": "Full Name",
    "role": "employee"
  }
}
```

#### 2. Register (For Testing/Setup)
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "employee"
}
```

#### 3. Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

### Leave Management Routes

#### 1. Create Leave Request (Employee Only)
```http
POST /leaves
Authorization: Bearer {token}
Content-Type: application/json

{
  "startDate": "2025-12-20",
  "endDate": "2025-12-22",
  "reason": "Personal vacation for family trip"
}
```

**Response:**
```json
{
  "success": true,
  "leave": {
    "id": "leave_id",
    "employee": { ... },
    "startDate": "2025-12-20T00:00:00.000Z",
    "endDate": "2025-12-22T00:00:00.000Z",
    "reason": "Personal vacation for family trip",
    "status": "Pending",
    "totalDays": 3,
    "createdAt": "2025-12-18T..."
  }
}
```

#### 2. Get My Leave History (Employee Only)
```http
GET /leaves/my-leaves
Authorization: Bearer {token}
```

#### 3. Get All Leave Requests (Admin Only)
```http
GET /leaves/all
Authorization: Bearer {token}
```

#### 4. Update Leave Status (Admin Only)
```http
PUT /leaves/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Approved"
}
```

Status options: `"Approved"` or `"Rejected"`

#### 5. Get Single Leave Request
```http
GET /leaves/:id
Authorization: Bearer {token}
```

#### 6. Delete Leave Request
```http
DELETE /leaves/:id
Authorization: Bearer {token}
```

## User Roles

### Employee
- Can create leave requests
- Can view their own leave history
- Can delete their own pending leave requests

### Admin
- Can view all leave requests
- Can approve/reject leave requests
- Can delete any leave request

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

The token is returned upon successful login and is valid for 30 days.

## Business Logic

### Leave Request Validation
- End date must not be before start date
- All fields (startDate, endDate, reason) are required
- Reason must be at least 10 characters long

### Total Days Calculation
- Automatically calculated: `(endDate - startDate) + 1`
- Includes both start and end dates

### Leave Status
- `Pending` - Initial status when created
- `Approved` - Approved by admin
- `Rejected` - Rejected by admin

## Creating Test Users

You can use the register endpoint to create test users:

**Create an Admin:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@ems.com",
    "password": "admin123",
    "fullName": "Admin User",
    "role": "admin"
  }'
```

**Create an Employee:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "employee1",
    "email": "employee1@ems.com",
    "password": "emp123",
    "fullName": "Employee One",
    "role": "employee"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials or no token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Role-based access control
- Input validation on all endpoints
- Protected routes require authentication

## Testing the API

You can test the API using:
- **Postman** - Import the endpoints
- **Thunder Client** - VS Code extension
- **curl** - Command line tool
- **Your Frontend** - React application

## Troubleshooting

### MongoDB Connection Issues
1. Check your MongoDB URI in `.env`
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Verify your database password is correct

### Authentication Errors
1. Ensure JWT_SECRET is set in `.env`
2. Check token format: `Bearer {token}`
3. Verify token hasn't expired

### Port Already in Use
Change the PORT in `.env` file to a different port (e.g., 5001)

## Production Deployment

For production:
1. Set `NODE_ENV=production` in `.env`
2. Use a strong JWT_SECRET (generate using crypto)
3. Consider removing the `/auth/register` endpoint
4. Enable HTTPS
5. Set up proper logging
6. Configure CORS for your frontend domain

## Next Steps

1. Update `.env` with your MongoDB password
2. Start the server: `npm run dev`
3. Create test users using the register endpoint
4. Test the API endpoints with Postman or Thunder Client
5. Connect your frontend application

## Support

For issues or questions, please check:
- MongoDB connection is active
- All environment variables are set correctly
- Required npm packages are installed
- Port 5000 is available

---

**Created for Employee Management System - December 2025**
