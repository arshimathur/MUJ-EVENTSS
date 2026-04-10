import React, { useState, useEffect } from "react";
import "./JaipurEvents.css";
import culturalfestImg from '../assets/images 2/culturalfest.jpg';
import musicfestImg from '../assets/images 2/musicfest.jpg';
import heritagewalkImg from '../assets/images 2/heritagewalk.jpg';
import lightsoundImg from '../assets/images 2/lightsound.jpg';
import handicraftsImg from '../assets/images 2/handicrafts.jpg';
import chokhidhaaniImg from '../assets/images 2/chokhidhaani.jpg';
import vintagerallyImg from '../assets/images 2/vintagerally.jpg';
import scienceexpoImg from '../assets/images 2/scienceexpo.jpg';
import foodfiestaImg from '../assets/images 2/foodfiesta.jpg';
import techfestImg from '../assets/images 2/techfest.jpg';
import startupImg from '../assets/images 2/startup.jpg';
import foodfestImg from '../assets/images 2/foodfest.jpg';

const JaipurEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Map backend titles to imported static images to preserve existing UI looks
          const mapping = {
            "Jaipur Literature Fest": culturalfestImg,
            "Jaipur Music Festival": musicfestImg,
            "Heritage Walk": heritagewalkImg,
            "Light & Sound Show": lightsoundImg,
            "Handicrafts Bazaar": handicraftsImg,
            "Cultural Evening": chokhidhaaniImg,
            "Vintage Car Rally": vintagerallyImg,
            "Science Expo": scienceexpoImg,
            "Food Fiesta": foodfiestaImg,
            "Tech Expo Jaipur": techfestImg,
            "Jaipur Startup Weekend": startupImg,
            "Rajasthani Food Fest": foodfestImg
          };
          const formatted = data.data.map(e => ({
            ...e,
            image: mapping[e.title] || e.image_url
          }));
          setEvents(formatted);
        }
      })
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  return (
    <div className="jaipur-events">
      {/* Banner Image */}
      <div className="banner-container">
        <img
          src="/images/banner/jaipur-banner.jpg"
          alt="Jaipur Banner"
          className="jaipur-banner"
        />
      </div>
  
      {/* Section Title */}
      <h2 className="section-title">Events in Jaipur</h2>
  
      {/* Event Cards */}
      <div className="event-card-container">
        {events.map((event, index) => (
          <div className="event-card" key={index}>
            <img src={event.image} alt={event.title} className="event-image" />
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p className="location">{event.location}</p>
            <button className="book-now-btn" onClick={() => window.open(event.external_url, "_blank")}>Book Now</button>
          </div>
        ))}
   
        {/* Map Section */}
{/* Map Section */}
<div className="map-container">
  <iframe
    title="Jaipur Map"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.492257145577!2d75.8069117753573!3d26.91309157667482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db304f6f1ed65%3A0x9dbbb3c7c33a5291!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
    width="100%"
    height="400"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>


      </div>
    </div>
  );
};

export default JaipurEvents;
