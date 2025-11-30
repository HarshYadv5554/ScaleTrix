# 🚀 Render Deployment - Step by Step Guide

## Quick Deployment Steps

### Method 1: Using Blueprint (Recommended - Easiest)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Blueprint"**
3. **Connect GitHub**:
   - Authorize Render to access your GitHub
   - Select repository: `ScaleTrix2`
   - Branch: `main`
4. **Review Configuration**:
   - Render will detect `render.yaml` in the root
   - It will create both backend and frontend services
5. **Set Environment Variables**:
   - **Backend Service**:
     - `DATABASE_URL`: `postgresql://neondb_owner:npg_RWj5k8hvePHK@ep-restless-union-a1ns1jo4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
     - `PORT`: `3001` (already set)
     - `NODE_ENV`: `production` (already set)
     - `WHATSAPP_NUMBER`: `9991943266` (already set)
   
   - **Frontend Service**:
     - `REACT_APP_API_URL`: `https://whatsapp-quiz-backend.onrender.com/api`
     - (Update this AFTER backend is deployed with actual URL)
6. **Click "Apply"** and wait for deployment (10-15 minutes)

---

### Method 2: Manual Deployment (Step by Step)

## Step 1: Deploy Backend

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**:
   - Connect GitHub account
   - Repository: `ScaleTrix2`
   - Branch: `main`
4. **Configure Service**:
   - **Name**: `whatsapp-quiz-backend`
   - **Root Directory**: `whatsapp-quiz-bot/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. **Add Environment Variables**:
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_RWj5k8hvePHK@ep-restless-union-a1ns1jo4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   PORT = 3001
   NODE_ENV = production
   WHATSAPP_NUMBER = 9991943266
   ```
6. **Click "Create Web Service"**
7. **Wait for deployment** (5-10 minutes)
8. **Copy your backend URL** (e.g., `https://whatsapp-quiz-backend.onrender.com`)

---

## Step 2: Deploy Frontend

1. **Go to Render Dashboard**
2. **Click "New +"** → **"Static Site"**
3. **Connect Repository**:
   - Repository: `ScaleTrix2`
   - Branch: `main`
4. **Configure Site**:
   - **Name**: `whatsapp-quiz-frontend`
   - **Root Directory**: `whatsapp-quiz-bot/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
5. **Add Environment Variable**:
   ```
   REACT_APP_API_URL = https://whatsapp-quiz-backend.onrender.com/api
   ```
   (Use the actual backend URL from Step 1)
6. **Click "Create Static Site"**
7. **Wait for deployment** (3-5 minutes)

---

## Step 3: Connect WhatsApp

1. **Go to Backend Service** → **Logs** tab
2. **Look for QR code** in the logs
3. **Scan QR code** with WhatsApp Business (9991943266):
   - Open WhatsApp Business
   - Settings → Linked Devices
   - Link a Device
   - Scan the QR code from logs
4. **Wait for**: "✅ WhatsApp connected successfully!" in logs

---

## ⚠️ Important Notes for Render Free Tier

### WhatsApp Bot Considerations:

1. **Service Sleep**: Free tier services sleep after 15 minutes of inactivity
   - WhatsApp connection will be lost when service sleeps
   - **Solution**: Use a keep-alive service (see below)

2. **Keep-Alive Setup** (Free Tier):
   - Use https://cron-job.org or https://uptimerobot.com
   - Create a cron job to ping: `https://your-backend-url.onrender.com/health`
   - Set interval: Every 10 minutes
   - This keeps the service awake

3. **Alternative**: Upgrade to Paid Plan
   - Services run 24/7
   - Better for production WhatsApp bot

---

## 🔧 Post-Deployment Configuration

### Update Frontend API URL

After backend is deployed:

1. Go to Frontend service → **Environment** tab
2. Update `REACT_APP_API_URL`:
   ```
   https://your-actual-backend-url.onrender.com/api
   ```
3. **Save** and **Redeploy**

---

## ✅ Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Backend health check works: `https://your-backend.onrender.com/health`
- [ ] Database connected (check backend logs)
- [ ] WhatsApp QR code appears in backend logs
- [ ] WhatsApp connected successfully
- [ ] Frontend can call backend API
- [ ] Admin panel loads correctly
- [ ] Test quiz flow works

---

## 🔗 Your Deployed URLs

After deployment:

- **Backend**: `https://whatsapp-quiz-backend.onrender.com`
- **Frontend**: `https://whatsapp-quiz-frontend.onrender.com`
- **API**: `https://whatsapp-quiz-backend.onrender.com/api`
- **Health**: `https://whatsapp-quiz-backend.onrender.com/health`

---

## 🐛 Troubleshooting

### Backend Issues

**Build Fails**:
- Check build logs
- Verify Node.js version (Render uses latest LTS)
- Check for missing dependencies

**Database Connection Error**:
- Verify `DATABASE_URL` environment variable
- Check Neon database is active
- Ensure SSL mode is enabled

**WhatsApp Not Connecting**:
- Check backend logs for QR code
- Verify `auth_info_baileys/` folder (may need persistent disk on paid plan)
- Service may be sleeping (use keep-alive)

### Frontend Issues

**Build Fails**:
- Check build logs for errors
- Verify `REACT_APP_API_URL` is set
- Check for compilation errors

**API Calls Fail**:
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings (already enabled in backend)
- Verify backend is running

**Blank Page**:
- Check browser console
- Verify build completed
- Check network tab for API errors

---

## 📊 Monitoring

### View Logs:
- Backend: Render Dashboard → Service → Logs
- Frontend: Render Dashboard → Site → Logs

### Monitor Health:
- Use `/health` endpoint
- Set up uptime monitoring
- Check service status in dashboard

---

## 🎉 Success!

Once deployed, your application is live!

**Test it:**
1. Visit frontend URL
2. Send `START` to WhatsApp Business number
3. Complete quiz
4. Check admin panel

---

## 📝 Quick Reference

**Backend Environment Variables:**
```
DATABASE_URL=postgresql://neondb_owner:npg_RWj5k8hvePHK@ep-restless-union-a1ns1jo4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3001
NODE_ENV=production
WHATSAPP_NUMBER=9991943266
```

**Frontend Environment Variables:**
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

Happy Deploying! 🚀

