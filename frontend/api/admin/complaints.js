import { db, COMPLAINTS_COLLECTION } from '../utils/db.js';
import { authenticate, authorize } from '../_middleware.js';

// Get all complaints
async function getComplaints(req, res) {
  try {
    const snapshot = await db.collection(COMPLAINTS_COLLECTION).orderBy('createdAt', 'desc').get();
    const complaints = [];
    
    snapshot.forEach(doc => {
      complaints.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
}

// Update complaint status
async function updateComplaint(req, res) {
  try {
    const { complaintId } = req.query;
    const { status, response } = req.body;
    
    await db.collection(COMPLAINTS_COLLECTION).doc(complaintId).update({
      status,
      response,
      updatedAt: new Date()
    });
    
    res.status(200).json({ message: 'Complaint updated successfully' });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: 'Error updating complaint' });
  }
}

// Handler function
async function handler(req, res) {
  try {
    await authenticate(async (req, res) => {
      await authorize(['admin'])(async (req, res) => {
        if (req.method === 'GET') {
          return await getComplaints(req, res);
        } else if (req.method === 'PUT') {
          return await updateComplaint(req, res);
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
