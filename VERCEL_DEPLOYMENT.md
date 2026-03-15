# Vercel Deployment Guide

## 🚀 Deploy Havenly to Vercel

### **Option 1: Using Deployment Script (Recommended)**

#### Windows:
```bash
deploy-vercel.bat
```

#### Linux/Mac:
```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

### **Option 2: Manual Deployment**

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Build Frontend
```bash
cd frontend
npm run build
cd ..
```

#### Step 3: Deploy to Vercel
```bash
vercel --prod
```

## 🔧 Vercel Configuration

Your `vercel.json` file is already configured with:
- ✅ API routes (`/api/*`) → Backend server
- ✅ Static files → Frontend build
- ✅ Environment variables
- ✅ Build settings

## 📋 Required Environment Variables

Set these in your Vercel Dashboard → Project → Settings → Environment Variables:

```env
FIREBASE_PROJECT_ID=dormlink-ec53d
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhIw3v2Ab6XkKC
f3vBDRZwMynXzTzXGqFlw7ojkmS2Lo2bMHYYYwKL+O15EkzLLLoJ4fd4jeAh76AG
bmsHCtvF8I5tXaymjD59dAYajHKhJ4e6cAUAEJHCr63FJnqFBv46OjcL/sxPPanw
jjvCt1H3WGbJZAiIMnBUVTdUeDaH1V6eeOHWQzdh9d9kYP4U+k8tdEaqzAsOkqwV
OG4H99V61JYt0HuMM8HK8UM83cC/zNcDJZP0eDp06qLkXUFzHARwEnEnP5OrfX/t
V/68PE2VWbxa6TwDusFUlg5/8TTHHXxZ5bIQfqDj0zu9iWngkICLyl5csnGselpd
bsAUhKhzAgMBAAECggEASGA5EEROBfn8frBWC/tVnc9M4dPYfbxRa4IvGlVrLAgu
PNgo9vEJdg8Z5KSl7GEeE6RBps9RYQeEVdz0akiq22jYmL8XDFmkkzcT6UACb91h
7GUrrlglS8WnYuxaUd6sJvLlFGWer9C+i5dmDdRaNN6F+LNAbOxuISZeCbk1qpeq
mp4H7E1ff3qLIVHZzEO7KU4Tqc1A0hlZPCY93igzoP40wsynhE3lqy9f9I0RLOMV
HZetBDeSpWNoE5cDcY2a1JDTkxnxA+0LNjNEnbgCOdc7vx9+gS0ZCp+Pds4bBveo
qUyD//VZKuBN+RbutNqnB/DUjdSK1H7hh+/GZXBtcQKBgQDzbG+fr1EVRM3x9gsf
nIwAyrw2QirBvfR19416Me1olFLlA5/BtBb+OVDFvN/BRrbpiFahockJE611pSbU
16iQgpdjzyN7iti3gnCUey3SBLjkl8BYYzXN1FirGPj9iXvgbHPj1WXnm4JeSgqL
zNr0Npl94DMp4fyofSq+rAXD8QKBgQDsxMGE9BKe9zCuSnK50OabQ3hgN4eMpo2D
F2wrO6a695rXWUgt50iih5unCdyGlCkhzJLtGXPqqyI4dMQuf1VWoUGslPLlOSIL
Ur+THhjapalxzm7Kma1bLOCxzRQOLqKH7w73jmFamCWx52EZtCmpuwjuWsPpmnAc
IA3IzpVGowKBgCFnEtYlt4mknGIEcjhPQgLlzvffEoDtcPszEg3fhgVgvRNB8Q0i
ijkuYkAQD+A0tOrM055wVebR9W58UBzKzw2tbdq7VNIiFmTwGES3tmzoSvrLPBCk
5IAvEE/CKICZ+g6ssyZjZQ1oEHah0FqorK7wQxW7yymHIiV4r4HklxHxAoGAPw98
nd1vGZd5ycclUWxc/hFTpB79ic9ycTjD711vw4VU3QWn/JnK2TsuNcmTW/mURu3XQ
ICQqUnM4Dw9SfQve/869PikBtHmODrQAYD+g4QNEaRJRQdbCbEk8oz56u/hBw7Cx
LNAYL9fcGlEE9KKegh1VmJ5GFb7TYzpKUZRr/78CgYEArye5BTKgjG2ZtC0HIOHG
DLm/KNJc2ZUBRxuaSFe8/wL2Y85AXLzapzbCqsgrQ1sQf92dXjlN+k5ztJ41rb1v
htTtniwvvol1HITN8E72WoMET65Kel2jBnj5YmoUSeIZPqtPYnA+HP0CRvZH5NTI
0PLcM2vKXoKy28sylkSNEQE=
-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@dormlink-ec53d.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://dormlink-ec53d.firebaseio.com
JWT_SECRET=dormlink_super_secret_jwt_key_2024_secure_production
GEMINI_API_KEY=AIzaSyChBeZwGc64e3xtJuxkGk36jU-8e-njUu0
NODE_ENV=production
```

## 🎯 Deployment Steps

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### **Step 2: Deploy to Vercel**
```bash
# Option 1: Use script
deploy-vercel.bat

# Option 2: Manual
vercel --prod
```

### **Step 3: Configure Environment Variables**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the variables listed above

## 🌐 Your Live Application

After deployment, your app will be available at:
- **URL**: `https://your-app-name.vercel.app`
- **API**: `https://your-app-name.vercel.app/api/*`
- **Health Check**: `https://your-app-name.vercel.app/health`

## 🎉 Benefits of Vercel

✅ **Global CDN** - Fast loading worldwide
✅ **Automatic HTTPS** - SSL certificates included
✅ **Custom Domains** - Free custom domain support
✅ **Git Integration** - Auto-deploy on push
✅ **Preview Deployments** - Test changes before production
✅ **Analytics** - Built-in performance monitoring
✅ **Free Tier** - Generous free hosting

## 📱 Testing Your Deployment

1. **Visit**: `https://your-app-name.vercel.app`
2. **Login**: Use demo credentials
3. **Test Features**: All functionality should work
4. **Check API**: Test API endpoints
5. **Mobile**: Test on mobile devices

## 🔧 Troubleshooting

### **Build Failures**
```bash
cd frontend
npm install
npm run build
```

### **Environment Variables**
- Ensure all variables are set in Vercel dashboard
- Check for typos in variable names
- Verify Firebase credentials

### **API Issues**
- Check Vercel function logs
- Verify API routes are working
- Test health endpoint

## 🚀 Advanced Features

### **Custom Domain**
1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records

### **Analytics**
- Enable Vercel Analytics
- Monitor performance
- Track user behavior

**Your Havenly application is ready for Vercel deployment! 🎉**
