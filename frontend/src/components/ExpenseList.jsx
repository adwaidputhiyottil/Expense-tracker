// Import React library and useState for local confirm state
import React, { useState } from 'react';
// Import icons from lucide-react
import { Trash2, Edit, ReceiptText, AlertTriangle, X } from 'lucide-react';

// Category metadata for icons and colors
const CATEGORY_META = {
  Food:          { icon: '🍔', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Transport:     { icon: '🚗', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  Shopping:      { icon: '🛍️', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  Bills:         { icon: '📄', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  Entertainment: { icon: '🎬', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  Other:         { icon: '💼', color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
};

// ExpenseList — displays all user expenses as a bank-statement-style transaction list
const ExpenseList = ({ expenses, deleteExpense, setEditingItem }) => {
  // Track which expense ID is pending confirmation before delete
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Format a date string into a readable local date
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Calculate total spending shown in the list
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Handle delete: first click arms confirm, second click fires delete
  const handleDeleteClick = (id) => {
    if (confirmDeleteId === id) {
      // Second click — actually delete
      deleteExpense(id);
      setConfirmDeleteId(null);
    } else {
      // First click — arm the confirm state
      setConfirmDeleteId(id);
    }
  };

  // Cancel the pending confirm
  const cancelDelete = () => setConfirmDeleteId(null);

  return (
    <div className="card">
      {/* Section header with total */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
          <div className="title-dot" style={{ background: 'var(--accent-blue)' }} />
          <ReceiptText size={15} />
          Transactions
        </div>
        {/* Show total count and amount */}
        {expenses.length > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700', color: 'var(--accent-red)', fontSize: '1rem' }}>
              -₹{total.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1rem' }} />

      {/* Empty state */}
      {expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>💳</div>
          <p style={{ fontSize: '0.9rem' }}>No transactions yet.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Add your first expense to get started.
          </p>
        </div>
      ) : (
        // Transaction list — styled like a bank statement
        <div style={{ maxHeight: '520px', overflowY: 'auto', paddingRight: '0.2rem' }}>
          {expenses.map((expense) => {
            const meta = CATEGORY_META[expense.category] || CATEGORY_META.Other;
            const isPendingDelete = confirmDeleteId === expense._id;

            return (
              <div
                key={expense._id}
                className="expense-item"
                style={{
                  borderColor: isPendingDelete ? 'rgba(239,68,68,0.4)' : undefined,
                  background: isPendingDelete ? 'rgba(239,68,68,0.05)' : undefined,
                }}
              >
                {/* Category icon badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                  <div className="tx-icon" style={{ background: meta.bg, flexShrink: 0 }}>
                    <span style={{ fontSize: '1.1rem' }}>{meta.icon}</span>
                  </div>

                  {/* Transaction details */}
                  <div style={{ minWidth: 0 }}>
                    <div className="tx-title" style={{
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {expense.title}
                    </div>
                    <div className="tx-meta">
                      {/* Category badge */}
                      <span style={{
                        display: 'inline-block',
                        background: meta.bg,
                        color: meta.color,
                        borderRadius: '4px',
                        padding: '0.05rem 0.4rem',
                        fontSize: '0.68rem',
                        fontWeight: '600',
                        letterSpacing: '0.3px',
                        marginRight: '0.4rem',
                      }}>
                        {expense.category}
                      </span>
                      {formatDate(expense.date)}
                    </div>
                    {/* Confirm delete message */}
                    {isPendingDelete && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-red)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                        <AlertTriangle size={11} />
                        Click 🗑 again to confirm delete
                      </div>
                    )}
                    {/* Optional note */}
                    {expense.note && !isPendingDelete && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem', fontStyle: 'italic' }}>
                        {expense.note}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount and actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                  <div className="tx-amount">
                    -₹{Number(expense.amount).toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {/* Cancel delete — shown only when confirm is pending */}
                    {isPendingDelete && (
                      <button
                        onClick={cancelDelete}
                        style={{
                          background: 'rgba(100,116,139,0.1)',
                          border: '1px solid rgba(100,116,139,0.2)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          width: '32px', height: '32px',
                          borderRadius: '8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    )}

                    {/* Edit button — hidden during confirm */}
                    {!isPendingDelete && (
                      <button
                        onClick={() => setEditingItem(expense)}
                        style={{
                          background: 'rgba(59,130,246,0.1)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          color: 'var(--accent-blue)',
                          cursor: 'pointer',
                          width: '32px', height: '32px',
                          borderRadius: '8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                    )}

                    {/* Delete button — turns bright red when pending confirm */}
                    <button
                      onClick={() => handleDeleteClick(expense._id)}
                      style={{
                        background: isPendingDelete ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${isPendingDelete ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.2)'}`,
                        color: 'var(--accent-red)',
                        cursor: 'pointer',
                        width: '32px', height: '32px',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        transform: isPendingDelete ? 'scale(1.1)' : 'scale(1)',
                      }}
                      onMouseEnter={e => { if (!isPendingDelete) e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                      onMouseLeave={e => { if (!isPendingDelete) e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      title={isPendingDelete ? 'Click again to confirm delete' : 'Delete'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Export the ExpenseList component
export default ExpenseList;
