import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API_BASE}/sessions`);
      setSessions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load sessions');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchSessionDetails = async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE}/sessions/${sessionId}`);
      setSelectedSession(response.data);
    } catch (err) {
      console.error('Failed to load session details:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const className = status === 'completed' ? 'completed' : 
                     status === 'in_progress' ? 'in_progress' : 'abandoned';
    return <span className={`badge ${className}`}>{status}</span>;
  };

  if (loading) return <div className="loading">Loading sessions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="card">
        <h2>All Quiz Sessions</h2>
        <p>Total sessions: {sessions.length}</p>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone Number</th>
                <th>Name</th>
                <th>Status</th>
                <th>Current Question</th>
                <th>Started At</th>
                <th>Completed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No sessions found
                  </td>
                </tr>
              ) : (
                sessions.map(session => (
                  <tr key={session.id}>
                    <td>{session.id}</td>
                    <td>{session.phone_number || 'N/A'}</td>
                    <td>{session.name || 'N/A'}</td>
                    <td>{getStatusBadge(session.status)}</td>
                    <td>{session.current_question || 'N/A'}</td>
                    <td>{formatDate(session.started_at)}</td>
                    <td>{formatDate(session.completed_at)}</td>
                    <td>
                      <button
                        onClick={() => fetchSessionDetails(session.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSession && (
        <div className="card">
          <h2>Session Details</h2>
          <button
            onClick={() => setSelectedSession(null)}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              background: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          
          <div style={{ marginBottom: '1rem' }}>
            <h3>User Information</h3>
            <p><strong>Phone:</strong> {selectedSession.user?.phone_number || 'N/A'}</p>
            <p><strong>Name:</strong> {selectedSession.user?.name || 'N/A'}</p>
          </div>

          {selectedSession.responses && selectedSession.responses.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h3>Responses</h3>
              <table>
                <thead>
                  <tr>
                    <th>Question #</th>
                    <th>Question</th>
                    <th>Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSession.responses.map((response, idx) => (
                    <tr key={idx}>
                      <td>{response.question_number}</td>
                      <td>{response.question_text}</td>
                      <td>{response.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedSession.recommendation && (
            <div>
              <h3>Recommendation</h3>
              <p><strong>Product:</strong> {selectedSession.recommendation.recommended_product}</p>
              <p><strong>Price:</strong> ₹{parseFloat(selectedSession.recommendation.product_price).toLocaleString('en-IN')}</p>
              <p><strong>Reason:</strong> {selectedSession.recommendation.recommendation_reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Sessions;

