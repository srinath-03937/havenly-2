# Security & Environment Variables

## 🔐 Environment Variables Setup

This application uses environment variables to keep sensitive data secure. **Never commit actual API keys or secrets to version control.**

### Backend Environment Variables (`api/.env`)

```bash
# Firebase Service Account Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR_PRIVATE_KEY_HERE]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-[ID]@your_project_id.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini AI API
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Environment Variables (`frontend/.env`)

```bash
# Firebase Web App Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Configuration
VITE_API_BASE_URL=/api
```

## 🚨 Security Best Practices

1. **Never commit `.env` files** - They are included in `.gitignore`
2. **Use `.env.example` files** - These show the required structure without exposing actual values
3. **Different keys for different environments** - Use separate keys for development, staging, and production
4. **Rotate keys regularly** - Update API keys periodically for security
5. **Use Vercel Environment Variables** - For production deployment, set variables in Vercel dashboard

## 🔑 Getting Your Keys

### Firebase Service Account (Backend)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download JSON file and copy values to `api/.env`

### Firebase Web App (Frontend)
1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Click on Web app → Config
4. Copy `firebaseConfig` values to `frontend/.env`

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Add to `api/.env` as `GEMINI_API_KEY`

## 🌐 Vercel Deployment

For Vercel deployment, set environment variables in:
1. Vercel Dashboard → Project Settings → Environment Variables
2. Add all the variables from both `api/.env` and `frontend/.env`
3. **Important**: Use `VITE_` prefix for frontend variables in Vercel

## 🔒 Files Containing Sensitive Data

These files are **NEVER** committed to version control:
- `api/.env` - Backend secrets
- `frontend/.env` - Frontend secrets
- Any `.env.local` files
- Private key files

These files are **SAFE** to commit:
- `api/.env.example` - Template only
- `frontend/.env.example` - Template only
- `SECURITY.md` - This documentation
