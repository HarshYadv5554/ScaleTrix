import Analytics from '../models/Analytics.js';

class DropoffTracker {
  /**
   * when a user drops off at a specific question
   * @param {number} sessionId - The quiz session ID
   * @param {number} userId 
   * @param {number} questionNumber - The question number where user dropped off
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
   * when a user answers a question
   * @param {number} sessionId - The quiz session ID
   * @param {number} userId - The user ID
   * @param {number} questionNumber - The question number answered
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
   * when a quiz is started
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
   * when a quiz is completed
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

