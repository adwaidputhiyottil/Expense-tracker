// Import React library
import React, { useContext } from 'react';
// Import Chart.js modules for data visualization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
// Import Bar and Doughnut chart components
import { Bar, Doughnut } from 'react-chartjs-2';
// Import icons from lucide-react
import { TrendingUp, Wallet, Tag, Calendar, ArrowDownRight } from 'lucide-react';
// Import AuthContext to show the user's name
import { AuthContext } from '../context/AuthContext';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Category color map matching CSS variables
const CATEGORY_COLORS = {
  Food:          '#f59e0b',
  Transport:     '#3b82f6',
  Shopping:      '#ec4899',
  Bills:         '#ef4444',
  Entertainment: '#8b5cf6',
  Other:         '#64748b',
};

// Category icon map
const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️',
  Bills: '📄', Entertainment: '🎬', Other: '💼',
};

// Dashboard component: shows KPI cards and charts for the logged-in user's expenses
const Dashboard = ({ expenses }) => {
  // Get current user from auth context
  const { user } = useContext(AuthContext);

  // === Compute KPI values ===
  // Total spending across all expenses
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Current month's spending
  const now = new Date();
  const thisMonthSpend = expenses
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // Find top spending category
  const categoryData = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0];

  // === Chart Configurations ===

  // Bar chart — spending by category
  const barData = {
    labels: Object.keys(categoryData),
    datasets: [{
      label: 'Spending (₹)',
      data: Object.values(categoryData),
      backgroundColor: Object.keys(categoryData).map(c => CATEGORY_COLORS[c] || '#64748b'),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString()}`
        }
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (val) => `₹${val.toLocaleString()}`
        },
        beginAtZero: true,
      },
    },
  };

  // Doughnut chart — distribution by category
  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: Object.keys(categoryData).map(c => CATEGORY_COLORS[c] || '#64748b'),
      hoverOffset: 6,
      borderWidth: 2,
      borderColor: '#111827',
    }],
  };

  const doughnutOptions = {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 14,
          font: { size: 12 },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const pct = ((ctx.parsed / totalSpend) * 100).toFixed(1);
            return ` ₹${ctx.parsed.toLocaleString()} (${pct}%)`;
          }
        }
      },
    },
  };

  return (
    <div>
      {/* Welcome header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
          Welcome back, <span style={{ color: 'var(--accent-green)' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.3rem' }}>
          Here's your financial summary — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">

        {/* Total Spend */}
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <Wallet size={20} color="var(--accent-red)" />
          </div>
          <div className="kpi-label">Total Spent</div>
          <div className="kpi-value">₹{totalSpend.toLocaleString()}</div>
          <div className="kpi-sub">{expenses.length} transactions</div>
        </div>

        {/* This Month */}
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Calendar size={20} color="var(--accent-blue)" />
          </div>
          <div className="kpi-label">This Month</div>
          <div className="kpi-value">₹{thisMonthSpend.toLocaleString()}</div>
          <div className="kpi-sub">{now.toLocaleString('en-IN', { month: 'long' })}</div>
        </div>

        {/* Top Category */}
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(245,166,35,0.1)' }}>
            <Tag size={20} color="var(--accent-gold)" />
          </div>
          <div className="kpi-label">Top Category</div>
          <div className="kpi-value" style={{ fontSize: '1.2rem' }}>
            {topCategory ? `${CATEGORY_ICONS[topCategory[0]]} ${topCategory[0]}` : '—'}
          </div>
          <div className="kpi-sub">{topCategory ? `₹${topCategory[1].toLocaleString()}` : 'No data'}</div>
        </div>

      </div>

      {/* Charts */}
      {expenses.length > 0 ? (
        <div className="grid">
          {/* Bar chart */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="section-title">
              <div className="title-dot" />
              <TrendingUp size={15} />
              Spending by Category
            </div>
            <div className="chart-wrapper">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Doughnut chart */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="section-title">
              <div className="title-dot" style={{ background: 'var(--accent-blue)' }} />
              <ArrowDownRight size={15} />
              Expense Distribution
            </div>
            <div className="chart-wrapper">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>📊</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Add your first expense to see your analytics here.
          </p>
        </div>
      )}
    </div>
  );
};

// Export the Dashboard component
export default Dashboard;
