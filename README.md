# WhatsApp Home Security Quiz Bot

A full-stack WhatsApp automation system that guides users through a personalized home security quiz via WhatsApp, generates tailored recommendations, and tracks engagement analytics.

## Architecture

```
whatsapp-quiz-bot/
├── frontend/          # React Admin Panel
├── backend/           # Express Server + Baileys WhatsApp Integration
├── database/          # PostgreSQL Schema
└── analytics/         # Drop-off tracking logic
```

## Features

- WhatsApp Quiz Bot: Interactive 6-question quiz flow with Baileys integration
- Recommendation Engine: Personalized product recommendations (Basic, Standard, Premium)
- Analytics Tracking: Quiz completion rates, drop-off points, and engagement metrics
- Admin Panel: Dashboard with metrics, session management, and data export

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- WhatsApp account for testing

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd whatsapp-quiz-bot
```

### 2. Install dependencies

```bash
# Install all dependencies
npm run install-all
```

Or install separately:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
DATABASE_URL=postgresql://your-database-url
WHATSAPP_NUMBER=your-phone-number
NODE_ENV=development
```

### 4. Database Setup

The database schema will be automatically initialized when the server starts. Ensure your PostgreSQL connection string is set in the `.env` file.

## Running the Application

### Development Mode

**Option 1: Run together (from root)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### Production Mode

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## WhatsApp Setup

1. Start the backend server
2. A QR code will appear in the terminal
3. Open WhatsApp on your phone
4. Go to Settings > Linked Devices
5. Tap "Link a Device" and scan the QR code
6. The bot is now ready to receive messages!

## Usage

### For Users (WhatsApp)

1. Send `START`, `HI`, or `HELLO` to begin the quiz
2. Answer 6 questions by replying with `A`, `B`, or `C`
3. Receive a personalized security system recommendation

### For Admins (Web Panel)

1. Open `http://localhost:3000` (or your deployed URL)
2. Navigate through tabs:
   - **Dashboard**: Overview metrics and charts
   - **Sessions**: View all quiz sessions
   - **Recommendations**: See all product recommendations
   - **Analytics**: Detailed event tracking

## Deployed URLs

- **Backend Base URL**: [`https://whatsapp-quiz-backendd.onrender.com/`](https://whatsapp-quiz-backendd.onrender.com/)
- **Backend QR Page**: [`https://whatsapp-quiz-backendd.onrender.com/qr.html`](https://whatsapp-quiz-backendd.onrender.com/qr.html)
- **Frontend Admin Panel**: [`https://whatsapp-quiz-frontendd.onrender.com/`](https://whatsapp-quiz-frontendd.onrender.com/)

## API Endpoints

- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session details
- `GET /api/recommendations` - Get all recommendations
- `GET /api/analytics/stats` - Get analytics statistics
- `GET /api/analytics/events` - Get analytics events
- `GET /api/export/csv` - Export data as CSV
- `GET /api/export/json` - Export data as JSON

## Tech Stack

**Backend:** Node.js, Express, Baileys, PostgreSQL  
**Frontend:** React, Recharts, Axios  
**Database:** PostgreSQL

## Troubleshooting

**WhatsApp Connection Issues:**
- Ensure QR code is scanned within the timeout period
- Check if WhatsApp Web is already connected on another device
- Delete `backend/auth_info_baileys/` folder and restart

**Database Connection Issues:**
- Verify `DATABASE_URL` in `.env` file
- Check if database is active
- Ensure SSL mode is enabled

**Frontend Not Loading:**
- Check if backend is running on port 3001
- Verify `REACT_APP_API_URL` environment variable
- Check browser console for errors

