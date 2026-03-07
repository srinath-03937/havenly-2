const express = require('express');
const multer = require('multer');
const path = require('path');
const { Room, User, Complaint, Transaction, Notice, db, USERS_COLLECTION, ROOMS_COLLECTION, COMPLAINTS_COLLECTION, TRANSACTIONS_COLLECTION, NOTICES_COLLECTION } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const admin = require('firebase-admin');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Middleware
router.use(authenticate);
router.use(authorize(['admin']));

// GET all rooms with residents
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.findAll();
    const roomsWithResidents = await Promise.all(
      rooms.map(async (room) => {
        const roomWithResidents = await Room.findWithResidents(room.id);
        return roomWithResidents;
      })
    );
    res.json(roomsWithResidents);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new room
router.post('/rooms', upload.single('photo'), async (req, res) => {
  try {
    const { room_number, wing, type, price, capacity } = req.body;
    
    // Handle photo URL
    let photo_url = null;
    if (req.file) {
      // If file was uploaded, use the filename
      photo_url = req.file.filename;
      console.log('Room photo uploaded:', req.file.filename);
    } else if (req.body.photo_url) {
      // If photo_url was provided in form data (for external URLs)
      photo_url = req.body.photo_url;
    }
    
    const room = await Room.create({ 
      room_number, 
      wing, 
      type, 
      price, 
      capacity, 
      photo_url 
    });
    
    console.log('Room created successfully:', room);
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE room
router.put('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.update(req.params.id, req.body);
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE room
router.delete('/rooms/:id', async (req, res) => {
  try {
    await Room.delete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all complaints (active only - excludes complaints resolved > 24h ago)
router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.findActive();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all complaints history (includes all complaints)
router.get('/complaints-history', async (req, res) => {
  try {
    const complaints = await Complaint.findHistory();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE complaint status
router.put('/complaints/:id', async (req, res) => {
  try {
    console.log('Update complaint payload:', req.body);
    const { status, assignedTo } = req.body;
    const complaint = await Complaint.update(req.params.id, { status, assignedTo });
    
    // Enrich with user data
    const user = await User.findById(complaint.user_id);
    res.json({
      ...complaint,
      user_id: user ? { id: user.id, name: user.name, email: user.email } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET transactions by room
router.get('/transactions-by-room', async (req, res) => {
  try {
    const rooms = await Room.findAll();
    const roomTransactions = await Promise.all(
      rooms.map(async (room) => {
        const transactions = await Transaction.findByRoomId(room.id);
        const totalDues = transactions
          .filter(t => t.status === 'Pending')
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          room,
          transactions,
          totalDues
        };
      })
    );
    res.json(roomTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE notice
router.post('/notices', async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = await Notice.create({ title, content, createdBy: req.user.id });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all notices
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.findAll();
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const rooms = await Room.findAll();
    const totalRooms = rooms.length;
    
    const usersSnapshot = await db.collection(USERS_COLLECTION).where('room_id', '!=', null).get();
    const occupiedRooms = usersSnapshot.size;
    
    const complaints = await Complaint.findAll();
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    
    const transactions = await Transaction.findAll();
    const paidTransactions = transactions.filter(t => t.status === 'Paid' && t.paidDate);
    const pendingTransactions = transactions.filter(t => t.status === 'Pending');

    // Calculate revenue from actual paid transactions only - ensure numbers
    const revenueCollected = paidTransactions.reduce((sum, t) => {
      const amount = Number(t.amount) || 0;
      console.log(`Adding transaction amount: ${t.amount} -> ${amount}`);
      return sum + amount;
    }, 0);
    
    const pendingDues = pendingTransactions.reduce((sum, t) => {
      const amount = Number(t.amount) || 0;
      console.log(`Adding pending amount: ${t.amount} -> ${amount}`);
      return sum + amount;
    }, 0);

    console.log(`Final revenue: ${revenueCollected}, pending: ${pendingDues}`);

    res.json({
      occupancy: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
      pendingComplaints,
      revenueCollected: Math.round(revenueCollected * 100) / 100, // Round to 2 decimal places
      pendingDues: Math.round(pendingDues * 100) / 100,
      totalRooms,
      occupiedRooms
    });
  } catch (error) {
    console.error('Stats calculation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET all users (Super Admin functionality)
router.get('/users', async (req, res) => {
  try {
    const usersSnapshot = await db.collection(USERS_COLLECTION).get();
    const users = [];
    
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const user = {
        id: doc.id,
        ...userData
      };
      
      // Fetch room details if user has a room
      if (userData.room_id) {
        const roomDoc = await db.collection(ROOMS_COLLECTION).doc(userData.room_id).get();
        user.room_id = roomDoc.exists ? { id: roomDoc.id, ...roomDoc.data() } : null;
      }
      
      users.push(user);
    }
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE user (Super Admin functionality)
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    // Prevent deletion of the last admin
    if (userData.role === 'admin') {
      const adminCount = await db.collection(USERS_COLLECTION).where('role', '==', 'admin').get();
      if (adminCount.size <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }
    
    // If user has a room, update room occupancy
    if (userData.room_id) {
      await db.collection(ROOMS_COLLECTION).doc(userData.room_id).update({
        occupancy: admin.firestore.FieldValue.increment(-1)
      });
    }
    
    // Delete user's transactions
    const transactionsSnapshot = await db.collection(TRANSACTIONS_COLLECTION).where('user_id', '==', userId).get();
    const batch = db.batch();
    transactionsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete user's complaints
    const complaintsSnapshot = await db.collection(COMPLAINTS_COLLECTION).where('user_id', '==', userId).get();
    complaintsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the user
    batch.delete(db.collection(USERS_COLLECTION).doc(userId));
    
    await batch.commit();
    
    console.log(`User ${userId} deleted successfully`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
