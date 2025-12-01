import Analytics from '../backend/models/Analytics.js';

class DropoffTracker {
  /**
   * Track when a user drops off at a specific question
   * @param {number} sessionId 
   * @param {number} userId 
   * @param {number} questionNumber 
   */
  static async trackDropoff(sessionId, userId, questionNumber) {
    try {
      await Analytics.logEvent(
        sessionId,
        userId,
        `dropped_off_after_question_${questionNumber}`,
        {
          questionNumber,
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Error tracking dropoff:', error);
    }
  }

  /**
   * Track when a user answers a question
   * @param {number} sessionId 
   * @param {number} userId 
   * @param {number} questionNumber 
   */
  static async trackQuestionAnswered(sessionId, userId, questionNumber) {
    try {
      await Analytics.logEvent(
        sessionId,
        userId,
        `question_${questionNumber}_answered`,
        {
          questionNumber,
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Error tracking question answer:', error);
    }
  }

  /**
   * Track when a quiz is started
   * @param {number} sessionId 
   * @param {number} userId 
   */
  static async trackQuizStarted(sessionId, userId) {
    try {
      await Analytics.logEvent(
        sessionId,
        userId,
        'quiz_started',
        {
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Error tracking quiz start:', error);
    }
  }

  /**
   * Track when a quiz is completed
   * @param {number} sessionId 
   * @param {number} userId 
   */
  static async trackQuizCompleted(sessionId, userId) {
    try {
      await Analytics.logEvent(
        sessionId,
        userId,
        'quiz_completed',
        {
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
    }
  }
}

export default DropoffTracker;
