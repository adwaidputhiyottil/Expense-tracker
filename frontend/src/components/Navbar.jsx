// Import React and context hook
import React, { useContext } from 'react';
// Import AuthContext to access user info and logout function
import { AuthContext } from '../context/AuthContext';
// Import icons from lucide-react
import { LogOut, TrendingUp, User, Bell } from 'lucide-react';

// Navbar component — finance-themed top navigation bar
const Navbar = ({ view, setView }) => {
  // Destructure user and logout from the global auth context
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      {/* Left side: Brand logo and name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <TrendingUp size={18} color="#0a0f1e" strokeWidth={2.5} />
        </div>
        <div className="nav-brand">
          Fin<span className="brand-accent">Track</span>
        </div>
      </div>

      {/* Right side: User greeting and logout button */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '0.5rem', marginRight: '1rem' }}>
            <button 
              onClick={() => setView('dashboard')}
              style={{
                background: view === 'dashboard' ? 'rgba(110, 86, 240, 0.1)' : 'transparent',
                color: view === 'dashboard' ? 'var(--primary-color)' : 'var(--text-secondary)',
                border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
              }}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('analysis')}
              style={{
                background: view === 'analysis' ? 'rgba(110, 86, 240, 0.1)' : 'transparent',
                color: view === 'analysis' ? 'var(--primary-color)' : 'var(--text-secondary)',
                border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
              }}
            >
              Analysis
            </button>
            {user.role === 'admin' && (
              <button 
                onClick={() => setView('admin')}
                style={{
                  background: view === 'admin' ? 'rgba(110, 86, 240, 0.1)' : 'transparent',
                  color: view === 'admin' ? 'var(--primary-color)' : 'var(--text-secondary)',
                  border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
                }}
              >
                Admin
              </button>
            )}
          </div>

          {/* Bell icon (decorative) */}
          <div style={{
            width: '36px', height: '36px',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--accent-green)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Bell size={16} />
          </div>

          {/* User avatar + name */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.4rem 0.8rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: '10px'
          }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={14} color="#0a0f1e" strokeWidth={2.5} />
            </div>
            <span className="hidden-mobile" style={{ fontSize: '0.87rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {user.name}
            </span>
          </div>

          {/* Logout button */}
          <button onClick={logout} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <LogOut size={15} />
            <span className="hidden-mobile">Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
