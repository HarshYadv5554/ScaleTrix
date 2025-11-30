import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Analytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const params = filter !== 'all' ? { eventType: filter } : {};
      const response = await axios.get(`${API_BASE}/analytics/events`, { params });
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load analytics events');
      setLoading(false);
      console.error(err);
    }
  };

  // Process events for time series chart
  const processTimeSeriesData = () => {
    const timeMap = {};
    
    events.forEach(event => {
      const date = new Date(event.created_at).toLocaleDateString();
      if (!timeMap[date]) {
        timeMap[date] = { date, count: 0 };
      }
      timeMap[date].count++;
    });

    return Object.values(timeMap).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  // Event type distribution
  const eventTypeCounts = {};
  events.forEach(event => {
    eventTypeCounts[event.event_type] = (eventTypeCounts[event.event_type] || 0) + 1;
  });

  const eventTypeData = Object.entries(eventTypeCounts).map(([type, count]) => ({
    type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count
  }));

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  const timeSeriesData = processTimeSeriesData();

  return (
    <div>
      <div className="card">
        <h2>Analytics Events</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>Filter by Event Type:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem'
            }}
          >
            <option value="all">All Events</option>
            <option value="quiz_started">Quiz Started</option>
            <option value="quiz_completed">Quiz Completed</option>
            <option value="question_1_answered">Question 1 Answered</option>
            <option value="question_2_answered">Question 2 Answered</option>
            <option value="question_3_answered">Question 3 Answered</option>
            <option value="question_4_answered">Question 4 Answered</option>
            <option value="question_5_answered">Question 5 Answered</option>
            <option value="question_6_answered">Question 6 Answered</option>
            <option value="dropped_off_after_question_1">Dropped Off After Q1</option>
            <option value="dropped_off_after_question_2">Dropped Off After Q2</option>
            <option value="dropped_off_after_question_3">Dropped Off After Q3</option>
            <option value="dropped_off_after_question_4">Dropped Off After Q4</option>
            <option value="dropped_off_after_question_5">Dropped Off After Q5</option>
          </select>
        </div>

        <p>Total events: {events.length}</p>
      </div>

      {timeSeriesData.length > 0 && (
        <div className="card">
          <h2>Events Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {eventTypeData.length > 0 && (
        <div className="card">
          <h2>Event Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2>Recent Events</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Type</th>
                <th>User Phone</th>
                <th>User Name</th>
                <th>Session ID</th>
                <th>Metadata</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No events found
                  </td>
                </tr>
              ) : (
                events.slice(0, 50).map(event => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>
                      <code style={{ 
                        background: '#f0f0f0', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}>
                        {event.event_type}
                      </code>
                    </td>
                    <td>{event.phone_number || 'N/A'}</td>
                    <td>{event.name || 'N/A'}</td>
                    <td>{event.session_id || 'N/A'}</td>
                    <td>
                      {event.metadata ? (
                        <pre style={{ 
                          margin: 0, 
                          fontSize: '0.8rem',
                          maxWidth: '200px',
                          overflow: 'auto'
                        }}>
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      ) : 'N/A'}
                    </td>
                    <td>{new Date(event.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

