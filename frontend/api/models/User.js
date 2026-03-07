import { db, USERS_COLLECTION } from '../utils/db.js';

export class User {
  static async findByEmail(email) {
    try {
      const snapshot = await db.collection(USERS_COLLECTION)
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      const docRef = await db.collection(USERS_COLLECTION).add({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findById(userId) {
    try {
      const doc = await db.collection(USERS_COLLECTION).doc(userId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async delete(userId) {
    try {
      await db.collection(USERS_COLLECTION).doc(userId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const snapshot = await db.collection(USERS_COLLECTION).get();
      const users = [];
      
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
}
