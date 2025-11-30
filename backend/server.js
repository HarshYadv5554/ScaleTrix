import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { initializeDatabase } from './config/database.js';
import apiRoutes from './routes/api.js';
import WhatsAppService from './services/whatsappService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (QR code HTML page)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'WhatsApp Quiz Bot API is running' });
});

// QR Code endpoint - Get QR code data
app.get('/api/qr-code', (req, res) => {
  const whatsappService = app.locals.whatsappService;
  if (!whatsappService) {
    return res.status(503).json({ error: 'WhatsApp service not initialized' });
  }

  const qrData = whatsappService.getQRCode();
  if (!qrData.qr) {
    return res.json({ 
      message: 'No QR code available. WhatsApp may already be connected.',
      connected: whatsappService.isConnected 
    });
  }

  res.json({
    qr: qrData.qr,
    imageUrl: qrData.imageUrl,
    instructions: [
      '1. Open WhatsApp Business on your phone',
      '2. Go to Settings → Linked Devices',
      '3. Tap "Link a Device"',
      '4. Scan the QR code image below or visit /api/qr-image'
    ]
  });
});

// QR Code image endpoint - Get QR code as PNG image
app.get('/api/qr-image', async (req, res) => {
  const whatsappService = app.locals.whatsappService;
  if (!whatsappService) {
    return res.status(503).send('WhatsApp service not initialized');
  }

  const qrData = whatsappService.getQRCode();
  if (!qrData.imageUrl) {
    return res.status(404).send('QR code not available. WhatsApp may already be connected.');
  }

  // Convert data URL to image
  const base64Data = qrData.imageUrl.replace(/^data:image\/png;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');
  
  res.setHeader('Content-Type', 'image/png');
  res.send(imageBuffer);
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
      console.log(`📱 QR Code Scanner: http://localhost:${PORT}/qr.html`);
      console.log(`📱 QR Code Image: http://localhost:${PORT}/api/qr-image`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
