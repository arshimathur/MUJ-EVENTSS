// src/components/Footer.jsx
import React from 'react';
import './Footer.css';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-slim">
      <div className="footer-slim-content">
        
        {/* Left */}
        <div className="footer-left">
          <span className="footer-brand">MUJ Events</span>
          <div className="footer-socials">
            <a href="https://www.instagram.com/jaipurmanipal?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/school/manipal-university-jaipur/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="mailto:contact@partycampus.in" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Center */}
        <div className="footer-center">
          &copy; {new Date().getFullYear()} Manipal University Jaipur
        </div>

        {/* Right */}
        <div className="footer-right">
          <Link to="#">Privacy</Link>
          <Link to="#">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
