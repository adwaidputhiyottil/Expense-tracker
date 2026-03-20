// Import React and useState/useContext hooks
import React, { useState, useContext } from 'react';
// Import AuthContext to access login and register functions
import { AuthContext } from '../context/AuthContext';
// Import icons from lucide-react
import { Mail, Lock, Eye, EyeOff, User, TrendingUp, ShieldCheck } from 'lucide-react';

// Login / Register toggle component for the finance app
const Login = () => {
  // State: which tab is active (login vs register)
  const [isLogin, setIsLogin] = useState(true);
  // State: toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State: form field values
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  // State: error message
  const [error, setError] = useState('');
  // State: loading while submitting
  const [submitting, setSubmitting] = useState(false);

  // Pull login and register functions from AuthContext
  const { login, register } = useContext(AuthContext);

  // Update form state on input change
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission for both login and register
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Finance badge */}
        <div className="finance-badge">
          <ShieldCheck size={12} />
          Secure Finance Portal
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem', letterSpacing: '-0.5px' }}>
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.8rem' }}>
          {isLogin
            ? 'Sign in to access your personal finance tracker'
            : 'Get started with your own expense dashboard'}
        </p>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--accent-red)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.2rem',
            fontSize: '0.85rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ textAlign: 'left' }}>
          {/* Full name — only shown during registration */}
          {!isLogin && (
            <div style={{ marginBottom: '0.2rem' }}>
              <label><User size={12} /> Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Alex Morgan"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div style={{ marginBottom: '0.2rem' }}>
            <label><Mail size={12} /> Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                style={{ paddingLeft: '2.4rem' }}
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label><Lock size={12} /> Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                style={{ paddingLeft: '2.4rem', paddingRight: '2.8rem' }}
                value={formData.password}
                onChange={onChange}
                required
                minLength="6"
              />
              {/* Toggle password visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  padding: '0', display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Switch between login and register */}
        <p style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--accent-green)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>

        {/* Footer note */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <TrendingUp size={13} color="var(--accent-green)" />
          FinTrack — Smart Expense Management
        </div>
      </div>
    </div>
  );
};

export default Login;
