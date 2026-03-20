import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ExpenseAnalysis from './components/ExpenseAnalysis';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './index.css';

// Define the API URL for expenses
const API_URL = 'http://localhost:5001/api/expenses';

const MainApp = () => {
  // Access global auth state and user information
  const { user, loading: authLoading } = useContext(AuthContext);
  
  // Local state for expenses and app status
  const [expenses, setExpenses] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');

  // Fetch expenses whenever the authenticated user changes
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  // Function to retrieve user-specific expenses from the backend
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setLoading(false);
    }
  };

  // Function to create a new expense
  const addExpense = async (expense) => {
    try {
      const res = await axios.post(API_URL, expense);
      setExpenses([res.data.data, ...expenses]);
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  // Function to update an existing expense record
  const editExpense = async (id, updatedExpense) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedExpense);
      setExpenses(expenses.map(exp => exp._id === id ? res.data.data : exp));
      setEditingItem(null);
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  };

  // Function to remove an expense from the database
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  // Show a finance-themed loading screen while authentication status is being verified
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading your dashboard...</p>
      </div>
    );
  }

  // If no user is logged in, show the Login/Register page
  if (!user) {
    return <Login />;
  }

  // If logged in, show the full Expense Tracker Dashboard
  return (
    <div>
      <Navbar view={view} setView={setView} />
      <div className="container">
        {view === 'dashboard' && (
          <>
            {/* Visual analytics of spending */}
            <Dashboard expenses={expenses} />
            
            {/* Component for adding/editing and the list of previous expenses */}
            <div className="grid">
              <ExpenseForm 
                addExpense={addExpense} 
                editExpense={editExpense}
                editingItem={editingItem} 
                setEditingItem={setEditingItem}
              />
              <ExpenseList 
                expenses={expenses} 
                deleteExpense={deleteExpense} 
                setEditingItem={setEditingItem}
              />
            </div>
          </>
        )}

        {view === 'analysis' && <ExpenseAnalysis />}
        
        {view === 'admin' && user.role === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
};

// Root component wrapped in the AuthProvider to provide context to all children
function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
