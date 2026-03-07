import { Room, User, Complaint, Transaction, Notice, db, USERS_COLLECTION, ROOMS_COLLECTION, COMPLAINTS_COLLECTION, TRANSACTIONS_COLLECTION, NOTICES_COLLECTION } from './models/index.js';
import jwt from 'jsonwebtoken';

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apply authentication and authorization
  if (req.method !== 'OPTIONS') {
    const authResult = await new Promise((resolve) => {
      authenticate(req, res, () => {
        authorize(['student'])(req, res, () => {
          resolve(true);
        });
      });
    });
    
    if (!authResult) {
      return; // Response already sent by middleware
    }
  }

  try {
    const { url, method } = req;
    const path = url.replace('/api/student', '');

    // GET available rooms
    if (method === 'GET' && path === '/rooms') {
      const rooms = await Room.findAvailable();
      return res.status(200).json(rooms);
    }

    // GET student's room
    if (method === 'GET' && path === '/my-room') {
      const user = await User.findById(req.user.userId);
      if (!user || !user.room_id) {
        return res.status(404).json({ message: 'No room assigned' });
      }
      
      const room = await Room.findById(user.room_id);
      return res.status(200).json(room);
    }

    // POST book a room
    if (method === 'POST' && path === '/book-room') {
      const { roomId } = req.body;
      
      // Check if student already has a room
      const user = await User.findById(req.user.userId);
      if (user && user.room_id) {
        return res.status(400).json({ message: 'You already have a room assigned' });
      }
      
      // Check if room is available
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      
      if (room.occupancy >= room.capacity) {
        return res.status(400).json({ message: 'Room is full' });
      }
      
      // Assign room to student
      await User.update(req.user.userId, { room_id: roomId });
      await Room.update(roomId, { occupancy: room.occupancy + 1 });
      
      return res.status(200).json({ message: 'Room booked successfully' });
    }

    // GET student's complaints
    if (method === 'GET' && path === '/complaints') {
      const complaints = await Complaint.findByUserId(req.user.userId);
      return res.status(200).json(complaints);
    }

    // POST new complaint
    if (method === 'POST' && path === '/complaints') {
      const { title, description, category } = req.body;
      const newComplaint = await Complaint.create({
        user_id: req.user.userId,
        title,
        description,
        category: category || 'maintenance',
        status: 'pending',
        created_at: new Date()
      });
      return res.status(201).json(newComplaint);
    }

    // GET student's transactions
    if (method === 'GET' && path === '/transactions') {
      const transactions = await Transaction.findByUserId(req.user.userId);
      return res.status(200).json(transactions);
    }

    // POST new payment
    if (method === 'POST' && path === '/payments') {
      const { amount, type, description } = req.body;
      const newTransaction = await Transaction.create({
        user_id: req.user.userId,
        amount,
        type: type || 'payment',
        description: description || 'Room payment',
        status: 'completed',
        date: new Date()
      });
      return res.status(201).json(newTransaction);
    }

    // GET notices
    if (method === 'GET' && path === '/notices') {
      const notices = await Notice.findAll();
      return res.status(200).json(notices);
    }

    return res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Student API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
