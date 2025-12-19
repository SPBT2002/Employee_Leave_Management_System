import { useState, useEffect } from 'react';
import './EmployeeDashboard.css';

const API_BASE_URL = 'http://localhost:5000';

function EmployeeDashboard({ user, onLogout }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newLeave, setNewLeave] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Fetch leave requests from backend
  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/leaves/my-leaves`, {
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
    fetchLeaveRequests();
    
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      console.log('Token:', token);
      console.log('Submitting leave:', { startDate: newLeave.startDate, endDate: newLeave.endDate, reason: newLeave.reason });
      
      if (!token) {
        alert('You are not logged in! Please logout and login again with: employee1@ems.com / emp123');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          startDate: newLeave.startDate,
          endDate: newLeave.endDate,
          reason: newLeave.reason
        })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        alert('✅ Leave request submitted successfully!');
        setNewLeave({ startDate: '', endDate: '', reason: '' });
        setShowApplyForm(false);
        fetchLeaveRequests(); // Refresh the list
      } else {
        const error = await response.json();
        console.error('Server error response:', error);
        
        if (response.status === 401) {
          alert('⚠️ Authentication failed! You need to:\n1. Click Logout\n2. Login with: employee1@ems.com / emp123\n3. Try again');
        } else {
          alert(`❌ Error: ${error.message || JSON.stringify(error)}`);
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      alert(`❌ Cannot connect to server!\n\nMake sure:\n1. Backend is running (npm run dev in Backend folder)\n2. Server is on http://localhost:5000\n\nError: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = leaveRequests.filter(req => req.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(req => req.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(req => req.status === 'Rejected').length;

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          
          <h1 className="header-title">Employee Leave Management System 🗓️</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            
            <span className="user-name">
              {user?.name || 'John Doe'} <span className="user-role">({user?.role || 'employee'})</span>
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
          <span>👋😊  Welcome back, {user?.name || 'John Doe'}!</span>
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">My Leave Requests</h2>
            <p className="page-subtitle">Manage your time off</p>
          </div>
          <button className="apply-leave-btn" onClick={() => setShowApplyForm(true)}>
            ✚ Apply for Leave
          </button>
        </div>
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              ⏳
            </div>
            <div className="stat-content">
              <div className="stat-number">{pendingCount}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              ✅
            </div>
            <div className="stat-content">
              <div className="stat-number">{approvedCount}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-red">
              ❌
            </div>
            <div className="stat-content">
              <div className="stat-number">{rejectedCount}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="table-container">
          <table className="leave-table">
            <thead>
              <tr>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>DAYS</th>
                <th>REASON</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading...
                  </td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    No leave requests found. Apply for your first leave!
                  </td>
                </tr>
              ) : (
                leaveRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{new Date(request.startDate).toLocaleDateString('en-GB')}</td>
                    <td>{new Date(request.endDate).toLocaleDateString('en-GB')}</td>
                    <td>{request.totalDays}</td>
                    <td>{request.reason}</td>
                    <td>
                      <span className={`status-badge status-${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Apply for Leave Modal */}
      {showApplyForm && (
        <div className="modal-overlay" onClick={() => setShowApplyForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Leave</h3>
              <button className="close-btn" onClick={() => setShowApplyForm(false)}>
                <svg 
                  width="20" 
                  height="20" 
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
            </div>
            <form onSubmit={handleSubmitLeave}>
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  className="date-input"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  className="date-input"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                  min={newLeave.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea
                  id="reason"
                  rows="3"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                  placeholder="Enter the reason for your leave request"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
