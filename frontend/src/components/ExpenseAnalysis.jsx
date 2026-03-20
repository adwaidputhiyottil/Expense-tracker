import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/analysis');
        setAnalysis(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analysis');
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (error) return <div className="card"><p style={{ color: 'var(--accent-red)' }}>{error}</p></div>;

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Better Expense Plan</h2>
      
      {analysis && analysis.breakdown ? (
        <>
          <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="summary-card" style={{ background: 'rgba(110, 86, 240, 0.1)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Tracked</p>
              <h3 style={{ color: 'var(--primary-color)' }}>${analysis.totalExpense.toFixed(2)}</h3>
            </div>
            <div className="summary-card" style={{ background: 'rgba(46, 213, 115, 0.1)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</p>
              <h3 style={{ color: '#2ed573' }}>Analyzed</h3>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Spending Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {analysis.breakdown.map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.category}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{item.percentage}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${item.percentage}%`, 
                      background: 'var(--primary-color)',
                      transition: 'width 1s ease-in-out'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Recommendations</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {analysis.recommendations.map((rec, index) => (
                <li key={index} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--primary-color)' }}>•</span> {rec}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(46, 213, 115, 0.1)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#2ed573' }}>Pro Strategy</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {analysis.plan}
            </p>
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--text-secondary)' }}>{analysis.message}</p>
      )}
    </div>
  );
};

export default ExpenseAnalysis;
