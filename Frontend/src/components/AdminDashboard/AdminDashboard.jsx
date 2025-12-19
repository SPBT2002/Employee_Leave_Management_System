import { useState, useEffect } from 'react';
import './AdminDashboard.css';

const API_BASE_URL = 'http://localhost:5000';

function AdminDashboard({ user, onLogout }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all leave requests from backend
  const fetchAllLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/leaves/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data.leaves || []);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLeaveRequests();
    
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/leaves/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Approved' })
      });

      if (response.ok) {
        alert('Leave request approved successfully!');
        fetchAllLeaveRequests(); 
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to approve leave request');
      }
    } catch (err) {
      console.error('Error approving leave:', err);
      alert('Unable to connect to server');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/leaves/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Rejected' })
      });

      if (response.ok) {
        alert('Leave request rejected successfully!');
        fetchAllLeaveRequests(); 
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to reject leave request');
      }
    } catch (err) {
      console.error('Error rejecting leave:', err);
      alert('Unable to connect to server');
    }
  };

  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending').length;
  const approvedRequests = leaveRequests.filter(req => req.status === 'Approved').length;
  const rejectedRequests = leaveRequests.filter(req => req.status === 'Rejected').length;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="header-title">Employee Leave Management System 🗓️</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">
              {user?.name || 'Admin User'} <span className="user-role">({user?.role || 'admin'})</span>
            </span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout ➜]
          </button>
        </div>
      </header>

      {/* Welcome Message */}
      {showWelcome && (
        <div className="welcome-banner">
          <span>👋😊 Welcome back, {user?.name || 'Admin User'}!</span>
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="page-header">
          <h2 className="page-title">All Leave Requests</h2>
        </div>

                        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-yellow">
              📊
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalRequests}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              ⌛
            </div>
            <div className="stat-content">
              <div className="stat-number">{pendingRequests}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              ✅
            </div>
            <div className="stat-content">
              <div className="stat-number">{approvedRequests}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-red">
              ❌
            </div>
            <div className="stat-content">
              <div className="stat-number">{rejectedRequests}</div>
              <div className="stat-label">Rejected</div>
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
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading...
                  </td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaveRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.employee?.fullName || 'Unknown'}</td>
                    <td>{new Date(request.startDate).toLocaleDateString('en-GB')}</td>
                    <td>{new Date(request.endDate).toLocaleDateString('en-GB')}</td>
                    <td>{request.totalDays}</td>
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
                              onClick={() => handleApprove(request._id)}
                              title="Approve"
                            >✅
                            </button>
                            <button 
                              className="action-btn reject-btn"
                              onClick={() => handleReject(request._id)}
                              title="Reject"
                            >❌
                            </button>
                          </>
                        )}
                        {request.status !== 'Pending' && <span className="no-actions">—</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
