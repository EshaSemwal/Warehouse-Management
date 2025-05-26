import React from 'react';
import { 
  FaWarehouse, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <FaWarehouse className="logo-icon" />
            <span>SmartWMS</span>
          </div>
          <p className="footer-description">
            Next-generation warehouse management system powered by AI and automation.
            Streamline your operations with our intelligent solutions.
          </p>
          <div className="social-links">
            <a 
              href="https://www.facebook.com/smartwms" 
              className="social-link"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('https://www.facebook.com/smartwms');
              }}
            >
              <FaFacebook />
            </a>
            <a 
              href="https://twitter.com/smartwms" 
              className="social-link"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('https://twitter.com/smartwms');
              }}
            >
              <FaTwitter />
            </a>
            <a 
              href="https://www.linkedin.com/company/smartwms" 
              className="social-link"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('https://www.linkedin.com/company/smartwms');
              }}
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://www.instagram.com/smartwms" 
              className="social-link"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('https://www.instagram.com/smartwms');
              }}
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/inventory">Inventory</a></li>
            <li><a href="/storage">Storage</a></li>
            <li><a href="/analytics">Analytics</a></li>
            <li><a href="/settings">Settings</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <FaPhone className="contact-icon" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>support@smartwms.com</span>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>Clement Town , Dehradun</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for updates and insights.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 SmartWMS. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="frontend\src\pages\Aboutus.jsx">Meet Developers </a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 