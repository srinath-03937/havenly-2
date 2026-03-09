const express = require('express');
const { User, Room, Transaction, Complaint, Notice } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Middleware
router.use(authenticate);
router.use(authorize(['student']));

// GET student's room details
router.get('/room', async (req, res) => {
  try {
    const user = await User.findByIdWithRoom(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return room object if assigned, otherwise return null (200)
    return res.json(user.room_id || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET student's transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.findByUserId(req.user.id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET pending dues
router.get('/pending-dues', async (req, res) => {
  try {
    const transactions = await Transaction.findPendingByUserId(req.user.id);
    const totalDues = transactions.reduce((sum, t) => sum + t.amount, 0);
    res.json({ totalDues, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE transaction status (pay dues)
router.put('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.update(req.params.id, { status: 'Paid' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE complaint
router.post('/complaints', async (req, res) => {
  try {
    const { category, description } = req.body;
    const complaint = await Complaint.create({
      user_id: req.user.id,
      category,
      description
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET student's complaints (active only - excludes complaints resolved > 24h ago)
router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.findActiveByUserId(req.user.id);
    const enrichedComplaints = complaints.map(complaint => ({
      ...complaint,
      user_id: { id: req.user.id, name: req.user.name }
    }));
    res.json(enrichedComplaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET student's complaints history (includes all complaints)
router.get('/complaints-history', async (req, res) => {
  try {
    const complaints = await Complaint.findHistoryByUserId(req.user.id);
    const enrichedComplaints = complaints.map(complaint => ({
      ...complaint,
      user_id: { id: req.user.id, name: req.user.name }
    }));
    res.json(enrichedComplaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET notices
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.findAll();
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all rooms (student-facing)
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// BOOK a room (with payment required)
router.post('/rooms/:roomId/book', async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Check if user already has a room assigned
    const existingUser = await User.findById(req.user.id);
    if (existingUser && existingUser.room_id) {
      return res.status(400).json({ 
        message: 'You already have a room assigned. Students can only book one room at a time. Please contact admin if you need to change rooms.' 
      });
    }
    
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check room capacity
    const occupancy = room.occupancy || 0;
    const capacity = room.capacity || 1;
    if (occupancy >= capacity) {
      return res.status(400).json({ message: 'Room is fully occupied' });
    }

    // Additional validation: Double-check user doesn't have a room (race condition protection)
    const userCheck = await User.findById(req.user.id);
    if (userCheck && userCheck.room_id) {
      return res.status(400).json({ 
        message: 'Another booking was processed simultaneously. You can only book one room.' 
      });
    }

    // Create transaction for first month's rent
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const transaction = await Transaction.create({
      user_id: req.user.id,
      room_id: roomId,
      amount: room.price,
      month: currentMonth,
      status: 'Pending',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Due in 7 days
    });

    // Assign room to student
    const updatedUser = await User.update(req.user.id, { room_id: roomId });
    
    // Update room occupancy
    const updatedRoom = await Room.update(roomId, { 
      occupancy: occupancy + 1 
    });
    
    res.json({ 
      message: 'Room booked successfully! Please complete payment within 7 days.',
      room: updatedRoom,
      user: updatedUser,
      transaction: {
        id: transaction.id,
        amount: room.price,
        month: currentMonth,
        status: 'Pending',
        due_date: transaction.due_date
      }
    });
  } catch (error) {
    console.error('Room booking error:', error);
    res.status(500).json({ message: error.message });
  }
});

// PREVIEW booking cost (before payment)
router.get('/rooms/:roomId/preview', async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Check if user already has a room assigned
    const existingUser = await User.findById(req.user.id);
    if (existingUser && existingUser.room_id) {
      return res.status(400).json({ 
        message: 'You already have a room assigned. Students can only book one room at a time.' 
      });
    }
    
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check room capacity
    const occupancy = room.occupancy || 0;
    const capacity = room.capacity || 1;
    if (occupancy >= capacity) {
      return res.status(400).json({ message: 'Room is fully occupied' });
    }
    
    // Return booking preview
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    res.json({
      room: room,
      bookingDetails: {
        amount: room.price,
        month: currentMonth,
        type: room.type,
        capacity: room.capacity,
        availableSpots: capacity - occupancy
      }
    });
  } catch (error) {
    console.error('Preview booking error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET room change requests
router.get('/room-change-requests', async (req, res) => {
  try {
    // For now, return empty array - this would be implemented with a proper database
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST room change request
router.post('/room-change-requests', async (req, res) => {
  try {
    const { current_room_id, requested_room_id, reason } = req.body;
    
    // Basic validation
    if (!current_room_id || !requested_room_id || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // For now, just return success - this would be implemented with a proper database
    res.status(201).json({
      id: Date.now(),
      current_room_id,
      requested_room_id,
      reason,
      status: 'Pending',
      created_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST acknowledge notice
router.post('/notices/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    
    // For now, just return success - this would be implemented with a proper database
    res.json({
      message: 'Notice acknowledged successfully',
      acknowledged: true,
      acknowledged_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
