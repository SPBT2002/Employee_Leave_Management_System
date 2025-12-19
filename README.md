# 🏢 Employee Leave Management System

<div align="center">

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure)

</div>

---

## 📖 About The Project

The **Employee Leave Management System** is a comprehensive web application designed to simplify and automate the leave request process in organizations. Say goodbye to paper forms and email chains! This system provides an intuitive interface for employees to submit leave requests and empowers administrators with powerful tools to manage and approve requests efficiently.

Whether you're a small startup or a growing enterprise, this system helps maintain transparency, accountability, and seamless communication between employees and management.

---

## ✨ Features

### 👨‍💼 For Employees
- 📝 **Submit Leave Requests** - Create leave applications with start date, end date, and reason
- 📊 **Track Status** - Monitor the status of submitted requests (Pending, Approved, Rejected)
- 📅 **Automatic Calculation** - System automatically calculates total leave days
- 🔒 **Secure Access** - JWT-based authentication ensures data privacy
- 📱 **Responsive Design** - Access from any device, anywhere

### 👨‍💼 For Administrators
- ✅ **Approve/Reject Requests** - Review and process leave applications with a single click
- 👥 **Account Management** - Create and manage employee accounts
- 📈 **Dashboard Overview** - Get a comprehensive view of all leave requests
- 🔍 **Filter & Search** - Easily find specific requests or employees
- 📊 **Analytics** - Track leave patterns and trends

### 🔐 Security Features
- 🔑 Password encryption using bcrypt
- 🎫 JWT token-based authentication
- 🛡️ Protected routes and middleware
- 👤 Role-based access control (Employee/Admin)

---

## 🛠 Tech Stack

### Frontend
- **React 19.2** - Modern UI library for building interactive interfaces
- **Vite** - Next-generation frontend tooling for blazing fast builds
- **CSS3** - Custom styling for a polished user experience

### Backend
- **Node.js** - JavaScript runtime for server-side logic
- **Express 5.2** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose 9.0** - Elegant MongoDB object modeling

### Authentication & Security
- **JWT (JSON Web Tokens)** - Secure authentication mechanism
- **bcryptjs** - Password hashing and encryption
- **CORS** - Cross-Origin Resource Sharing enabled

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

```bash
Node.js >= 14.x
npm >= 6.x
MongoDB >= 4.x
```

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SPBT2002/Employee_Leave_Management_System.git
cd Employee_Leave_Management_System
```

### 2️⃣ Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
# Add the following environment variables:
PORT=5000
MONGODB_URI=
JWT_SECRET=
NODE_ENV=

# Start the backend server
npm start
# or for development with auto-reload
node app.js
```

The backend server will start on `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
# Open a new terminal and navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

---

## 🎯 Usage

### First Time Setup

1. **Start MongoDB** - Ensure MongoDB is running on your system
2. **Launch Backend** - Run `npm start` in the Backend directory
3. **Launch Frontend** - Run `npm run dev` in the Frontend directory
4. **Create Admin Account** - Use the registration interface to create the first admin account

### Employee Workflow

1. **Create Account** - Create an account. If you already have an account, log in.
1. **Login** - Access the system using your credentials
2. **Dashboard** - View your leave request history
3. **Create Request** - Click "New Leave Request" and fill in the details
4. **Submit** - Review and submit your request
5. **Track** - Monitor the status from your dashboard

Default Admin User to log in:

- **Email:** admin@ems.com
- **Password:** admin123

### Admin Workflow

1. **Login** - Access the admin dashboard
2. **View Requests** - See all pending and processed leave requests
3. **Review** - Click on a request to view details
4. **Approve/Reject** - Make decisions with a single click


---

## 📁 Project Structure

```
Employee_Leave_Management_System/
│
├── 📂 Backend/                      # Server-side application
│   ├── 📄 app.js                    # Express app entry point
│   ├── 📄 package.json              # Backend dependencies
│   │
│   ├── 📂 config/
│   │   └── db.js                    # MongoDB connection configuration
│   │
│   ├── 📂 controllers/              # Request handlers
│   │   ├── authController.js        # Authentication logic (login, register)
│   │   └── leaveController.js       # Leave CRUD operations
│   │
│   ├── 📂 middleware/               # Custom middleware
│   │   └── auth.js                  # JWT authentication middleware
│   │
│   ├── 📂 models/                   # Database schemas
│   │   ├── User.js                  # User model (Employee/Admin)
│   │   └── Leave.js                 # Leave request model
│   │
│   └── 📂 routes/                   # API endpoints
│       ├── auth.js                  # Authentication routes
│       └── leaves.js                # Leave management routes
│
├── 📂 Frontend/                     # Client-side application
│   ├── 📄 index.html                # HTML entry point
│   ├── 📄 package.json              # Frontend dependencies
│   ├── 📄 vite.config.js            # Vite configuration
│   │
│   ├── 📂 public/                   # Static assets
│   │
│   └── 📂 src/
│       ├── 📄 App.jsx               # Root component
│       ├── 📄 App.css               # Global styles
│       ├── 📄 main.jsx              # React entry point
│       ├── 📄 index.css             # Base CSS
│       │
│       ├── 📂 assets/               # Images, icons, etc.
│       │
│       └── 📂 components/           # React components
│           ├── 📂 Login/            # Login interface
│           │   ├── Login.jsx
│           │   └── Login.css
│           │
│           ├── 📂 CreateAccount/    # Account creation (Admin)
│           │   ├── CreateAccount.jsx
│           │   └── CreateAccount.css
│           │
│           ├── 📂 EmployeeDashboard/ # Employee interface
│           │   ├── EmployeeDashboard.jsx
│           │   └── EmployeeDashboard.css
│           │
│           └── 📂 AdminDashboard/   # Admin interface
│               ├── AdminDashboard.jsx
│               └── AdminDashboard.css
│
└── 📄 README.md                     # About the project and Instructions
```

---

## 🔌 API Endpoints

### Authentication Routes
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
GET    /api/auth/me                # Get current user info
```

### Leave Management Routes
```
GET    /api/leaves                 # Get all leaves (Admin) or user's leaves (Employee)
POST   /api/leaves                 # Create new leave request
GET    /api/leaves/:id             # Get specific leave details
PUT    /api/leaves/:id             # Update leave status (Admin)

```
## 👨‍💻 Author

**Supun Piyumal**

---


