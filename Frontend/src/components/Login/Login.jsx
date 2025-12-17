import { useState } from 'react';
import './Login.css';

function Login({ onLogin, onShowCreateAccount }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check admin credentials
    if (email === 'admin@company.com' && password === 'admin123') {
      onLogin({ 
        name: 'Admin User', 
        email: email, 
        role: 'admin' 
      });
      return;
    }

    // Check demo employee credentials
    if (email === 'employee@company.com' && password === 'emp123') {
      onLogin({ 
        name: 'Employee User', 
        email: email, 
        role: 'employee' 
      });
      return;
    }

    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin({
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
      });
    } else {
      alert('Invalid credentials! Please check your email and password or create an account.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#0d6efd" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>

        <h1 className="login-title">Leave Management System</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="sign-in-btn">
            Sign In
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">DEMO CREDENTIALS:</p>
          <p className="demo-item">
            <strong>Admin:</strong> admin@company.com / admin123
          </p>
          <p className="demo-item">
            <strong>Employee:</strong> employee@company.com / emp123
          </p>
        </div>

        <div className="create-account-link">
          <p>Don't have an account? <button onClick={onShowCreateAccount} className="link-btn">Create Account</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
