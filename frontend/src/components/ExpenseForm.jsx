// Import React and necessary hooks
import React, { useState, useEffect } from 'react';
// Import icons from lucide-react for the form UI
import { PlusCircle, Save, XCircle, Tag, IndianRupee, Calendar, FileText, ChevronDown } from 'lucide-react';

// Categories with icons for the dropdown
const CATEGORIES = [
  { value: 'Food',          label: '🍔 Food' },
  { value: 'Transport',     label: '🚗 Transport' },
  { value: 'Shopping',      label: '🛍️ Shopping' },
  { value: 'Bills',         label: '📄 Bills' },
  { value: 'Entertainment', label: '🎬 Entertainment' },
  { value: 'Other',         label: '💼 Other' },
];

// ExpenseForm — used for both adding a new expense and editing an existing one
const ExpenseForm = ({ addExpense, editExpense, editingItem, setEditingItem }) => {
  // Local state for all form fields
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0], // Default to today
    note: ''
  });

  // When an 'editingItem' is provided, populate the form with its data
  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        amount: editingItem.amount,
        category: editingItem.category,
        date: editingItem.date.split('T')[0],
        note: editingItem.note || ''
      });
    }
  }, [editingItem]);

  // Generic input change handler
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission: create or update
  const onSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      editExpense(editingItem._id, formData); // Update existing expense
    } else {
      addExpense(formData); // Add new expense
    }
    // Reset form after submission
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
  };

  const isEditing = !!editingItem;

  return (
    <div className="card">
      {/* Section header */}
      <div className="section-title">
        <div className="title-dot" style={{ background: isEditing ? 'var(--accent-gold)' : 'var(--accent-green)' }} />
        {isEditing
          ? <><Save size={15} /> Edit Transaction</>
          : <><PlusCircle size={15} /> New Transaction</>
        }
      </div>

      <form onSubmit={onSubmit}>
        {/* Title */}
        <div>
          <label><Tag size={11} /> Description</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Grocery shopping"
            value={formData.title}
            onChange={onChange}
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label><IndianRupee size={11} /> Amount (₹)</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-65%)',
              color: 'var(--accent-green)', fontWeight: '700', fontSize: '1rem'
            }}>₹</span>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={onChange}
              required
              min="0"
              step="0.01"
              style={{ paddingLeft: '2rem' }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label><Tag size={11} /> Category</label>
          <div style={{ position: 'relative' }}>
            <select name="category" value={formData.category} onChange={onChange}>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-65%)',
              color: 'var(--text-muted)', pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Date */}
        <div>
          <label><Calendar size={11} /> Date</label>
          <input type="date" name="date" value={formData.date} onChange={onChange} required />
        </div>

        {/* Note (optional) */}
        <div>
          <label><FileText size={11} /> Note <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
          <textarea name="note" placeholder="Any additional details..." value={formData.note} onChange={onChange} />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.4rem' }}
        >
          {isEditing ? <><Save size={16} /> Update Transaction</> : <><PlusCircle size={16} /> Add Transaction</>}
        </button>

        {/* Cancel edit button — shown only in edit mode */}
        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '0.7rem' }}
            onClick={() => setEditingItem(null)}
          >
            <XCircle size={16} />
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

// Export the form component
export default ExpenseForm;
