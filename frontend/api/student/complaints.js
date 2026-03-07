import { db, COMPLAINTS_COLLECTION } from '../utils/db.js';
import { authenticate, authorize } from '../_middleware.js';

// Get student complaints
async function getStudentComplaints(req, res) {
  try {
    const userId = req.user.id;
    const snapshot = await db.collection(COMPLAINTS_COLLECTION)
      .where('user_id', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const complaints = [];
    snapshot.forEach(doc => {
      complaints.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching student complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
}

// Create complaint
async function createComplaint(req, res) {
  try {
    const userId = req.user.id;
    const complaintData = req.body;
    
    const docRef = await db.collection(COMPLAINTS_COLLECTION).add({
      ...complaintData,
      user_id: userId,
      status: 'pending',
      createdAt: new Date()
    });
    
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Error creating complaint' });
  }
}

// Handler function
async function handler(req, res) {
  try {
    await authenticate(async (req, res) => {
      await authorize(['student'])(async (req, res) => {
        if (req.method === 'GET') {
          return await getStudentComplaints(req, res);
        } else if (req.method === 'POST') {
          return await createComplaint(req, res);
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
