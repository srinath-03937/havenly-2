# Havenly - Vercel Full-Stack Deployment Guide

## Overview
This guide explains how to deploy both frontend and backend on Vercel using serverless functions.

## Prerequisites
- Vercel account (free)
- GitHub repository
- Firebase project with Firestore
- Environment variables ready

## Step 1: Prepare Your Repository

### 1.1 Push All Changes
Make sure all changes are pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel full-stack deployment"
git push origin main
```

### 1.2 Repository Structure
Your repository should have this structure:
```
Havenly/
├── frontend/
│   ├── api/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── student.js
│   │   ├── models/
│   │   └── middleware/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── backend/ (original backend - can be ignored)
```

## Step 2: Deploy to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"

### 2.2 Import Repository
1. Select your `Havenly` repository
2. Set **Root Directory** to `frontend`
3. Vercel will automatically detect it's a Vite project

### 2.3 Configure Build Settings
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.4 Add Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[your-key]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
JWT_SECRET=your-secure-jwt-secret-for-production
GEMINI_API_KEY=your-gemini-api-key
```

### 2.5 Deploy
Click "Deploy" and wait for the deployment to complete.

## Step 3: Post-Deployment Setup

### 3.1 Test the Application
1. Visit your Vercel URL
2. Test login functionality
3. Test Super Admin features
4. Test file uploads (if needed)

### 3.2 Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Step 4: Firebase Configuration

### 4.1 Update CORS Settings
Make sure your Firebase Firestore security rules allow access from your Vercel domain:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4.2 Test Database Connection
1. Create a test user
2. Verify data appears in Firestore
3. Check all CRUD operations

## Step 5: Monitor and Maintain

### 5.1 Vercel Analytics
- Monitor performance in Vercel dashboard
- Check function execution logs
- Monitor error rates

### 5.2 Firebase Usage
- Monitor Firestore usage
- Check storage limits
- Set up alerts for high usage

## Troubleshooting

### Common Issues

#### 1. Function Timeout
- **Problem**: Serverless functions timing out
- **Solution**: Optimize database queries, add pagination

#### 2. CORS Errors
- **Problem**: API calls blocked by CORS
- **Solution**: Check CORS headers in API functions

#### 3. Environment Variables
- **Problem**: Functions can't access environment variables
- **Solution**: Ensure variables are set in Vercel dashboard

#### 4. Firebase Connection
- **Problem**: Can't connect to Firebase
- **Solution**: Verify service account credentials

### Debugging Tips

1. **Check Vercel Logs**: Functions → Your Function → Logs
2. **Test Locally**: Use `vercel dev` to test locally
3. **Monitor Network**: Use browser dev tools to check API calls

## Performance Optimization

### 1. Function Optimization
- Keep functions lightweight
- Use efficient database queries
- Implement caching where possible

### 2. Frontend Optimization
- Enable code splitting
- Optimize images
- Use lazy loading

### 3. Database Optimization
- Create appropriate indexes
- Use pagination for large datasets
- Cache frequently accessed data

## Scaling Considerations

### When to Scale
- High traffic volume
- Complex operations
- Multiple regions

### Scaling Options
- Vercel Pro Plan for more function execution time
- Consider dedicated backend for heavy processing
- Use CDN for static assets

## Security Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **JWT Tokens**: Use strong secrets and appropriate expiration
3. **Input Validation**: Validate all user inputs
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **HTTPS**: Always use HTTPS (automatic with Vercel)

## Support

For issues:
1. Check Vercel documentation
2. Review Firebase documentation
3. Create GitHub issues for bugs
4. Monitor Vercel status page

## Success Metrics

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Login/Registration works
- ✅ Admin dashboard functions
- ✅ Super Admin features work
- ✅ Data persists in Firebase
- ✅ File uploads work (if implemented)

## Next Steps

After successful deployment:
1. Set up monitoring alerts
2. Configure backup strategies
3. Plan for scaling
4. Document custom configurations
5. Train users on the new system

---

**Congratulations!** Your Havenly application is now running on Vercel with both frontend and backend deployed together.
