require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');


const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leaves');


const app = express();


const initializeAdmin = async () => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  Skipping admin initialization - Database not connected');
      return;
    }
    
    const adminExists = await User.findOne({ email: 'admin@ems.com' });
    
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@ems.com',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'admin'
      });
      console.log('✓ Admin account created successfully');
      console.log('  Email: admin@ems.com');
      console.log('  Password: admin123');
    } else {
      console.log('✓ Admin account already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error.message);
  }
};


connectDB().then((conn) => {
  if (conn) {
    initializeAdmin();
  }
}).catch((err) => {
  console.error('Database connection attempt failed:', err.message);
});


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


app.use('/auth', authRoutes);
app.use('/leaves', leaveRoutes);


app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Employee Management System API',
    version: '1.0.0',
    status: 'Running'
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
