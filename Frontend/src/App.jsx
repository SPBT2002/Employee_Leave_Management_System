import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login/Login'
import AdminDashboard from './components/AdminDashboard/AdminDashboard'
import EmployeeDashboard from './components/EmployeeDashboard/EmployeeDashboard'
import CreateAccount from './components/CreateAccount/CreateAccount'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [showCreateAccount, setShowCreateAccount] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
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
