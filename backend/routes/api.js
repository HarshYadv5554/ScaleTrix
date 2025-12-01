import express from 'express';
const router = express.Router();

import QuizSession from '../models/QuizSession.js';
import QuizResponse from '../models/QuizResponse.js';
import Recommendation from '../models/Recommendation.js';
import Analytics from '../models/Analytics.js';
import User from '../models/User.js';

// Get all sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await QuizSession.getAll();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get session by ID with full details
router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const responses = await QuizResponse.getBySession(req.params.id);
    const recommendation = await Recommendation.getBySession(req.params.id);
    const user = await User.findById(session.user_id);

    res.json({
      session,
      user,
      responses,
      recommendation
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Get all responses
router.get('/responses', async (req, res) => {
  try {
    const responses = await QuizResponse.getAll();
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get all recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const recommendations = await Recommendation.getAll();
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Get analytics stats
router.get('/analytics/stats', async (req, res) => {
  try {
    const stats = await Analytics.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get analytics events
router.get('/analytics/events', async (req, res) => {
  try {
    const { eventType, startDate, endDate, limit } = req.query;
    const filters = {};
    
    if (eventType) filters.eventType = eventType;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (limit) filters.limit = parseInt(limit);

    const events = await Analytics.getEvents(filters);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Export data as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const sessions = await QuizSession.getAll();
    const csvRows = [];

    // Header
    csvRows.push([
      'Session ID',
      'User Phone',
      'User Name',
      'Status',
      'Started At',
      'Completed At',
      'Recommended Product',
      'Product Price',
      'Question 1 Answer',
      'Question 2 Answer',
      'Question 3 Answer',
      'Question 4 Answer',
      'Question 5 Answer',
      'Question 6 Answer'
    ].join(','));

    // Data rows
    for (const session of sessions) {
      const responses = await QuizResponse.getBySession(session.id);
      const recommendation = await Recommendation.getBySession(session.id);
      
      const answers = {};
      responses.forEach(r => {
        answers[`q${r.question_number}`] = r.answer;
      });

      csvRows.push([
        session.id,
        session.phone_number || '',
        session.name || '',
        session.status,
        session.started_at || '',
        session.completed_at || '',
        recommendation?.recommended_product || '',
        recommendation?.product_price || '',
        answers.q1 || '',
        answers.q2 || '',
        answers.q3 || '',
        answers.q4 || '',
        answers.q5 || '',
        answers.q6 || ''
      ].map(val => `"${val}"`).join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=quiz-data.csv');
    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Export data as JSON
router.get('/export/json', async (req, res) => {
  try {
    const sessions = await QuizSession.getAll();
    const exportData = [];

    for (const session of sessions) {
      const responses = await QuizResponse.getBySession(session.id);
      const recommendation = await Recommendation.getBySession(session.id);
      
      exportData.push({
        session: {
          id: session.id,
          status: session.status,
          startedAt: session.started_at,
          completedAt: session.completed_at
        },
        user: {
          phone: session.phone_number,
          name: session.name
        },
        responses: responses.map(r => ({
          questionNumber: r.question_number,
          question: r.question_text,
          answer: r.answer
        })),
        recommendation: recommendation ? {
          product: recommendation.recommended_product,
          price: recommendation.product_price,
          reason: recommendation.recommendation_reason
        } : null
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=quiz-data.json');
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting JSON:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

export default router;
