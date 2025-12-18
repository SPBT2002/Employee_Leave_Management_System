const express = require('express');
const router = express.Router();
const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  getLeaveById,
  deleteLeave
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

// Employee routes (both employee and admin can create/view their own leaves)
router.post('/', protect, createLeave);
router.get('/my-leaves', protect, getMyLeaves);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllLeaves);
router.put('/:id/status', protect, authorize('admin'), updateLeaveStatus);

// Shared routes (with role-based logic in controller)
router.get('/:id', protect, getLeaveById);
router.delete('/:id', protect, deleteLeave);

module.exports = router;
