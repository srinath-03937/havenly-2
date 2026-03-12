import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

// Collections
const USERS_COLLECTION = 'users';
const ROOMS_COLLECTION = 'rooms';
const COMPLAINTS_COLLECTION = 'complaints';
const TRANSACTIONS_COLLECTION = 'transactions';
const NOTICES_COLLECTION = 'notices';

// ===================== USER OPERATIONS =====================
const User = {
  async create(userData) {
    const { email, password, name, role, phone } = userData;

    // Check if user exists
    const existingUser = await db.collection(USERS_COLLECTION).where('email', '==', email).get();
    if (!existingUser.empty) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRef = await db.collection(USERS_COLLECTION).add({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      phone: phone || '',
      room_id: null,
      hotelName: '',
      createdAt: new Date()
    });

    return { id: userRef.id, ...userData };
  },

  async findByEmail(email) {
    if (!email) return null;
    const snapshot = await db.collection(USERS_COLLECTION).where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  async findById(id) {
    if (!id) return null;
    const doc = await db.collection(USERS_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async findByIdWithRoom(id) {
    const doc = await db.collection(USERS_COLLECTION).doc(id).get();
    if (!doc.exists) return null;

    const userData = doc.data();
    if (userData.room_id) {
      const roomDoc = await db.collection(ROOMS_COLLECTION).doc(userData.room_id).get();
      userData.room_id = roomDoc.exists ? { id: roomDoc.id, ...roomDoc.data() } : null;
    }

    return { id: doc.id, ...userData };
  },

  async comparePassword(storedPassword, inputPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
  },

  async update(id, updateData) {
    const clean = Object.fromEntries(Object.entries(updateData).filter(([, v]) => v !== undefined));
    await db.collection(USERS_COLLECTION).doc(id).update(clean);
    return this.findById(id);
  }
};

// ===================== ROOM OPERATIONS =====================
const Room = {
  async create(roomData) {
    const { room_number, wing, type, price, capacity, photo_url } = roomData;

    const roomRef = await db.collection(ROOMS_COLLECTION).add({
      room_number,
      wing,
      type,
      price,
      capacity,
      occupancy: 0,
      photo_url: photo_url || '',
      createdAt: new Date()
    });

    return { id: roomRef.id, ...roomData };
  },

  async findAll() {
    const snapshot = await db.collection(ROOMS_COLLECTION).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async findAvailable() {
    const snapshot = await db.collection(ROOMS_COLLECTION).get();
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Return rooms where occupancy < capacity
    return rooms.filter(room => (room.occupancy || 0) < (room.capacity || 1));
  },

  async findById(id) {
    const doc = await db.collection(ROOMS_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(id, updateData) {
    const clean = Object.fromEntries(Object.entries(updateData).filter(([, v]) => v !== undefined));
    await db.collection(ROOMS_COLLECTION).doc(id).update(clean);
    return this.findById(id);
  },

  async delete(id) {
    await db.collection(ROOMS_COLLECTION).doc(id).delete();
  },

  async findWithResidents(id) {
    const room = await this.findById(id);
    if (!room) return null;

    const users = await db.collection(USERS_COLLECTION).where('room_id', '==', id).get();
    const residents = users.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone
      };
    });

    return { ...room, residents };
  }
};

// ===================== COMPLAINT OPERATIONS =====================
const Complaint = {
  async create(complaintData) {
    const { user_id, category, description } = complaintData;

    const complaintRef = await db.collection(COMPLAINTS_COLLECTION).add({
      user_id,
      category,
      description,
      status: 'Pending',
      date: new Date(),
      assignedTo: null
    });

    return { id: complaintRef.id, ...complaintData };
  },

  async findAll() {
    const snapshot = await db.collection(COMPLAINTS_COLLECTION).orderBy('date', 'desc').get();
    const complaints = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const user = await User.findById(data.user_id);
      const assignedUser = data.assignedTo ? await User.findById(data.assignedTo) : null;

      complaints.push({
        id: doc.id,
        ...data,
        user_id: user ? { id: user.id, name: user.name, email: user.email } : null,
        assignedTo: assignedUser ? { id: assignedUser.id, name: assignedUser.name } : null
      });
    }

    return complaints;
  },

  async findById(id) {
    const doc = await db.collection(COMPLAINTS_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async findByUserId(userId) {
    if (!userId) return [];
    const snapshot = await db.collection(COMPLAINTS_COLLECTION).where('user_id', '==', userId).get();
    const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    complaints.sort((a, b) => {
      const da = a.date ? a.date.toDate ? a.date.toDate() : new Date(a.date) : 0;
      const dbt = b.date ? b.date.toDate ? b.date.toDate() : new Date(b.date) : 0;
      return dbt - da;
    });
    return complaints;
  },

  async update(id, updateData) {
    const clean = Object.fromEntries(Object.entries(updateData).filter(([, v]) => v !== undefined));

    if (clean.status === 'Resolved') {
      clean.resolvedAt = new Date();
    }

    await db.collection(COMPLAINTS_COLLECTION).doc(id).update(clean);
    return this.findById(id);
  },

  async findActive() {
    const snapshot = await db.collection(COMPLAINTS_COLLECTION).orderBy('date', 'desc').get();
    const complaints = [];
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const doc of snapshot.docs) {
      const data = doc.data();

      if (data.status === 'Resolved' && data.resolvedAt) {
        const resolvedAt = data.resolvedAt.toDate ? data.resolvedAt.toDate() : new Date(data.resolvedAt);
        if (resolvedAt < twentyFourHoursAgo) continue;
      }

      const user = await User.findById(data.user_id);
      const assignedUser = data.assignedTo ? await User.findById(data.assignedTo) : null;

      complaints.push({
        id: doc.id,
        ...data,
        user_id: user ? { id: user.id, name: user.name, email: user.email } : null,
        assignedTo: assignedUser ? { id: assignedUser.id, name: assignedUser.name } : null
      });
    }

    return complaints;
  },

  async findHistory() {
    const snapshot = await db.collection(COMPLAINTS_COLLECTION).orderBy('date', 'desc').get();
    const complaints = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const user = await User.findById(data.user_id);
      const assignedUser = data.assignedTo ? await User.findById(data.assignedTo) : null;

      complaints.push({
        id: doc.id,
        ...data,
        user_id: user ? { id: user.id, name: user.name, email: user.email } : null,
        assignedTo: assignedUser ? { id: assignedUser.id, name: assignedUser.name } : null
      });
    }

    return complaints;
  },

  async findActiveByUserId(userId) {
    if (!userId) return [];
    const snapshot = await db.collection(COMPLAINTS_COLLECTION).where('user_id', '==', userId).get();
    const complaints = [];
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const doc of snapshot.docs) {
      const data = doc.data();

      if (data.status === 'Resolved' && data.resolvedAt) {
        const resolvedAt = data.resolvedAt.toDate ? data.resolvedAt.toDate() : new Date(data.resolvedAt);
        if (resolvedAt < twentyFourHoursAgo) continue;
      }

      complaints.push({ id: doc.id, ...data });
    }

    complaints.sort((a, b) => {
      const da = a.date ? a.date.toDate ? a.date.toDate() : new Date(a.date) : 0;
      const dbt = b.date ? b.date.toDate ? b.date.toDate() : new Date(b.date) : 0;
      return dbt - da;
    });
    return complaints;
  },

  async findHistoryByUserId(userId) {
    if (!userId) return [];
    const snapshot = await db.collection(COMPLAINTS_COLLECTION).where('user_id', '==', userId).get();
    const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    complaints.sort((a, b) => {
      const da = a.date ? a.date.toDate ? a.date.toDate() : new Date(a.date) : 0;
      const dbt = b.date ? b.date.toDate ? b.date.toDate() : new Date(b.date) : 0;
      return dbt - da;
    });
    return complaints;
  }
};

// ===================== TRANSACTION OPERATIONS =====================
const Transaction = {
  async create(transactionData) {
    const { user_id, room_id, amount, month } = transactionData;

    const transactionRef = await db.collection(TRANSACTIONS_COLLECTION).add({
      user_id,
      room_id,
      amount,
      status: 'Pending',
      month,
      date: new Date(),
      paidDate: null
    });

    return { id: transactionRef.id, ...transactionData };
  },

  async findAll() {
    const snapshot = await db.collection(TRANSACTIONS_COLLECTION).orderBy('date', 'desc').get();
    const transactions = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const user = await User.findById(data.user_id);
      const room = await Room.findById(data.room_id);

      transactions.push({
        id: doc.id,
        ...data,
        user_id: user ? { id: user.id, name: user.name, email: user.email } : null,
        room_id: room ? { id: room.id, room_number: room.room_number } : null
      });
    }

    return transactions;
  },

  async findById(id) {
    const doc = await db.collection(TRANSACTIONS_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async findByUserId(userId) {
    if (!userId) return [];
    const snapshot = await db.collection(TRANSACTIONS_COLLECTION).where('user_id', '==', userId).get();
    const transactions = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const room = await Room.findById(data.room_id);
      transactions.push({
        id: doc.id,
        ...data,
        room_id: room ? { id: room.id, room_number: room.room_number } : null
      });
    }

    transactions.sort((a, b) => {
      const da = a.date ? a.date.toDate ? a.date.toDate() : new Date(a.date) : 0;
      const dbt = b.date ? b.date.toDate ? b.date.toDate() : new Date(b.date) : 0;
      return dbt - da;
    });

    return transactions;
  },

  async findPendingByUserId(userId) {
    if (!userId) return [];
    const snapshot = await db.collection(TRANSACTIONS_COLLECTION)
      .where('user_id', '==', userId)
      .where('status', '==', 'Pending')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async update(id, updateData) {
    const updateObj = { ...updateData };
    if (updateData.status === 'Paid') {
      updateObj.paidDate = new Date();
    }
    const clean = Object.fromEntries(Object.entries(updateObj).filter(([, v]) => v !== undefined));
    await db.collection(TRANSACTIONS_COLLECTION).doc(id).update(clean);
    return this.findById(id);
  },

  async findByRoomId(roomId) {
    if (!roomId) return [];
    const snapshot = await db.collection(TRANSACTIONS_COLLECTION).where('room_id', '==', roomId).get();
    const transactions = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const user = await User.findById(data.user_id);
      transactions.push({
        id: doc.id,
        ...data,
        user_id: user ? { id: user.id, name: user.name, email: user.email } : null
      });
    }

    return transactions;
  }
};

// ===================== NOTICE OPERATIONS =====================
const Notice = {
  async create(noticeData) {
    const { title, content, createdBy } = noticeData;

    const noticeRef = await db.collection(NOTICES_COLLECTION).add({
      title,
      content,
      date: new Date(),
      createdBy
    });

    return { id: noticeRef.id, ...noticeData };
  },

  async findAll() {
    const snapshot = await db.collection(NOTICES_COLLECTION).orderBy('date', 'desc').get();
    const notices = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const creator = data.createdBy ? await User.findById(data.createdBy) : null;

      notices.push({
        id: doc.id,
        ...data,
        createdBy: creator ? { id: creator.id, name: creator.name } : null
      });
    }

    return notices;
  },

  async findById(id) {
    const doc = await db.collection(NOTICES_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }
};

export {
  User,
  Room,
  Complaint,
  Transaction,
  Notice,
  db,
  USERS_COLLECTION,
  ROOMS_COLLECTION,
  COMPLAINTS_COLLECTION,
  TRANSACTIONS_COLLECTION,
  NOTICES_COLLECTION
};
