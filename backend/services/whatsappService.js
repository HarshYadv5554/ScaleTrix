import makeWASocket from '@whiskeysockets/baileys';
import {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import User from '../models/User.js';
import QuizSession from '../models/QuizSession.js';
import QuizResponse from '../models/QuizResponse.js';
import Recommendation from '../models/Recommendation.js';
import QuizService from './quizService.js';
import DropoffTracker from './dropoffTracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Store active sessions in memory (in production, use Redis)
const activeSessions = new Map();

class WhatsAppService {
  constructor() {
    this.sock = null;
    this.isConnected = false;
    this.currentQR = null;
    this.qrImageUrl = null;
  }

  async initialize() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__dirname, '../auth_info_baileys')
      );

      const { version } = await fetchLatestBaileysVersion();
      
      this.sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['WhatsApp Quiz Bot', 'Chrome', '1.0.0'],
        generateHighQualityLinkPreview: true,
      });

      this.sock.ev.on('creds.update', saveCreds);
      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.currentQR = qr;
          
          // Generate QR code image URL for web access
          QRCode.toDataURL(qr).then(url => {
            this.qrImageUrl = url;
          }).catch(err => {
            console.error('Error generating QR image:', err);
          });

          console.log('\n');
          console.log('═══════════════════════════════════════════════════════');
          console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP BUSINESS:');
          console.log('═══════════════════════════════════════════════════════');
          console.log('1. Open WhatsApp Business on your phone');
          console.log('2. Go to Settings → Linked Devices');
          console.log('3. Tap "Link a Device"');
          console.log('4. Scan the QR code below:');
          console.log('═══════════════════════════════════════════════════════');
          console.log('\n');
          console.log('QR CODE (Terminal):');
          qrcode.generate(qr, { small: false });
          console.log('\n');
          console.log('═══════════════════════════════════════════════════════');
          console.log('💡 TIP: If QR code is not scannable, visit:');
          console.log('   /api/qr-code (in your browser)');
          console.log('   Or check the web endpoint for QR image');
          console.log('═══════════════════════════════════════════════════════');
          console.log('Waiting for QR code scan...');
          console.log('═══════════════════════════════════════════════════════');
          console.log('\n');
        }

        if (connection === 'close') {
          const shouldReconnect =
            lastDisconnect?.error?.output?.statusCode !==
            DisconnectReason.loggedOut;

          console.log(
            'Connection closed due to ',
            lastDisconnect?.error,
            ', reconnecting ',
            shouldReconnect
          );

          if (shouldReconnect) {
            this.initialize();
          }
        } else if (connection === 'open') {
          console.log('✅ WhatsApp connected successfully!');
          this.isConnected = true;
        }
      });

      this.sock.ev.on('messages.upsert', async (m) => {
        await this.handleMessage(m);
      });

      return this.sock;
    } catch (error) {
      console.error('Error initializing WhatsApp:', error);
      throw error;
    }
  }

  async handleMessage({ messages, type }) {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.key.fromMe && msg.message) {
        const phoneNumber = msg.key.remoteJid.split('@')[0];
        const messageText = this.extractMessageText(msg.message);
        
        if (!messageText) continue;

        await this.processMessage(phoneNumber, messageText, msg);
      }
    }
  }

  extractMessageText(message) {
    if (message.conversation) return message.conversation;
    if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
    return null;
  }

  async processMessage(phoneNumber, messageText, originalMsg) {
    try {
      const normalizedMessage = messageText.trim().toUpperCase();

      // Get or create user
      const user = await User.findOrCreate(phoneNumber);

      // Check for START command
      if (normalizedMessage === 'START' || normalizedMessage === 'HI' || normalizedMessage === 'HELLO') {
        await this.startQuiz(user.id, phoneNumber);
        return;
      }

      // Check if user has an active session
      let session = await QuizSession.findByUserId(user.id);
      
      if (!session) {
        // No active session, prompt to start
        await this.sendMessage(
          phoneNumber,
          '👋 Welcome! Type *START* to begin the Home Security Quiz.'
        );
        return;
      }

      // Handle quiz answers
      if (['A', 'B', 'C'].includes(normalizedMessage)) {
        await this.handleQuizAnswer(session, user.id, phoneNumber, normalizedMessage);
      } else {
        // Invalid answer
        await this.sendMessage(
          phoneNumber,
          '❌ Please reply with A, B, or C to answer the question.\n\nOr type *START* to begin a new quiz.'
        );
      }
    } catch (error) {
      console.error('Error processing message:', error);
      await this.sendMessage(
        phoneNumber,
        '⚠️ Sorry, something went wrong. Please try again or type *START* to begin.'
      );
    }
  }

  async startQuiz(userId, phoneNumber) {
    try {
      // Check for existing in-progress session
      const existingSession = await QuizSession.findByUserId(userId);
      
      if (existingSession && existingSession.status === 'in_progress') {
        // Resume existing session
        const question = QuizService.getQuestion(existingSession.current_question);
        if (question) {
          await this.sendMessage(
            phoneNumber,
            `You have an ongoing quiz. Let's continue!\n\n${QuizService.formatQuestion(existingSession.current_question)}`
          );
          return;
        }
      }

      // Create new session
      const session = await QuizSession.create(userId);
      
      // Track analytics
      await DropoffTracker.trackQuizStarted(session.id, userId);

      // Send welcome message and first question
      const welcomeMsg = `🏠 *Welcome to Home Security Quiz!*\n\n` +
        `I'll ask you 6 questions to recommend the perfect security system for your home.\n\n` +
        `Let's get started!\n\n` +
        QuizService.formatQuestion(1);

      await this.sendMessage(phoneNumber, welcomeMsg);
    } catch (error) {
      console.error('Error starting quiz:', error);
      await this.sendMessage(
        phoneNumber,
        '⚠️ Sorry, couldn\'t start the quiz. Please try again.'
      );
    }
  }

  async handleQuizAnswer(session, userId, phoneNumber, answer) {
    try {
      const currentQuestion = QuizService.getQuestion(session.current_question);
      
      if (!currentQuestion) {
        await this.sendMessage(phoneNumber, '❌ Invalid question. Type *START* to begin again.');
        return;
      }

      // Validate answer
      const validOptions = currentQuestion.options.map(opt => opt.key);
      if (!validOptions.includes(answer)) {
        await this.sendMessage(
          phoneNumber,
          '❌ Please reply with A, B, or C.'
        );
        return;
      }

      // Get selected option text
      const selectedOption = currentQuestion.options.find(opt => opt.key === answer);

      // Save response
      await QuizResponse.create(
        session.id,
        session.current_question,
        currentQuestion.question,
        selectedOption.value
      );

      // Track analytics
      await DropoffTracker.trackQuestionAnswered(session.id, userId, session.current_question);

      // Move to next question
      const nextQuestionNumber = session.current_question + 1;

      if (nextQuestionNumber > QuizService.getTotalQuestions()) {
        // Quiz completed - generate recommendation
        await this.completeQuiz(session, userId, phoneNumber);
      } else {
        // Update session and send next question
        await QuizSession.updateQuestion(session.id, nextQuestionNumber);
        await this.sendMessage(
          phoneNumber,
          `✅ Great! Here's the next question:\n\n${QuizService.formatQuestion(nextQuestionNumber)}`
        );
      }
    } catch (error) {
      console.error('Error handling quiz answer:', error);
      await this.sendMessage(
        phoneNumber,
        '⚠️ Sorry, something went wrong. Please try again.'
      );
    }
  }

  async completeQuiz(session, userId, phoneNumber) {
    try {
      // Get all responses
      const responses = await QuizResponse.getBySession(session.id);
      const answers = responses.map(r => {
        const question = QuizService.getQuestion(r.question_number);
        const option = question.options.find(opt => opt.value === r.answer);
        return option ? option.key : null;
      }).filter(a => a !== null);

      // Calculate recommendation
      const recommendation = QuizService.calculateRecommendation(answers);

      // Save recommendation
      await Recommendation.create(
        session.id,
        recommendation.product.name,
        recommendation.product.price,
        recommendation.reason
      );

      // Complete session
      await QuizSession.complete(session.id);

      // Track analytics
      await DropoffTracker.trackQuizCompleted(session.id, userId);

      // Send recommendation
      const recommendationMsg = QuizService.formatRecommendation(recommendation);
      await this.sendMessage(phoneNumber, recommendationMsg);
    } catch (error) {
      console.error('Error completing quiz:', error);
      await this.sendMessage(
        phoneNumber,
        '⚠️ Sorry, couldn\'t generate recommendation. Please try again with *START*.'
      );
    }
  }

  async sendMessage(phoneNumber, text) {
    try {
      if (!this.sock || !this.isConnected) {
        console.error('WhatsApp not connected');
        return;
      }

      const jid = `${phoneNumber}@s.whatsapp.net`;
      await this.sock.sendMessage(jid, { text });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // Cleanup inactive sessions (run periodically)
  async cleanupInactiveSessions() {
    // In production, implement timeout logic
    // For now, sessions are managed per user
  }

  // Get current QR code
  getQRCode() {
    return {
      qr: this.currentQR,
      imageUrl: this.qrImageUrl
    };
  }
}

export default WhatsAppService;
