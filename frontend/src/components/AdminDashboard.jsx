import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/users');
      setUsers(res.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5001/api/admin/users/${id}`);
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus({ error: '', success: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordStatus({ ...passwordStatus, error: 'New passwords do not match' });
    }

    try {
      await axios.put('http://localhost:5001/api/auth/updatepassword', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordStatus({ error: '', success: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus({ error: err.response?.data?.error || 'Failed to update password', success: '' });
    }
  };

  const formatLastSeen = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>User Management (Admin)</h2>
        {error && <p style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>{error}</p>}
        
        <div className="expense-list">
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No other users found.</p>
          ) : (
            users.map(user => (
              <div key={user._id} className="expense-item" style={{ justifyContent: 'space-between', padding: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{user.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{user.email}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Last seen: <span style={{ color: 'var(--primary-color)' }}>{formatLastSeen(user.lastSeen)}</span>
                  </p>
                  <span className="category-tag" style={{ background: user.role === 'admin' ? 'rgba(110, 86, 240, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: user.role === 'admin' ? 'var(--primary-color)' : 'var(--text-secondary)', marginTop: '0.5rem', display: 'inline-block' }}>
                    {user.role}
                  </span>
                </div>
                <div className="expense-actions">
                  <button 
                    onClick={() => deleteUser(user._id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '1.2rem' }}
                    title="Delete User"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Note: Admin cannot see user financial data per privacy policy.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Admin Settings</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Change Password</h3>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {passwordStatus.error && <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{passwordStatus.error}</p>}
            {passwordStatus.success && <p style={{ color: '#2ed573', fontSize: '0.85rem' }}>{passwordStatus.success}</p>}
            
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                required 
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                required 
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                required 
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
