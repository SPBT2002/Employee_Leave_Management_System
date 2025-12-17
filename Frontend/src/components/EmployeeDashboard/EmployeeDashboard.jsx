import { useState, useEffect } from 'react';
import './EmployeeDashboard.css';

function EmployeeDashboard({ user, onLogout }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  // Get storage key for this specific employee
  const getStorageKey = () => `leaveRequests_${user.email}`;
  
  // Initialize leave requests from localStorage for this specific employee
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const savedRequests = localStorage.getItem(getStorageKey());
    if (savedRequests) {
      return JSON.parse(savedRequests);
    }
    // Return empty array for new employees, or demo data for demo account
    if (user.email === 'employee@company.com') {
      return [
        {
          id: 1,
          startDate: '12/20/2024',
          endDate: '12/22/2024',
          days: 3,
          reason: 'Family vacation',
          status: 'Pending'
        },
        {
          id: 2,
          startDate: '11/10/2024',
          endDate: '11/12/2024',
          days: 3,
          reason: 'Medical leave',
          status: 'Approved'
        }
      ];
    }
    return [];
  });

  const [newLeave, setNewLeave] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Save leave requests to localStorage for this specific employee
  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    const days = calculateDays(newLeave.startDate, newLeave.endDate);
    
    const newRequest = {
      id: Date.now(), // Use timestamp for unique ID
      employee: user.name,
      employeeEmail: user.email,
      startDate: new Date(newLeave.startDate).toLocaleDateString('en-US'),
      endDate: new Date(newLeave.endDate).toLocaleDateString('en-US'),
      days: days,
      reason: newLeave.reason,
      status: 'Pending'
    };

    // Add to employee's personal leave requests
    setLeaveRequests([newRequest, ...leaveRequests]);
    
    // Also add to admin's view of all leave requests
    const adminRequests = JSON.parse(localStorage.getItem('adminLeaveRequests') || '[]');
    adminRequests.unshift(newRequest);
    localStorage.setItem('adminLeaveRequests', JSON.stringify(adminRequests));
    
    setNewLeave({ startDate: '', endDate: '', reason: '' });
    setShowApplyForm(false);
    alert('Leave request submitted successfully!');
  };

  const pendingCount = leaveRequests.filter(req => req.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(req => req.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(req => req.status === 'Rejected').length;

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          
          <h1 className="header-title">Leave Manager</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            
            <span className="user-name">
              {user?.name || 'John Doe'} <span className="user-role">({user?.role || 'employee'})</span>
            </span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            
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
          <span>Welcome back, {user?.name || 'John Doe'}!</span>
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Apply for Leave
          </button>
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
                stroke="#2563eb" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{pendingCount}</div>
              <div className="stat-label">Pending</div>
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
              <div className="stat-number">{approvedCount}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-red">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#dc3545" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
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
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.days}</td>
                  <td>{request.reason}</td>
                  <td>
                    <span className={`status-badge status-${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
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
