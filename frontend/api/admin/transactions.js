import { db, TRANSACTIONS_COLLECTION } from '../utils/db.js';
import { authenticate, authorize } from '../_middleware.js';

// Get all transactions
async function getTransactions(req, res) {
  try {
    const snapshot = await db.collection(TRANSACTIONS_COLLECTION).orderBy('createdAt', 'desc').get();
    const transactions = [];
    
    snapshot.forEach(doc => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
}

// Create transaction
async function createTransaction(req, res) {
  try {
    const transactionData = req.body;
    
    const docRef = await db.collection(TRANSACTIONS_COLLECTION).add({
      ...transactionData,
      createdAt: new Date()
    });
    
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
}

// Handler function
async function handler(req, res) {
  try {
    await authenticate(async (req, res) => {
      await authorize(['admin'])(async (req, res) => {
        if (req.method === 'GET') {
          return await getTransactions(req, res);
        } else if (req.method === 'POST') {
          return await createTransaction(req, res);
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
