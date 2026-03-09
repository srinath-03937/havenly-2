# Environment Variables Setup Guide

## 📋 Required Environment Variables

### 1. JWT Secret
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```
**How to generate:**
- Use any random string generator
- Minimum 32 characters recommended
- Example: `havenly-super-admin-secret-key-2024-xyz123`

### 2. Firebase Configuration

#### Step 1: Get Firebase Project ID
```
FIREBASE_PROJECT_ID=your-firebase-project-id-here
```
**How to get:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to Project Settings → General
4. Copy "Project ID"

#### Step 2: Get Service Account Email
```
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
```
**How to get:**
1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Copy the "client_email" from the downloaded JSON

#### Step 3: Get Private Key
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5V7V8X9K8m7Q2
[Your complete private key content here]
-----END PRIVATE KEY-----"
```
**How to get:**
1. Download the JSON file from Firebase Service Accounts
2. Copy the entire "private_key" value
3. **Important**: Wrap in quotes and preserve all line breaks

#### Step 4: Get Database URL
```
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```
**How to get:**
- Format: `https://[project-id].firebaseio.com`
- Replace `[project-id]` with your actual project ID

### 3. Gemini API Key
```
GEMINI_API_KEY=your-gemini-api-key-here
```
**How to get:**
1. Go to: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key

### 4. Production Settings
```
NODE_ENV=production
PORT=3000
```
These are already set correctly.

## 🚀 Quick Setup Example

Here's a filled example (replace with YOUR actual values):

```env
JWT_SECRET=havenly-super-admin-secret-key-2024-xyz123456789

FIREBASE_PROJECT_ID=example-havenly-app-12345
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@example-havenly-app-12345.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7V8X9K8m7Q2
[Your actual private key content here]
-----END PRIVATE KEY-----"
FIREBASE_DATABASE_URL=https://example-havenly-app-12345.firebaseio.com

GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456789

NODE_ENV=production
PORT=3000
```

## 📝 For Vercel Deployment

1. **Go to**: Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Add each variable** from above
3. **Make sure to include quotes** around the private key
4. **Save and redeploy**

## ⚠️ Important Notes

- **Never commit `.env` file** to version control
- **Keep your private key secure** - it gives full database access
- **Change JWT_SECRET** in production
- **Test locally first** before deploying

## 🔍 Testing Your Setup

After setting up environment variables:

1. **Test locally**: Run the app with your `.env` file
2. **Check Firebase connection**: Look for "Firebase Firestore connected" message
3. **Test authentication**: Try logging in with demo accounts
4. **Deploy to Vercel**: Add the same variables to Vercel dashboard

## 🆘 Troubleshooting

**If you get "Firebase connection error":**
- Check FIREBASE_PROJECT_ID matches your Firebase project
- Verify FIREBASE_PRIVATE_KEY format (quotes and line breaks)
- Ensure service account has correct permissions

**If you get "Invalid token" error:**
- Check JWT_SECRET is set correctly
- Verify it's the same in all environments

**If AI features don't work:**
- Verify GEMINI_API_KEY is valid
- Check if the key has the correct permissions
