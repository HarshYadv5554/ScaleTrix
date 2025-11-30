# WhatsApp Home Security Quiz Bot

A full-stack WhatsApp automation system that guides users through a personalized home security quiz via WhatsApp, generates tailored recommendations, and tracks engagement analytics.

## 🏗️ Architecture

```
whatsapp-quiz-bot/
├── frontend/          # React Admin Panel
├── backend/           # Express Server + Baileys WhatsApp Integration
├── database/          # PostgreSQL Schema
├── analytics/        # Drop-off tracking logic
└── README.md
```

## 🚀 Features

### 1. WhatsApp Quiz Bot
- ✅ Baileys WhatsApp integration
- ✅ Interactive 6-question quiz flow
- ✅ Real-time conversation handling
- ✅ Session management

### 2. Recommendation Engine
- ✅ Personalized product recommendations based on user answers
- ✅ Three product tiers: Basic, Standard, Premium
- ✅ Scoring algorithm for optimal matching

### 3. Analytics Tracking
- ✅ Quiz start/completion tracking
- ✅ Question-by-question analytics
- ✅ Drop-off point detection
- ✅ Completion rate calculations

### 4. Admin Panel
- ✅ Dashboard with key metrics
- ✅ Session management
- ✅ Recommendations overview
- ✅ Analytics visualization
- ✅ Data export (CSV/JSON)

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (Neon free tier)
- WhatsApp account for testing

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd whatsapp-quiz-bot
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

The database schema will be automatically initialized when the server starts. Make sure your PostgreSQL connection string is set in the `.env` file.

### 4. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
DATABASE_URL=postgresql://your-database-url
WHATSAPP_NUMBER=your-phone-number
NODE_ENV=development
```

## 🚀 Running the Application

### Development Mode

#### Option 1: Run separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Option 2: Run together (from root)
```bash
npm run dev
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## 📱 WhatsApp Setup

1. Start the backend server
2. A QR code will appear in the terminal
3. Open WhatsApp on your phone
4. Go to Settings > Linked Devices
5. Tap "Link a Device" and scan the QR code
6. The bot is now ready to receive messages!

## 🎯 Usage

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

## 📊 Quiz Questions

The quiz asks 6 questions about:
1. Home size
2. Primary security concern
3. Remote monitoring needs
4. Budget range
5. Professional monitoring preference
6. Installation preference

## 🎁 Product Recommendations

### SecureHome Basic Package ($299.99)
- For small homes (1-2 bedrooms)
- Essential security features
- DIY installation

### SecureHome Standard Package ($899.99)
- For medium homes (3-4 bedrooms)
- Comprehensive protection
- Mobile app with live view

### SecureHome Premium Package ($1999.99)
- For large properties (5+ bedrooms)
- Full-featured system
- Professional monitoring included

## 📈 Analytics Events

The system tracks:
- `quiz_started`: When a user begins the quiz
- `question_{n}_answered`: Each question answered
- `quiz_completed`: Successful completion
- `dropped_off_after_question_{n}`: Abandonment points

## 🔌 API Endpoints

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session details

### Recommendations
- `GET /api/recommendations` - Get all recommendations

### Analytics
- `GET /api/analytics/stats` - Get analytics statistics
- `GET /api/analytics/events` - Get analytics events

### Export
- `GET /api/export/csv` - Export data as CSV
- `GET /api/export/json` - Export data as JSON

## 🚢 Deployment

### Render Deployment

1. **Backend Deployment:**
   - Connect your GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables:
     - `DATABASE_URL`
     - `PORT` (optional, defaults to 3001)
     - `NODE_ENV=production`

2. **Frontend Deployment:**
   - Connect your GitHub repository
   - Set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/build`
   - Add environment variable:
     - `REACT_APP_API_URL` (your backend URL)

3. **Database:**
   - Use Neon PostgreSQL (already configured)
   - Ensure connection string is in backend `.env`

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Baileys** - WhatsApp Web API
- **PostgreSQL** - Database (via Neon)
- **pg** - PostgreSQL client

### Frontend
- **React** - UI framework
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Database
- **PostgreSQL** (Neon free tier)

## 📁 Project Structure

```
whatsapp-quiz-bot/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── QuizSession.js        # Session model
│   │   ├── QuizResponse.js       # Response model
│   │   ├── Recommendation.js     # Recommendation model
│   │   └── Analytics.js          # Analytics model
│   ├── routes/
│   │   └── api.js                # API routes
│   ├── services/
│   │   ├── whatsappService.js    # WhatsApp bot logic
│   │   └── quizService.js        # Quiz questions & recommendations
│   ├── server.js                 # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── Sessions.js       # Sessions view
│   │   │   ├── Recommendations.js # Recommendations view
│   │   │   └── Analytics.js      # Analytics view
│   │   ├── App.js                # Main app component
│   │   └── index.js
│   └── package.json
├── database/
│   └── schema.sql                # Database schema
├── analytics/
│   └── dropoffTracker.js         # Drop-off tracking logic
└── README.md
```

## 🐛 Troubleshooting

### WhatsApp Connection Issues
- Ensure QR code is scanned within the timeout period
- Check if WhatsApp Web is already connected on another device
- Delete `backend/auth_info_baileys/` folder and restart

### Database Connection Issues
- Verify `DATABASE_URL` in `.env` file
- Check if Neon database is active
- Ensure SSL mode is enabled

### Frontend Not Loading
- Check if backend is running on port 3001
- Verify `REACT_APP_API_URL` environment variable
- Check browser console for errors

## 📝 License

MIT License

## 👤 Author

Built for ScaleTrix Assignment

## 🙏 Acknowledgments

- Baileys for WhatsApp integration
- Neon for free PostgreSQL hosting
- Render for deployment platform

