import React from 'react';
import { 
  FaBoxes, 
  FaRobot, 
  FaChartLine, 
  FaWarehouse,
  FaClock,
  FaExchangeAlt,
  FaTruck
} from 'react-icons/fa';
import './dashboard.css';
import warehouseImage from '../components/Assets/warehouse-hero.webp'; // Replace with your image path
import analyticsImage from '../components/Assets/Analytics.webp'; // Replace with your image path

const Dashboard = () => {
  // Sample metrics data
  const metrics = [
    { icon: <FaBoxes />, title: "Total Items", value: "12,458", change: "+3.2%" },
    { icon: <FaRobot />, title: "Automation Rate", value: "87%", change: "+5.1%" },
    { icon: <FaExchangeAlt />, title: "Daily Transactions", value: "1,247", change: "+12%" },
    { icon: <FaClock />, title: "Avg. Processing Time", value: "23 min", change: "-8%" }
  ];

  const features = [
    {
      icon: <FaBoxes className="feature-icon" />,
      title: "Smart Inventory",
      description: "Real-time tracking with AI-powered stock predictions"
    },
    {
      icon: <FaRobot className="feature-icon" />,
      title: "Automation",
      description: "Robotic systems handling 87% of warehouse operations"
    },
    {
      icon: <FaChartLine className="feature-icon" />,
      title: "Live Analytics",
      description: "Actionable insights with predictive analytics"
    },
    {
      icon: <FaTruck className="feature-icon" />,
      title: "Optimized Logistics",
      description: "AI-optimized routes reducing delivery times by 22%"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <img src={warehouseImage} alt="Modern Warehouse" className="hero-image" />
        <div className="hero-content">
          <h1>Next-Gen Warehouse Management</h1>
          <p>AI-powered inventory control with real-time automation analytics</p>
          <button className="cta-button">Explore Features</button>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="metrics-section">
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div className="metric-card" key={index}>
              <div className="metric-icon">{metric.icon}</div>
              <div className="metric-info">
                <h3>{metric.title}</h3>
                <div className="metric-value">
                  <span>{metric.value}</span>
                  <span className={`metric-change ${metric.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Core Warehouse Capabilities</h2>
          <p>Our platform delivers enterprise-grade warehouse automation</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="analytics-section">
        <div className="analytics-content">
          <div className="analytics-text">
            <h2>Real-Time Operational Intelligence</h2>
            <p>
              Our dashboard provides live visibility into every aspect of your warehouse operations, 
              with predictive analytics that help you stay ahead of demand fluctuations and 
              operational bottlenecks.
            </p>
            <ul className="analytics-list">
              <li>Live inventory tracking across all zones</li>
              <li>Automation performance monitoring</li>
              <li>Predictive restocking alerts</li>
              <li>Energy consumption analytics</li>
            </ul>
          </div>
          <div className="analytics-image">
            <img src={analyticsImage} alt="Analytics Dashboard" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <FaWarehouse className="cta-icon" />
          <h2>Ready to Transform Your Warehouse?</h2>
          <p>
            Join hundreds of enterprises leveraging our platform to achieve 
            99.9% inventory accuracy and 40% faster order fulfillment.
          </p>
          <div className="cta-buttons">
            <button className="primary-cta">Request Demo</button>
            <button className="secondary-cta">Contact Sales</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;