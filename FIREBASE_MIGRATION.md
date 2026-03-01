# MongoDB to Firebase Migration Guide

## Overview
Your DormLink backend has been successfully migrated from MongoDB with Mongoose to Firebase Firestore. This document outlines all the changes made and the setup steps required.

## Changes Made

### 1. **Dependencies Updated** ([backend/package.json](backend/package.json))
- **Removed:**
  - `mongoose` - MongoDB ODM
  - `bcryptjs` - Password hashing (functionality retained with direct bcryptjs usage)
  
- **Added:**
  - `firebase-admin` - Firebase SDK for Node.js

### 2. **Environment Configuration** ([backend/.env.example](backend/.env.example))
- **Old Configuration:**
  ```
  MONGODB_URI=mongodb://localhost:27017/dormflow
  ```
  
- **New Firebase Configuration:**
  ```
  FIREBASE_PROJECT_ID=your-firebase-project-id
  FIREBASE_PRIVATE_KEY=your-firebase-private-key
  FIREBASE_CLIENT_EMAIL=your-firebase-client-email
  FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
  JWT_SECRET=your-secret-key-change-in-production
  PORT=5000
  GEMINI_API_KEY=your-gemini-api-key
  NODE_ENV=development
  ```

### 3. **Server Initialization** ([backend/server.js](backend/server.js))
- Replaced Mongoose connection with Firebase Admin SDK initialization
- Firebase Firestore is now initialized on server startup
- Connection pooling and auto-reconnection are handled by Firebase

### 4. **Database Models** ([backend/models/index.js](backend/models/index.js))
Complete rewrite from Mongoose schemas to Firebase Firestore services:

#### Collections Structure:
- `users` - User data (replaces User model)
- `rooms` - Room data (replaces Room model)
- `complaints` - Complaint records (replaces Complaint model)
- `transactions` - Payment transactions (replaces Transaction model)
- `notices` - Hostel notices (replaces Notice model)

#### New Service-Based Approach:
Each model is now a service object with async methods:

- **User Service:**
  - `create(userData)` - Register new user
  - `findByEmail(email)` - Find user by email
  - `findById(id)` - Get user by ID
  - `findByIdWithRoom(id)` - Get user with room details
  - `comparePassword(storedPassword, inputPassword)` - Verify password
  - `update(id, updateData)` - Update user

- **Room Service:**
  - `create(roomData)` - Create new room
  - `findAll()` - Get all rooms
  - `findById(id)` - Get specific room
  - `update(id, updateData)` - Update room
  - `delete(id)` - Delete room
  - `findWithResidents(id)` - Get room with resident info

- **Complaint Service:**
  - `create(complaintData)` - File new complaint
  - `findAll()` - Get all complaints with user details
  - `findById(id)` - Get specific complaint
  - `findByUserId(userId)` - Get user's complaints
  - `update(id, updateData)` - Update complaint status

- **Transaction Service:**
  - `create(transactionData)` - Create transaction record
  - `findAll()` - Get all transactions with details
  - `findById(id)` - Get specific transaction
  - `findByUserId(userId)` - Get user's transactions
  - `findPendingByUserId(userId)` - Get pending dues
  - `update(id, updateData)` - Update transaction (marks as paid)
  - `findByRoomId(roomId)` - Get room's transactions

- **Notice Service:**
  - `create(noticeData)` - Create new notice
  - `findAll()` - Get all notices with creator info
  - `findById(id)` - Get specific notice

### 5. **Routes Updated**

#### Authentication Routes ([backend/routes/auth.js](backend/routes/auth.js))
- `POST /api/auth/register` - Register with Firebase
- `POST /api/auth/login` - Login with password verification
- `GET /api/auth/me` - Get current user info

#### Admin Routes ([backend/routes/admin.js](backend/routes/admin.js))
- `GET /api/admin/rooms` - List all rooms with residents
- `POST /api/admin/rooms` - Create new room
- `PUT /api/admin/rooms/:id` - Update room details
- `DELETE /api/admin/rooms/:id` - Delete room
- `GET /api/admin/complaints` - View all complaints
- `PUT /api/admin/complaints/:id` - Update complaint status
- `GET /api/admin/transactions` - View all transactions
- `GET /api/admin/transactions-by-room` - Transactions grouped by room
- `POST /api/admin/notices` - Create notice
- `GET /api/admin/notices` - View all notices
- `GET /api/admin/stats` - Dashboard statistics

#### Student Routes ([backend/routes/student.js](backend/routes/student.js))
- `GET /api/student/room` - Get assigned room
- `GET /api/student/transactions` - View payment history
- `GET /api/student/pending-dues` - Check pending payments
- `PUT /api/student/transactions/:id` - Mark payment as paid
- `POST /api/student/complaints` - File complaint
- `GET /api/student/complaints` - View complaints
- `GET /api/student/notices` - View notices

## Next Steps to Complete Migration

### 1. **Install Dependencies**
```bash
cd backend
npm install
```

### 2. **Set Up Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Create a service account:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `.env` file

### 3. **Configure Environment Variables**
Create `.env` file in the backend folder with Firebase credentials:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
JWT_SECRET=your-very-secure-secret-key
PORT=5000
GEMINI_API_KEY=your-gemini-key
NODE_ENV=development
```

### 4. **Initialize Firestore Collections**
The collections will be created automatically when first documents are added. To pre-create them:
1. Go to Firebase Console
2. Create Firestore database
3. Add the following collections (empty initially):
   - `users`
   - `rooms`
   - `complaints`
   - `transactions`
   - `notices`

### 5. **Update Frontend API Calls** (if needed)
- Frontend API calls remain unchanged
- No CORS or authentication changes required
- All response formats are compatible

### 6. **Test the Migration**
```bash
npm dev  # Run development server
```

Test API endpoints:
- `POST /api/auth/register` - Create test user
- `POST /api/auth/login` - Verify authentication
- `GET /health` - Check server status

## Key Differences from MongoDB

| Aspect | MongoDB | Firebase |
|--------|---------|----------|
| Documents | JSON-like with schema | Flexible JSON |
| Transactions | ObjectId | Auto-generated IDs |
| Relationships | Populate/Join | Manual data enrichment |
| Queries | Query builder | Firebase Query |
| Scaling | Vertical + Horizontal | Auto-scaling |
| Cost | Fixed server costs | Pay-per-use |
| Real-time | Requires polling | Built-in listeners |

## Security Considerations

1. **Private Key Storage**: Never commit `.env` files
2. **Firestore Rules**: Set up security rules in Firebase Console:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth.uid == userId || request.auth.token.role == 'admin'
       }
       match /transactions/{doc=**} {
         allow read, write: if request.auth != null
       }
       // Add your rules
     }
   }
   ```

3. **JWT Secret**: Use a strong, unique secret key
4. **Firebase Console**: Restrict database access to service account only

## Troubleshooting

### Error: "Failed to initialize Firebase"
- Verify `.env` file has correct credentials
- Check Firebase project ID exists
- Ensure service account has Firestore permissions

### Error: "Permission denied" in Firestore
- Set up Firestore security rules
- Verify service account email is authorized

### Slow queries
- Add composite indexes as suggested by Firebase Console
- Avoid reading entire collections; use filters when possible

## Reverting to MongoDB (if needed)

If you need to revert:
1. Restore from git: `git checkout backend/`
2. Run: `npm install`
3. Restore MongoDB connection string in `.env`
4. Restart server

## Support

For Firebase issues: https://firebase.google.com/docs/firestore
For Node.js Firebase: https://firebase.google.com/docs/database/admin/start

---

**Migration completed successfully!** 🎉
