# Havenly - Hostel Management System
## Deployment Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore database
- Gemini AI API key (for AI features)

### Environment Variables Setup

#### Backend Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[your-private-key]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Application Configuration
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=production

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key
```

#### How to Get Firebase Credentials
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the values from the JSON file to your `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (wrap in quotes and add \n for line breaks)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - Use `https://[project_id].firebaseio.com` for `FIREBASE_DATABASE_URL`

#### How to Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy it to `GEMINI_API_KEY`

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srinath-03937/Havenly.git
   cd Havenly
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your actual credentials

5. **Create uploads directory:**
   ```bash
   mkdir backend/uploads
   ```

### Running the Application

#### Development Mode
1. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

#### Production Deployment

##### Option 1: Using PM2 (Recommended)
1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Start with PM2:**
   ```bash
   cd backend
   pm2 start server.js --name "havenly-backend"
   ```

##### Option 2: Using Docker
1. **Build Docker image:**
   ```bash
   docker build -t havenly .
   ```

2. **Run container:**
   ```bash
   docker run -p 5000:5000 --env-file backend/.env havenly
   ```

### Default Login Credentials
After first run, these demo accounts will be created automatically:

- **Admin:** admin-test@havenly.com / admin123
- **Student:** student-test@havenly.com / student123

### Important Notes
- Never commit your `.env` file to version control
- Change the JWT_SECRET in production
- Ensure your Firebase Firestore rules are properly configured
- The `uploads/` directory should be writable by the server
- For production, consider using a proper file storage service (AWS S3, Cloudinary, etc.) for room photos

### Troubleshooting
- **Firebase connection issues:** Check your service account credentials
- **Image upload issues:** Ensure the `uploads/` directory exists and is writable
- **AI features not working:** Verify your Gemini API key is valid
- **CORS issues:** Ensure the frontend URL is allowed in your CORS configuration

### Support
For issues or questions, please create an issue on the GitHub repository.
