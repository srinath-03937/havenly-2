import { db, ROOMS_COLLECTION } from '../utils/db.js';
import { authenticate, authorize } from '../_middleware.js';

// Get all rooms
async function getRooms(req, res) {
  try {
    const snapshot = await db.collection(ROOMS_COLLECTION).get();
    const rooms = [];
    
    snapshot.forEach(doc => {
      rooms.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
}

// Create room
async function createRoom(req, res) {
  try {
    const roomData = req.body;
    
    const docRef = await db.collection(ROOMS_COLLECTION).add({
      ...roomData,
      createdAt: new Date(),
      updatedAt: new Date(),
      occupancy: 0
    });
    
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room' });
  }
}

// Update room
async function updateRoom(req, res) {
  try {
    const { roomId } = req.query;
    const updateData = req.body;
    
    await db.collection(ROOMS_COLLECTION).doc(roomId).update({
      ...updateData,
      updatedAt: new Date()
    });
    
    res.status(200).json({ message: 'Room updated successfully' });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Error updating room' });
  }
}

// Delete room
async function deleteRoom(req, res) {
  try {
    const { roomId } = req.query;
    
    await db.collection(ROOMS_COLLECTION).doc(roomId).delete();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room' });
  }
}

// Handler function
async function handler(req, res) {
  try {
    await authenticate(async (req, res) => {
      await authorize(['admin'])(async (req, res) => {
        if (req.method === 'GET') {
          return await getRooms(req, res);
        } else if (req.method === 'POST') {
          return await createRoom(req, res);
        } else if (req.method === 'PUT') {
          return await updateRoom(req, res);
        } else if (req.method === 'DELETE') {
          return await deleteRoom(req, res);
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
