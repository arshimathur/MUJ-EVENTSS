// src/components/FeaturedEvents.jsx

import React from 'react';
import './FeaturedEvents.css';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

const events = [
  {
    title: 'Campus Music Festival',
    description: 'Join us for an amazing night of music performances by talented campus bands and artists.',
    date: 'September 25, 2025',
    icon: '🎵',
    buttonColor: '#ff4d8d',
  },
  {
    title: 'Hack X 2025',
    description: 'A 24-hour coding competition to solve real-world problems. Great prizes to be won!',
    date: 'October 17–18, 2025',
    icon: '💻',
    buttonColor: '#5e6bff',
  },
  {
    title: 'Dandiya Night ',
    description: 'Experience diverse cultural performances, traditional dances, and music from around the world.',
    date: 'September 30, 2025',
    icon: '🎭',
    buttonColor: '#ffa500',
  },
];

const FeaturedEvents = () => {
  return (
    <section className="featured-events">
      <h2 className="featured-title">Featured Events</h2>
      <div className="featured-event-cards">
        {events.map((event, index) => (
          <div className="featured-event-card" key={index}>
            <div className="featured-event-icon">{event.icon}</div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className="featured-event-date">
              <FaCalendarAlt className="calendar-icon" /> {event.date}
            </div>
<Link to={`/register/${encodeURIComponent(event.title)}`}>
  <button className="register-btn">Register Now</button>
</Link>

      
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedEvents;
