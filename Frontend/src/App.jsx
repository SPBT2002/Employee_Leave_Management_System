import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login/Login'
import AdminDashboard from './components/AdminDashboard/AdminDashboard'
import EmployeeDashboard from './components/EmployeeDashboard/EmployeeDashboard'
import CreateAccount from './components/CreateAccount/CreateAccount'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [showCreateAccount, setShowCreateAccount] = useState(false)

  
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; 
  
  
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    const lastActivity = localStorage.getItem('lastActivity')
    
    if (savedUser && lastActivity) {
      const currentTime = new Date().getTime()
      const timeSinceActivity = currentTime - parseInt(lastActivity)
      
      
      if (timeSinceActivity > INACTIVITY_TIMEOUT) {
        handleLogout()
        alert('Your session has expired due to inactivity. Please log in again.')
      } else {
        setCurrentUser(JSON.parse(savedUser))
        
        localStorage.setItem('lastActivity', currentTime.toString())
      }
    } else if (savedUser) {
      
      setCurrentUser(JSON.parse(savedUser))
      localStorage.setItem('lastActivity', new Date().getTime().toString())
    }
  }, [])

  
  useEffect(() => {
    if (!currentUser) return;

    const checkInactivity = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity')
      if (lastActivity) {
        const currentTime = new Date().getTime()
        const timeSinceActivity = currentTime - parseInt(lastActivity)
        
        
        if (timeSinceActivity > INACTIVITY_TIMEOUT) {
          handleLogout()
          alert('You have been logged out due to inactivity.')
        }
      }
    }, 60000); 

    return () => clearInterval(checkInactivity)
  }, [currentUser])

  
  useEffect(() => {
    if (!currentUser) return;

    const updateActivity = () => {
      localStorage.setItem('lastActivity', new Date().getTime().toString())
    }

    
    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('mousedown', updateActivity)
    window.addEventListener('keypress', updateActivity)
    window.addEventListener('scroll', updateActivity)
    window.addEventListener('touchstart', updateActivity)
    window.addEventListener('click', updateActivity)

    return () => {
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('mousedown', updateActivity)
      window.removeEventListener('keypress', updateActivity)
      window.removeEventListener('scroll', updateActivity)
      window.removeEventListener('touchstart', updateActivity)
      window.removeEventListener('click', updateActivity)
    }
  }, [currentUser])

  const handleLogin = (user) => {
    const currentTime = new Date().getTime()
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('lastActivity', currentTime.toString())
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    localStorage.removeItem('lastActivity')
    localStorage.removeItem('user')
  }

  const handleShowCreateAccount = () => {
    setShowCreateAccount(true)
  }

  const handleBackToLogin = () => {
    setShowCreateAccount(false)
  }

  const handleAccountCreated = () => {
    setShowCreateAccount(false)
  }

  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />
    } else if (currentUser.role === 'employee') {
      return <EmployeeDashboard user={currentUser} onLogout={handleLogout} />
    }
  }

  if (showCreateAccount) {
    return <CreateAccount onAccountCreated={handleAccountCreated} onBackToLogin={handleBackToLogin} />
  }

  return <Login onLogin={handleLogin} onShowCreateAccount={handleShowCreateAccount} />
}

export default App
