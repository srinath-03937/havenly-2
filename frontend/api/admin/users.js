import { User } from '../models/User.js';
import { db, USERS_COLLECTION, ROOMS_COLLECTION, TRANSACTIONS_COLLECTION, COMPLAINTS_COLLECTION } from '../utils/db.js';
import { authenticate, authorize } from '../_middleware.js';
import admin from 'firebase-admin';

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.getAll();
    
    // Fetch room details for users with room_id
    const usersWithRooms = await Promise.all(
      users.map(async (user) => {
        if (user.room_id) {
          const roomDoc = await db.collection(ROOMS_COLLECTION).doc(user.room_id).get();
          return {
            ...user,
            room_id: roomDoc.exists ? { id: roomDoc.id, ...roomDoc.data() } : null
          };
        }
        return user;
      })
    );

    res.status(200).json(usersWithRooms);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get user data before deletion
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

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

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
}

// Handler function that routes based on HTTP method
async function handler(req, res) {
  try {
    // Apply authentication and authorization middleware
    await authenticate(async (req, res) => {
      await authorize(['admin'])(async (req, res) => {
        if (req.method === 'GET') {
          return await getAllUsers(req, res);
        } else if (req.method === 'DELETE') {
          return await deleteUser(req, res);
        } else {
          return res.status(405).json({ message: 'Method not allowed' });
        }
      })(req, res);
    })(req, res);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler;
