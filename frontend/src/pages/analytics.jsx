import React, { useState } from 'react';
import { 
  FaClock, 
  FaCheckCircle, 
  FaTruck, 
  FaBoxes,
  FaChartLine,
  FaCalendarAlt
} from 'react-icons/fa';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import './analytics.css';

const Analytics = () => {
  // Time filter state
  const [timeRange, setTimeRange] = useState('week');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customRange, setCustomRange] = useState({
    start: '',
    end: ''
  });

  // Sample data - in a real app, this would come from an API
  const inventoryData = [
    { name: 'Jan', value: 4200 },
    { name: 'Feb', value: 3800 },
    { name: 'Mar', value: 4100 },
    { name: 'Apr', value: 3900 },
    { name: 'May', value: 4300 },
    { name: 'Jun', value: 4500 },
  ];

  const retrievalSpeedData = [
    { name: 'Mon', time: 12.5 },
    { name: 'Tue', time: 10.2 },
    { name: 'Wed', time: 8.7 },
    { name: 'Thu', time: 9.4 },
    { name: 'Fri', time: 11.1 },
    { name: 'Sat', time: 7.8 },
    { name: 'Sun', time: 14.2 },
  ];

  const stockOutData = [
    { name: 'Electronics', value: 12 },
    { name: 'Mechanical', value: 8 },
    { name: 'Packaging', value: 5 },
    { name: 'Raw Materials', value: 15 },
  ];

  const utilizationData = [
    { hour: '6AM', value: 35 },
    { hour: '9AM', value: 68 },
    { hour: '12PM', value: 82 },
    { hour: '3PM', value: 74 },
    { hour: '6PM', value: 55 },
    { hour: '9PM', value: 40 },
  ];

  // KPI data
  const kpis = [
    { id: 1, title: 'Avg. Retrieval Time', value: '9.2 min', icon: <FaClock />, trend: 'down' },
    { id: 2, title: 'Accuracy Rate', value: '98.7%', icon: <FaCheckCircle />, trend: 'up' },
    { id: 3, title: 'Fulfilled Orders', value: '1,248', icon: <FaTruck />, trend: 'up' },
    { id: 4, title: 'Inventory Turns', value: '4.2x', icon: <FaBoxes />, trend: 'stable' },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1><FaChartLine /> Warehouse Analytics</h1>
        <p>Performance metrics and operational insights</p>
      </header>

      {/* Filters */}
      <div className="filters-section">
        <div className="time-filters">
          <button 
            className={timeRange === 'day' ? 'active' : ''}
            onClick={() => setTimeRange('day')}
          >
            Today
          </button>
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
          <button 
            className='custom-range'
            onClick={() => setShowCustomRange(!showCustomRange)}
          >
            <FaCalendarAlt /> Custom Range
          </button>
        </div>

        {showCustomRange && (
          <div className="custom-range-picker">
            <div className="date-input">
              <label>From:</label>
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
              />
            </div>
            <div className="date-input">
              <label>To:</label>
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
              />
            </div>
            <button className="apply-btn">
              Apply
            </button>
          </div>
        )}
      </div>

      {/* KPI Widgets */}
      <div className="kpi-grid">
        {kpis.map(kpi => (
          <div className="kpi-card" key={kpi.id}>
            <div className="kpi-icon">
              {kpi.icon}
              {kpi.trend === 'up' && <span className="trend up">↑</span>}
              {kpi.trend === 'down' && <span className="trend down">↓</span>}
              {kpi.trend === 'stable' && <span className="trend stable">→</span>}
            </div>
            <div className="kpi-content">
              <h3>{kpi.title}</h3>
              <p className="kpi-value">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Inventory Over Time */}
        <div className="chart-card">
          <h3>Inventory Levels Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4a6bff" 
                  fill="#e6f0ff" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retrieval Speed */}
        <div className="chart-card">
          <h3>Average Retrieval Speed (Minutes)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={retrievalSpeedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#ff6b4a" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock-outs by Category */}
        <div className="chart-card">
          <h3>Stock-outs by Category</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockOutData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stockOutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilization Over Time */}
        <div className="chart-card">
          <h3>Warehouse Utilization by Hour (%)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill="#00C49F" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;