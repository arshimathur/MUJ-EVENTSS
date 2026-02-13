// src/components/Footer.jsx
import React from 'react';
import './Footer.css';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>MUJ Events </h3>
        <p>Bringing together all campus events at Manipal University Jaipur.</p>
        <div className="footer-icons">
          <a href="https://www.instagram.com/jaipurmanipal?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com/school/manipal-university-jaipur/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="mailto:contact@partycampus.in">
            <FaEnvelope />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PartyCampus. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
