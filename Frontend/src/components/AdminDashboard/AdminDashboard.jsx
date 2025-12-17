import { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Initialize leave requests from localStorage or use default data
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const savedRequests = localStorage.getItem('adminLeaveRequests');
    if (savedRequests) {
      return JSON.parse(savedRequests);
    }
    return [
      {
        id: 1,
        employee: 'John Doe',
        startDate: '12/20/2024',
        endDate: '12/22/2024',
        days: 3,
        reason: 'Family vacation',
        status: 'Pending'
      },
      {
        id: 2,
        employee: 'John Doe',
        startDate: '11/10/2024',
        endDate: '11/12/2024',
        days: 3,
        reason: 'Medical leave',
        status: 'Approved'
      }
    ];
  });

  // Save leave requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminLeaveRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const handleApprove = (id) => {
    setLeaveRequests(prev => {
      const updated = prev.map(req => {
        if (req.id === id) {
          const updatedReq = { ...req, status: 'Approved' };
          // Also update in employee's personal storage
          if (req.employeeEmail) {
            updateEmployeeLeaveRequest(req.employeeEmail, id, 'Approved');
          }
          return updatedReq;
        }
        return req;
      });
      return updated;
    });
  };

  const handleReject = (id) => {
    setLeaveRequests(prev => {
      const updated = prev.map(req => {
        if (req.id === id) {
          const updatedReq = { ...req, status: 'Rejected' };
          // Also update in employee's personal storage
          if (req.employeeEmail) {
            updateEmployeeLeaveRequest(req.employeeEmail, id, 'Rejected');
          }
          return updatedReq;
        }
        return req;
      });
      return updated;
    });
  };

  const updateEmployeeLeaveRequest = (employeeEmail, requestId, newStatus) => {
    const storageKey = `leaveRequests_${employeeEmail}`;
    const employeeRequests = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedRequests = employeeRequests.map(req =>
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedRequests));
  };

  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending').length;
  const approvedRequests = leaveRequests.filter(req => req.status === 'Approved').length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h1 className="header-title">Leave Manager</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="user-name">
              {user?.name || 'Admin User'} <span className="user-role">({user?.role || 'admin'})</span>
            </span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Welcome Message */}
      {showWelcome && (
        <div className="welcome-banner">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#0f5132" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Welcome back, {user?.name || 'Admin User'}!</span>
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="page-header">
          <h2 className="page-title">Leave Management</h2>
          <p className="page-subtitle">Review and manage all leave requests</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#0d6efd" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalRequests}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#fd7e14" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{pendingRequests}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#20c997" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{approvedRequests}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="table-container">
          <table className="leave-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>DAYS</th>
                <th>REASON</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employee}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.days}</td>
                  <td>{request.reason}</td>
                  <td>
                    <span className={`status-badge status-${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {request.status === 'Pending' && (
                        <>
                          <button 
                            className="action-btn approve-btn"
                            onClick={() => handleApprove(request.id)}
                            title="Approve"
                          >
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </button>
                          <button 
                            className="action-btn reject-btn"
                            onClick={() => handleReject(request.id)}
                            title="Reject"
                          >
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </>
                      )}
                      {request.status !== 'Pending' && <span className="no-actions">—</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
