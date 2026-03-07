import { Room, User, Complaint, Transaction, Notice, db, USERS_COLLECTION, ROOMS_COLLECTION, COMPLAINTS_COLLECTION, TRANSACTIONS_COLLECTION, NOTICES_COLLECTION } from './models/index.js';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } catch (error) {
    console.log('Firebase admin already initialized');
  }
}

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
        authorize(['admin'])(req, res, () => {
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
    const path = url.replace('/api/admin', '');

    // GET all rooms
    if (method === 'GET' && path === '/rooms') {
      const rooms = await Room.findAll();
      const roomsWithResidents = await Promise.all(
        rooms.map(async (room) => {
          const roomWithResidents = await Room.findWithResidents(room.id);
          return roomWithResidents;
        })
      );
      return res.status(200).json(roomsWithResidents);
    }

    // GET all users (Super Admin)
    if (method === 'GET' && path === '/users') {
      const users = await db.collection(USERS_COLLECTION).get();
      const usersData = await Promise.all(
        users.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          let roomData = null;
          
          if (userData.room_id) {
            const roomDoc = await db.collection(ROOMS_COLLECTION).doc(userData.room_id).get();
            if (roomDoc.exists) {
              roomData = { id: roomDoc.id, ...roomDoc.data() };
            }
          }
          
          return {
            id: userDoc.id,
            ...userData,
            room_id: roomData
          };
        })
      );
      
      return res.status(200).json(usersData);
    }

    // DELETE user (Super Admin)
    if (method === 'DELETE' && path.startsWith('/users/')) {
      const userId = path.split('/users/')[1];
      
      // Get user data
      const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const userData = userDoc.data();
      
      // Prevent deleting the last admin
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
      batch.delete(userDoc.ref);
      await batch.commit();
      
      return res.status(200).json({ message: 'User deleted successfully' });
    }

    // GET all complaints
    if (method === 'GET' && path === '/complaints') {
      const complaints = await Complaint.findAll();
      return res.status(200).json(complaints);
    }

    // GET all transactions
    if (method === 'GET' && path === '/transactions') {
      const transactions = await Transaction.findAll();
      return res.status(200).json(transactions);
    }

    // GET all notices
    if (method === 'GET' && path === '/notices') {
      const notices = await Notice.findAll();
      return res.status(200).json(notices);
    }

    // POST new notice
    if (method === 'POST' && path === '/notices') {
      const { title, content, priority } = req.body;
      const newNotice = await Notice.create({
        title,
        content,
        priority: priority || 'medium',
        created_at: new Date()
      });
      return res.status(201).json(newNotice);
    }

    return res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
