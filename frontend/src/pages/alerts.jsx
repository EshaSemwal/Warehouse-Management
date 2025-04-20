import React, { useState } from 'react';
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaBoxOpen, 
  FaClock, 
  FaCheckCircle,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import './alerts.css';

const Alerts = () => {
  // Sample alert data
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'low-stock',
      title: 'Low Stock Alert',
      item: 'Bearing Assembly (SKU: BRG-2024)',
      message: 'Only 3 units remaining (min. threshold: 5)',
      priority: 'critical',
      timestamp: '2023-06-15 14:30',
      resolved: false
    },
    {
      id: 2,
      type: 'overload',
      title: 'Shelf Overload Warning',
      item: 'Section A-12 (Capacity: 50kg)',
      message: 'Current load: 58kg (116% capacity)',
      priority: 'warning',
      timestamp: '2023-06-15 13:45',
      resolved: false
    },
    {
      id: 3,
      type: 'delay',
      title: 'Retrieval Delay',
      item: 'Order #ORD-7842',
      message: 'Robot navigation delay in Zone 3',
      priority: 'warning',
      timestamp: '2023-06-15 11:20',
      resolved: false
    },
    {
      id: 4,
      type: 'resolved',
      title: 'Restock Completed',
      item: 'Hydraulic Seals (SKU: HS-456)',
      message: 'Quantity updated from 2 to 25 units',
      priority: 'info',
      timestamp: '2023-06-14 16:10',
      resolved: true
    }
  ]);

  // Unread alerts count
  const unreadCount = alerts.filter(alert => !alert.resolved).length;

  // Action handlers
  const handleResolve = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const handleRestock = (id) => {
    // In a real app, this would trigger a restock process
    alert(`Restock initiated for alert #${id}`);
    handleResolve(id);
  };

  return (
    <div className="alerts-container">
      {/* Header with notification bell */}
      <header className="alerts-header">
        <h1>
          <FaBell className="bell-icon" />
          Alerts & Notifications
          {unreadCount > 0 && (
            <span className="badge">{unreadCount}</span>
          )}
        </h1>
        <p>Critical system notifications requiring attention</p>
      </header>

      {/* Alert summary cards */}
      <div className="alert-summary">
        <div className="summary-card critical">
          <FaExclamationTriangle />
          <h3>Critical</h3>
          <p>{alerts.filter(a => a.priority === 'critical' && !a.resolved).length}</p>
        </div>
        <div className="summary-card warning">
          <FaExclamationTriangle />
          <h3>Warnings</h3>
          <p>{alerts.filter(a => a.priority === 'warning' && !a.resolved).length}</p>
        </div>
        <div className="summary-card resolved">
          <FaCheckCircle />
          <h3>Resolved</h3>
          <p>{alerts.filter(a => a.resolved).length}</p>
        </div>
      </div>

      {/* Main alerts list */}
      <div className="alerts-list">
        <div className="list-header">
          <h2>Active Notifications</h2>
          <div className="sort-controls">
            <span>Sort by:</span>
            <button>Priority <FaArrowDown /></button>
            <button>Time <FaArrowUp /></button>
          </div>
        </div>

        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`alert-card ${alert.priority} ${alert.resolved ? 'resolved' : ''}`}
          >
            <div className="alert-icon">
              {alert.type === 'low-stock' && <FaBoxOpen />}
              {alert.type === 'overload' && <FaExclamationTriangle />}
              {alert.type === 'delay' && <FaClock />}
              {alert.type === 'resolved' && <FaCheckCircle />}
            </div>
            
            <div className="alert-content">
              <h3>{alert.title}</h3>
              <p className="alert-item">{alert.item}</p>
              <p className="alert-message">{alert.message}</p>
              <p className="alert-time">{alert.timestamp}</p>
            </div>

            <div className="alert-actions">
              {!alert.resolved && (
                <>
                  {alert.type === 'low-stock' && (
                    <button 
                      className="action-btn restock"
                      onClick={() => handleRestock(alert.id)}
                    >
                      Restock
                    </button>
                  )}
                  <button 
                    className="action-btn acknowledge"
                    onClick={() => handleResolve(alert.id)}
                  >
                    Acknowledge
                  </button>
                </>
              )}
              <button className="action-btn details">
                View Details <FaChevronRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;