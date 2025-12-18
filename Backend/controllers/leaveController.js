const Leave = require('../models/Leave');
const User = require('../models/User');

// @desc    Create a new leave request
// @route   POST /leaves
// @access  Private (Employee only)
const createLeave = async (req, res) => {
  try {
    console.log('=== CREATE LEAVE REQUEST ===');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    
    const { startDate, endDate, reason } = req.body;

    // Validate input
    if (!startDate || !endDate || !reason) {
      console.log('Missing fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    console.log('Dates:', { start, end });
    
    if (end < start) {
      console.log('Invalid date range');
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    // Calculate total days
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Create leave request
    console.log('Creating leave with employee ID:', req.user._id);
    const leave = await Leave.create({
      employee: req.user._id,
      startDate: start,
      endDate: end,
      reason: reason,
      status: 'Pending',
      totalDays: totalDays,
      updatedAt: Date.now()
    });

    console.log('✅ Leave created successfully:', leave._id);

    // Populate employee details
    const populatedLeave = await Leave.findById(leave._id).populate('employee', 'username email fullName');

    res.status(201).json({
      success: true,
      leave: populatedLeave
    });
  } catch (error) {
    console.error('❌ ERROR in createLeave:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get employee's own leave history
// @route   GET /leaves/my-leaves
// @access  Private (Employee only)
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id })
      .populate('employee', 'username email fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all leave requests
// @route   GET /leaves/all
// @access  Private (Admin only)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employee', 'username email fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /leaves/:id/status
// @access  Private (Admin only)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "Approved" or "Rejected"' });
    }

    // Find leave request
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update status
    leave.status = status;
    leave.updatedAt = Date.now();
    await leave.save();

    // Populate employee details
    await leave.populate('employee', 'username email fullName');

    res.status(200).json({
      success: true,
      leave
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single leave request
// @route   GET /leaves/:id
// @access  Private
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'username email fullName');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user is authorized to view this leave
    if (req.user.role === 'employee' && leave.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this leave request' });
    }

    res.status(200).json({
      success: true,
      leave
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete leave request
// @route   DELETE /leaves/:id
// @access  Private (Employee can delete own pending leaves, Admin can delete any)
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check authorization
    if (req.user.role === 'employee') {
      // Employee can only delete their own pending leaves
      if (leave.employee.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this leave request' });
      }
      if (leave.status !== 'Pending') {
        return res.status(400).json({ message: 'Cannot delete a leave request that is not pending' });
      }
    }

    await leave.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Leave request deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  getLeaveById,
  deleteLeave
};
