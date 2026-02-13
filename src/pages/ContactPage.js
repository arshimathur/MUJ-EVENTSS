// src/pages/Contact.js
import React from 'react';
import './Contact.css';
import mujCampus from '../assets/muj-campus.jpg'; // adjust path if needed

const Contact = () => {
  return (
    <div
      className="contact-container"
      style={{
        backgroundImage: `url(${mujCampus})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="overlay">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out for queries, feedback or collaboration.</p>

        <div className="contact-content">
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="text" placeholder="Subject" />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>

          <div className="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> info@partycampus.com</p>
            <p><strong>Phone:</strong> +91-9876543210</p>
            <p><strong>Address:</strong> Manipal University Jaipur, Rajasthan</p>
          </div>
        </div>

        <div className="map-container">
          <iframe
            title="Manipal University Jaipur Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.280603180328!2d75.56537301439638!3d26.843410983156376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9e5e94684fb%3A0x35067d1c370b51ea!2sManipal%20University%20Jaipur!5e0!3m2!1sen!2sin!4v1620112223331!5m2!1sen!2sin"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
