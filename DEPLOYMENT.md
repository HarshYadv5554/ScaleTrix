# Deployment Guide - Render

This guide will help you deploy the WhatsApp Quiz Bot application on Render.

## 🚀 Deployment Steps

### Prerequisites
1. GitHub account with the code pushed
2. Render account (sign up at https://render.com)
3. Neon PostgreSQL database URL (already configured)

---

## 📦 Step 1: Deploy Backend (Express Server)

### Option A: Using Render Dashboard

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Web Service"**
3. **Connect Repository**:
   - Connect your GitHub account
   - Select repository: `ScaleTrix2`
   - Branch: `main`
4. **Configure Service**:
   - **Name**: `whatsapp-quiz-backend`
   - **Root Directory**: `whatsapp-quiz-bot/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose based on your needs)

5. **Environment Variables**:
   Click "Add Environment Variable" and add:
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_RWj5k8hvePHK@ep-restless-union-a1ns1jo4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   PORT = 3001
   NODE_ENV = production
   WHATSAPP_NUMBER = 9991943266
   ```

6. **Click "Create Web Service"**
7. **Wait for deployment** (5-10 minutes)

### Option B: Using render.yaml (Blueprints)

1. Go to Render Dashboard
2. Click "New +" → Select **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` files
5. Review and deploy

---

## 🎨 Step 2: Deploy Frontend (React App)

1. **Go to Render Dashboard**
2. **Click "New +"** → Select **"Static Site"**
3. **Connect Repository**:
   - Select repository: `ScaleTrix2`
   - Branch: `main`
4. **Configure Site**:
   - **Name**: `whatsapp-quiz-frontend`
   - **Root Directory**: `whatsapp-quiz-bot/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

5. **Environment Variables**:
   Add:
   ```
   REACT_APP_API_URL = https://your-backend-service-name.onrender.com/api
   ```
   (Replace `your-backend-service-name` with your actual backend service name from Step 1)

6. **Click "Create Static Site"**
7. **Wait for deployment** (3-5 minutes)

---

## ⚙️ Step 3: Update Frontend API URL

After backend is deployed:

1. **Get your backend URL** from Render dashboard (e.g., `https://whatsapp-quiz-backend.onrender.com`)
2. **Update Frontend Environment Variable**:
   - Go to Frontend service settings
   - Update `REACT_APP_API_URL` to: `https://your-backend-url.onrender.com/api`
   - Save and redeploy

---

## 🔧 Step 4: Configure WhatsApp (Important!)

### For WhatsApp to work on Render:

1. **WhatsApp Connection**:
   - The backend needs to maintain a persistent connection
   - On Render free tier, services may sleep after inactivity
   - **Solution**: Use a paid plan OR set up a keep-alive ping

2. **QR Code Access**:
   - You'll need to access backend logs to see QR code
   - Go to Render Dashboard → Your Backend Service → Logs
   - Look for QR code in the logs
   - Scan with WhatsApp Business (9991943266)

3. **Persistent Storage**:
   - WhatsApp auth files are stored in `auth_info_baileys/`
   - These are in `.gitignore` (not pushed to GitHub)
   - **Solution**: Use Render Disk for persistent storage OR reconnect each time

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://neondb_owner:npg_RWj5k8hvePHK@ep-restless-union-a1ns1jo4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
WHATSAPP_NUMBER=9991943266
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

## 🐛 Troubleshooting

### Backend Issues

1. **Build Fails**:
   - Check build logs in Render dashboard
   - Ensure `package.json` has correct scripts
   - Verify Node.js version compatibility

2. **Database Connection Error**:
   - Verify `DATABASE_URL` is correct
   - Check if Neon database is active
   - Ensure SSL is enabled

3. **WhatsApp Not Connecting**:
   - Check backend logs for QR code
   - Verify `auth_info_baileys/` folder permissions
   - On free tier, service may sleep - use paid plan for 24/7 uptime

### Frontend Issues

1. **Build Fails**:
   - Check build logs
   - Verify `REACT_APP_API_URL` is set
   - Check for compilation errors

2. **API Calls Fail**:
   - Verify `REACT_APP_API_URL` points to correct backend URL
   - Check CORS settings in backend
   - Verify backend is running

3. **Blank Page**:
   - Check browser console for errors
   - Verify build completed successfully
   - Check network tab for API calls

---

## 🔄 Keep-Alive Setup (For Free Tier)

Render free tier services sleep after 15 minutes of inactivity. To keep WhatsApp connected:

### Option 1: External Ping Service
Use a service like:
- https://cron-job.org
- https://uptimerobot.com

Set up a cron job to ping your backend every 10 minutes:
```
https://your-backend-url.onrender.com/health
```

### Option 2: Upgrade to Paid Plan
- Paid plans keep services running 24/7
- Better for WhatsApp bot that needs constant connection

---

## 📊 Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database connected
- [ ] Environment variables set
- [ ] Frontend API URL updated
- [ ] WhatsApp QR code scanned
- [ ] Test quiz flow works
- [ ] Admin panel accessible
- [ ] Analytics tracking working

---

## 🔗 Your Deployed URLs

After deployment, you'll have:

- **Backend API**: `https://your-backend-name.onrender.com`
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Health Check**: `https://your-backend-name.onrender.com/health`
- **API Base**: `https://your-backend-name.onrender.com/api`

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Static Sites](https://render.com/docs/static-sites)

---

## ⚠️ Important Notes

1. **Free Tier Limitations**:
   - Services may sleep after inactivity
   - Slower cold starts
   - Limited build minutes per month

2. **WhatsApp Bot**:
   - Requires persistent connection
   - Consider paid plan for production
   - Or use keep-alive service

3. **Database**:
   - Neon free tier is sufficient
   - Connection string already configured

4. **Security**:
   - Never commit `.env` files
   - Use Render environment variables
   - Keep database credentials secure

---

## 🎉 Success!

Once deployed, your application will be live and accessible worldwide!

**Test your deployment:**
1. Visit frontend URL
2. Send `START` to WhatsApp Business number
3. Complete quiz
4. Check admin panel for data

Happy Deploying! 🚀

