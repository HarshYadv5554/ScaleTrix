import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initializeDatabase } from './config/database.js';
import apiRoutes from './routes/api.js';
import WhatsAppService from './services/whatsappService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'WhatsApp Quiz Bot API is running' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Initialize WhatsApp service
    const whatsappService = new WhatsAppService();
    await whatsappService.initialize();

    // Store WhatsApp service instance for potential API access
    app.locals.whatsappService = whatsappService;

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Admin panel: http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
