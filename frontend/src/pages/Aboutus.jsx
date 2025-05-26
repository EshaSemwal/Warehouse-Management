import React from 'react';
import { FaGithub, FaReact, FaNodeJs, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiMysql } from 'react-icons/si';
import { MdDesignServices } from 'react-icons/md';
import './aboutus.css';

// Import images directly
import satyamImage from '../components/Assets/satyam.png';
import bhumikaImage from '../components/Assets/bhumika.png';
import eshaImage from '../components/Assets/esha.png';
import pranavImage from '../components/Assets/pranav.png';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Satyam Singh Rawat",
      role: "Backend Developer",
      github: "https://github.com/satyamsiuu",
      linkedin: "https://www.linkedin.com/in/satyam-singh-rawat/",
      email: "mailto:rawatsatyam058@gmail.com",
      image: satyamImage
    },
    {
      name: "Bhumika Bahuguna",
      role: "Backend Developer",
      github: "https://github.com/BhumikaBahuguna",
      linkedin: "https://www.linkedin.com/in/bhumika-bahuguna-6b068a306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "mailto:bhumikabahuguna8@gmail.com",
      image: bhumikaImage
    },
    {
      name: "Esha Semwal",
      role: "Database Engineer",
      github: "https://github.com/EshaSemwal",
      linkedin: "https://www.linkedin.com/in/eshasemwal14",
      email: "mailto:eshasemwal14@gmail.com",
      image: eshaImage
    },
    {
      name: "Pranav Bansal",
      role: "Frontend Developer",
      github: "https://github.com/Prannav-Bansal",
      linkedin: "https://www.linkedin.com/in/prannnav/",
      email: "mailto:collabwithpranav@gmail.com",
      image: pranavImage
    }
  ];

  return (
    <div className="about-us-container">
      <header className="about-header">
        <h1>Our Development Team</h1>
        <p className="subtitle">The minds behind SmartWMS</p>
      </header>

      <section className="team-section">
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="card-image-container">
                <img src={member.image} alt={member.name} className="member-image" />
              </div>
              <div className="card-content">
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <div className="social-links">
                  <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <FaGithub className="social-icon" />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FaLinkedin className="social-icon" />
                  </a>
                  <a href={member.email} aria-label="Email">
                    <FaEnvelope className="social-icon" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="tech-stack">
        <h2>Core Technologies</h2>
        <div className="tech-icons">
          <div className="tech-item">
            <FaReact className="tech-icon" />
            <span>React</span>
          </div>
          <div className="tech-item">
            <SiMysql className="tech-icon" />
            <span>MySQL</span>
          </div>
          <div className="tech-item">
            <FaNodeJs className="tech-icon" />
            <span>Node.js</span>
          </div>
          <div className="tech-item">
            <MdDesignServices className="tech-icon" />
            <span>Algorithm Design</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;