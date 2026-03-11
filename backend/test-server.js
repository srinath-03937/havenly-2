require('dotenv').config();
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

// Test endpoint without Firebase
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'API is working without Firebase'
  });
});

// Test auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email && password) {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'mock-user-id',
        email: email,
        name: email.includes('admin') ? 'Admin User' : 'Student User',
        role: email.includes('admin') ? 'admin' : 'student'
      }
    });
  } else {
    res.status(400).json({ message: 'Email and password required' });
  }
});

// Mock register endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, role } = req.body;
  
  if (name && email && password) {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'mock-user-' + Date.now(),
        email: email,
        name: name,
        role: role || 'student',
        phone: phone || ''
      }
    });
  } else {
    res.status(400).json({ message: 'Name, email and password required' });
  }
});

// Mock rooms endpoint
app.get('/api/student/rooms', (req, res) => {
  res.json([
    {
      id: 'room-1',
      room_number: '101',
      wing: 'A',
      type: 'Single',
      price: 4000,
      capacity: 1,
      occupancy: 0,
      photo_url: null
    },
    {
      id: 'room-2',
      room_number: '102',
      wing: 'A',
      type: 'Double',
      price: 6000,
      capacity: 2,
      occupancy: 0,
      photo_url: null
    },
    {
      id: 'room-3',
      room_number: '103',
      wing: 'B',
      type: 'Single',
      price: 4500,
      capacity: 1,
      occupancy: 0,
      photo_url: null
    }
  ]);
});

// Mock user room endpoint
app.get('/api/student/room', (req, res) => {
  res.json({
    id: 'room-1',
    room_number: '101',
    wing: 'A',
    type: 'Single',
    price: 4000,
    capacity: 1,
    occupancy: 1,
    photo_url: null
  });
});

// Mock complaints endpoint
app.get('/api/student/complaints', (req, res) => {
  res.json([
    {
      id: 'comp-1',
      category: 'Maintenance',
      description: 'Light not working in room',
      status: 'Pending',
      created_at: new Date().toISOString()
    }
  ]);
});

// Mock complaints history endpoint
app.get('/api/student/complaints-history', (req, res) => {
  res.json([
    {
      id: 'comp-2',
      category: 'Cleaning',
      description: 'Room cleaning request',
      status: 'Resolved',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
});

// Mock transactions endpoint
app.get('/api/student/transactions', (req, res) => {
  res.json([
    {
      id: 'txn-1',
      month: 'March 2024',
      amount: 4000,
      status: 'Pending',
      due_date: new Date(Date.now() + 604800000).toISOString()
    }
  ]);
});

// Mock notices endpoint
app.get('/api/student/notices', (req, res) => {
  res.json([
    {
      id: 'notice-1',
      title: 'Maintenance Schedule',
      message: 'Water supply will be interrupted tomorrow from 10 AM to 12 PM',
      priority: 'high',
      created_at: new Date().toISOString(),
      acknowledged: false
    }
  ]);
});

// Mock room change requests endpoint
app.get('/api/student/room-change-requests', (req, res) => {
  res.json([]);
});

// Mock room booking endpoint
app.post('/api/student/rooms/:roomId/book', (req, res) => {
  res.json({
    message: 'Room booked successfully',
    transaction_id: 'txn-' + Date.now(),
    status: 'Pending'
  });
});

// Mock complaint endpoint
app.post('/api/student/complaints', (req, res) => {
  res.json({
    id: 'comp-' + Date.now(),
    message: 'Complaint submitted successfully'
  });
});

// Mock notice acknowledgment endpoint
app.post('/api/student/notices/:id/acknowledge', (req, res) => {
  res.json({
    message: 'Notice acknowledged successfully',
    acknowledged: true
  });
});

// Export for Vercel
module.exports = app;
