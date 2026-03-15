# Fix 500 Error - Step by Step Guide

## 🚨 Problem: 500 Server Error

The 500 error means the server is crashing during startup. Let's fix this step by step.

## 🔧 Step 1: Deploy Simple Server First

I've created a simple server that doesn't use Firebase yet. Let's deploy this first to make sure the basic setup works.

### Deploy Simple Server:
```bash
vercel --prod
```

### Test These Endpoints:
- `https://your-app-name.vercel.app/health` - Should show "ok"
- `https://your-app-name.vercel.app/debug-env` - Shows environment variables
- `https://your-app-name.vercel.app/api/test` - Should show "API is working"

## 🔧 Step 2: Check Environment Variables

After deploying, visit the debug endpoint to see what's missing:

```
https://your-app-name.vercel.app/debug-env
```

All variables should show "SET". If any show "NOT SET", add them in Vercel Dashboard:

### Vercel Dashboard → Settings → Environment Variables:

1. **FIREBASE_PROJECT_ID**
   - Value: `dormlink-ec53d`

2. **FIREBASE_CLIENT_EMAIL**
   - Value: `firebase-adminsdk-fbsvc@dormlink-ec53d.iam.gserviceaccount.com`

3. **FIREBASE_DATABASE_URL**
   - Value: `https://dormlink-ec53d.firebaseio.com`

4. **JWT_SECRET**
   - Value: `dormlink_super_secret_jwt_key_2024_secure_production`

5. **GEMINI_API_KEY**
   - Value: `AIzaSyChBeZwGc64e3xtJuxkGk36jU-8e-njUu0`

6. **NODE_ENV**
   - Value: `production`

## 🔧 Step 3: Add Firebase Private Key

This is the most important one. Add it EXACTLY as shown:

**Variable Name:** `FIREBASE_PRIVATE_KEY`

**Value:**
```
-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----
```

**Important:**
- Don't add quotes around the private key
- Include the BEGIN and END lines
- Make sure line breaks are preserved

## 🔧 Step 4: Redeploy and Test

After adding all environment variables:

```bash
vercel --prod
```

Then test:
1. `https://your-app-name.vercel.app/health` - Should work
2. `https://your-app-name.vercel.app/debug-env` - All should show "SET"

## 🔧 Step 5: Enable Full API (Once Basic Works)

Once the simple server works, I'll help you enable the full Firebase API.

## 🎯 Common 500 Error Causes:

❌ **Missing Environment Variables** - Check debug endpoint
❌ **Firebase Private Key Format** - Must include BEGIN/END lines
❌ **Build Failures** - Check Vercel build logs
❌ **Module Import Errors** - Fixed with simple server

## 📞 If Still Getting 500 Error:

1. Check Vercel Function Logs
2. Visit debug endpoint
3. Share the exact error message
4. I'll help fix it step by step

**Let's start with the simple server first! 🚀**
