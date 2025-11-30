import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/recommendations`);
      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load recommendations');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading recommendations...</div>;
  if (error) return <div className="error">{error}</div>;

  // Calculate product distribution
  const productCounts = {};
  let totalRevenue = 0;

  recommendations.forEach(rec => {
    const product = rec.recommended_product;
    productCounts[product] = (productCounts[product] || 0) + 1;
    totalRevenue += parseFloat(rec.product_price || 0);
  });

  const productData = Object.entries(productCounts).map(([name, count]) => ({
    name: name.replace('SecureHome ', '').replace(' Package', ''),
    value: count,
    fullName: name
  }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Recommendations</h3>
          <div className="value">{recommendations.length}</div>
          <div className="label">Products Recommended</div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="value">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="label">Potential Sales Value</div>
        </div>
        <div className="stat-card">
          <h3>Average Price</h3>
          <div className="value">
            ₹{recommendations.length > 0 
              ? (totalRevenue / recommendations.length).toLocaleString('en-IN') 
              : '0'}
          </div>
          <div className="label">Per Recommendation</div>
        </div>
      </div>

      {productData.length > 0 && (
        <div className="card">
          <h2>Product Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2>All Recommendations</h2>
        <p>Total: {recommendations.length} recommendations</p>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User Phone</th>
                <th>User Name</th>
                <th>Recommended Product</th>
                <th>Price</th>
                <th>Reason</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No recommendations found
                  </td>
                </tr>
              ) : (
                recommendations.map(rec => (
                  <tr key={rec.id}>
                    <td>{rec.id}</td>
                    <td>{rec.phone_number || 'N/A'}</td>
                    <td>{rec.name || 'N/A'}</td>
                    <td><strong>{rec.recommended_product}</strong></td>
                    <td>₹{parseFloat(rec.product_price).toLocaleString('en-IN')}</td>
                    <td style={{ maxWidth: '300px', fontSize: '0.9rem' }}>
                      {rec.recommendation_reason}
                    </td>
                    <td>{new Date(rec.created_at).toLocaleString()}</td>
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

export default Recommendations;

