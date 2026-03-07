import { User } from '../models/User.js';
import { db, ROOMS_COLLECTION, TRANSACTIONS_COLLECTION, NOTICES_COLLECTION } from '../utils/db.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create Super Admin account
    const superAdminEmail = 'gajula@gmail.com';
    const superAdmin = await User.findByEmail(superAdminEmail);
    if (!superAdmin) {
      await User.create({ 
        name: 'Super Admin', 
        email: superAdminEmail, 
        password: 'sahithi', 
        role: 'admin',
        phone: '+919876543210'
      });
      console.log('Created super admin account:', superAdminEmail);
    }

    // Create demo student account
    const studentEmail = 'student-test@havenly.com';
    const student = await User.findByEmail(studentEmail);
    if (!student) {
      await User.create({
        name: 'Demo Student',
        email: studentEmail,
        password: 'student123',
        role: 'student',
        phone: '+919876543211'
      });
      console.log('Created demo student account:', studentEmail);
    }

    // Create demo rooms
    const roomsSnapshot = await db.collection(ROOMS_COLLECTION).limit(1).get();
    if (roomsSnapshot.empty) {
      const demoRooms = [
        { room_number: 'A101', type: 'Single', capacity: 1, price: 5000, floor: '1st Floor', amenities: 'AC, WiFi, Attached Bath' },
        { room_number: 'A102', type: 'Double', capacity: 2, price: 3000, floor: '1st Floor', amenities: 'WiFi, Shared Bath' },
        { room_number: 'B201', type: 'Single', capacity: 1, price: 4500, floor: '2nd Floor', amenities: 'AC, WiFi' },
        { room_number: 'B202', type: 'Triple', capacity: 3, price: 2500, floor: '2nd Floor', amenities: 'WiFi, Common Area' }
      ];

      for (const room of demoRooms) {
        await db.collection(ROOMS_COLLECTION).add({
          ...room,
          createdAt: new Date(),
          updatedAt: new Date(),
          occupancy: 0
        });
      }
      console.log('Created demo rooms');
    }

    // Create demo transactions
    const transactionsSnapshot = await db.collection(TRANSACTIONS_COLLECTION).limit(1).get();
    if (transactionsSnapshot.empty) {
      const demoTransactions = [
        { user_id: 'demo-user', amount: 5000, type: 'payment', status: 'completed', description: 'Monthly Rent - A101', month: 'January 2024' },
        { user_id: 'demo-user', amount: 4000, type: 'payment', status: 'completed', description: 'Monthly Rent - A102', month: 'February 2024' }
      ];

      for (const transaction of demoTransactions) {
        await db.collection(TRANSACTIONS_COLLECTION).add({
          ...transaction,
          createdAt: new Date()
        });
      }
      console.log('Created demo transactions');
    }

    // Create demo notices
    const noticesSnapshot = await db.collection(NOTICES_COLLECTION).limit(1).get();
    if (noticesSnapshot.empty) {
      const demoNotices = [
        { title: 'Maintenance Notice', content: 'Water supply will be interrupted on Sunday 10AM-2PM', priority: 'high', target_audience: 'all' },
        { title: 'Fee Payment Reminder', content: 'Please pay your monthly rent by 5th of every month', priority: 'medium', target_audience: 'students' }
      ];

      for (const notice of demoNotices) {
        await db.collection(NOTICES_COLLECTION).add({
          ...notice,
          createdAt: new Date()
        });
      }
      console.log('Created demo notices');
    }

    res.status(200).json({ message: 'Demo data initialized successfully' });
  } catch (error) {
    console.error('Error initializing demo data:', error);
    res.status(500).json({ message: 'Error initializing demo data' });
  }
}

export default handler;
