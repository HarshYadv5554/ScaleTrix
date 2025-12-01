import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 secs
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/stats`);
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="error">No data available</div>;

  const completionRate = stats.completionRate || 0;
  const dropoffRate = 100 - completionRate;

  const pieData = [
    { name: 'Completed', value: stats.totalCompleted, color: '#28a745' },
    { name: 'Dropped Off', value: stats.totalStarted - stats.totalCompleted, color: '#dc3545' }
  ];

  const dropoffData = stats.dropoffs.map(item => ({
    question: item.event_type.replace('dropped_off_after_question_', 'Q'),
    count: parseInt(item.count)
  }));

  const questionData = stats.questionStats.map(item => ({
    question: item.event_type.replace('question_', 'Q').replace('_answered', ''),
    count: parseInt(item.count)
  }));

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Started</h3>
          <div className="value">{stats.totalStarted}</div>
          <div className="label">Quiz Sessions</div>
        </div>
        <div className="stat-card">
          <h3>Total Completed</h3>
          <div className="value">{stats.totalCompleted}</div>
          <div className="label">Successful Completions</div>
        </div>
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <div className="value">{completionRate}%</div>
          <div className="label">Success Rate</div>
        </div>
        <div className="stat-card">
          <h3>Drop-off Rate</h3>
          <div className="value">{dropoffRate.toFixed(1)}%</div>
          <div className="label">Abandoned Quizzes</div>
        </div>
      </div>

      <div className="card">
        <h2>Completion vs Drop-off</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Question Completion Rates</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={questionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="question" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {dropoffData.length > 0 && (
        <div className="card">
          <h2>Drop-off Points</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dropoffData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#dc3545" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2>Export Data</h2>
        <p>Download quiz data for further analysis</p>
        <div className="export-buttons">
          <a href={`${API_BASE}/export/csv`} className="export-btn csv" download>
            📥 Export as CSV
          </a>
          <a href={`${API_BASE}/export/json`} className="export-btn json" download>
            📥 Export as JSON
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

