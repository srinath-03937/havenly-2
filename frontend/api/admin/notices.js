import { db, NOTICES_COLLECTION } from '../utils/db.js';
import { authenticate, authorize } from '../_middleware.js';

// Get all notices
async function getNotices(req, res) {
  try {
    const snapshot = await db.collection(NOTICES_COLLECTION).orderBy('createdAt', 'desc').get();
    const notices = [];
    
    snapshot.forEach(doc => {
      notices.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ message: 'Error fetching notices' });
  }
}

// Create notice
async function createNotice(req, res) {
  try {
    const noticeData = req.body;
    
    const docRef = await db.collection(NOTICES_COLLECTION).add({
      ...noticeData,
      createdAt: new Date()
    });
    
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ message: 'Error creating notice' });
  }
}

// Delete notice
async function deleteNotice(req, res) {
  try {
    const { noticeId } = req.query;
    
    await db.collection(NOTICES_COLLECTION).doc(noticeId).delete();
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ message: 'Error deleting notice' });
  }
}

// Handler function
async function handler(req, res) {
  try {
    await authenticate(async (req, res) => {
      await authorize(['admin'])(async (req, res) => {
        if (req.method === 'GET') {
          return await getNotices(req, res);
        } else if (req.method === 'POST') {
          return await createNotice(req, res);
        } else if (req.method === 'DELETE') {
          return await deleteNotice(req, res);
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
