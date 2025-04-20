import React, { useState } from "react";
import { FaCog } from 'react-icons/fa'; // Import the cog icon
import { 
  FaWarehouse,
  FaChartLine,
  FaBoxes,
  FaPlusSquare,
  FaSearch,
  FaBell,
  FaChartPie,
  FaSignInAlt,
  FaUserPlus,
  FaBars
} from "react-icons/fa";
import "./Navbar.css";


const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo on left */}
          <div className="navbar-logo">
            <FaWarehouse className="warehouse-icon" />
            <span>SmartWMS</span>
          </div>

          {/* Centered Navigation Links */}
          <div className="nav-center">
            <ul className="navbar-menu">
              <li className="nav-item">
                <a href="./dashboard" className="nav-link">
                  <FaChartLine className="nav-icon" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="./inventory" className="nav-link">
                  <FaBoxes className="nav-icon" />
                  <span>Inventory</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="./storage" className="nav-link">
                  <FaPlusSquare className="nav-icon" />
                  <span>Storage</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="./retrivel" className="nav-link">
                  <FaSearch className="nav-icon" />
                  <span>Retrieval</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="./alerts" className="nav-link">
                  <FaBell className="nav-icon" />
                  <span>Alerts</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="./analytics" className="nav-link">
                  <FaChartPie className="nav-icon" />
                  <span>Analytics</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="./settings" className="nav-link">
                  <FaCog className="nav-icon"  />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Auth Buttons on right */}
          <div className="auth-buttons">
            <button className="login-btn">
              <FaSignInAlt className="btn-icon" />
              <span>Login</span>
            </button>
            <button className="signup-btn">
              <FaUserPlus className="btn-icon" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <FaBars className="menu-icon" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <FaWarehouse className="mobile-menu-icon" />
          <h3>SmartWMS</h3>
        </div>
        <ul className="mobile-menu-items">
          <li>
            <a href="#dashboard" className="mobile-nav-link">
              <FaChartLine className="mobile-nav-icon" />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#inventory" className="mobile-nav-link">
              <FaBoxes className="mobile-nav-icon" />
              <span>Inventory</span>
            </a>
          </li>
          <li>
            <a href="#add-items" className="mobile-nav-link">
              <FaPlusSquare className="mobile-nav-icon" />
              <span>Storage</span>
            </a>
          </li>
          <li>
            <a href="#retrieval" className="mobile-nav-link">
              <FaSearch className="mobile-nav-icon" />
              <span>Retrieval</span>
            </a>
          </li>
          <li>
            <a href="#alerts" className="mobile-nav-link">
              <FaBell className="mobile-nav-icon" />
              <span>Alerts</span>
            </a>
          </li>
          <li>
            <a href="#analytics" className="mobile-nav-link">
              <FaChartPie className="mobile-nav-icon" />
              <span>Analytics</span>
            </a>
          </li>
          <div className="mobile-auth-buttons">
            <button className="mobile-login-btn">
              <FaSignInAlt className="mobile-btn-icon" />
              <span>Login</span>
            </button>
            <button className="mobile-signup-btn">
              <FaUserPlus className="mobile-btn-icon" />
              <span>Sign Up</span>
            </button>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Navbar;