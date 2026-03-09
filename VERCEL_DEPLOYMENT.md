# 🚀 Vercel Deployment Guide

## Step 1: Prepare Your Environment Variables

1. **Get your Firebase credentials:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Extract these values from the JSON file:**
   ```json
   {
     "project_id": "your_project_id",
     "client_email": "your_service_account_email",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   }
   ```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   vercel --prod
   ```

4. **When prompted, set environment variables:**
   ```
   FIREBASE_PROJECT_ID: your_project_id
   FIREBASE_CLIENT_EMAIL: your_service_account_email
   FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"
   FIREBASE_DATABASE_URL: https://your_project_id.firebaseio.com
   JWT_SECRET: your_jwt_secret_key
   GEMINI_API_KEY: your_gemini_api_key
   ```

### Option B: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Connect your GitHub repository**
4. **Configure Build Settings:**
   - **Root Directory**: `.`
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all the Firebase credentials listed above
   - **Also add**: `GEMINI_API_KEY` for AI features

6. **Deploy!**

## Step 3: Verify Deployment

1. **Test the API:**
   - Visit `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Test the Frontend:**
   - Visit `https://your-app.vercel.app`
   - Should load the login page

## Important Notes:

- **Private Key Format**: Make sure to include the `\n` characters in the private key
- **Firebase Rules**: Ensure your Firestore rules allow read/write access
- **Domain**: Your app will be deployed to `https://your-project-name.vercel.app`
- **Custom Domain**: You can add a custom domain in Vercel settings later

## Troubleshooting:

- **500 Error**: Check environment variables are correctly set
- **Firebase Error**: Verify private key format and project ID
- **Build Error**: Ensure all dependencies are in package.json

## Default Login Credentials:

- **Super Admin**: `gajula@gmail.com` / `sahithi`
- **Demo Student**: `student-test@havenly.com` / `student123`
