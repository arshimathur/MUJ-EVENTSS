import React, { useState, useEffect } from 'react';
import './Clubs.css';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const Clubs = () => {
  const [clubs, setClubs] = useState([]); // 👈 DYNAMIC STATE
  const [filter, setFilter] = useState('All');

  // 👈 1. FETCH CLUBS (MAIN PAGE)
  useEffect(() => {
    fetch('http://localhost:5001/clubs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setClubs(data.data);
      })
      .catch(err => console.error("Error fetching clubs:", err));
  }, []);

  // 👈 2. CLUB CLICK FUNCTIONALITY
  const handleClubClick = async (clubId) => {
    try {
      const res = await fetch(`http://localhost:5001/clubs/${clubId}`);
      const data = await res.json();
      if (data.success) {
        // Minimal existing UI approach: Alert the details dynamically
        alert(`Club: ${data.data.name}\nEmail: ${data.data.contact_email}\nDescription: ${data.data.description}`);
      }
    } catch (err) {
      alert("API Error fetching details.");
    }
  };

  // handleJoin moved to ClubMemberJoin.jsx

  const filteredClubs =
    filter === 'All' ? clubs : clubs.filter((club) => club.category === filter);

  return (
    <div className="clubs-page">
      {/* ✅ Banner */}
      <div className="clubs-banner">
        <img src="/images/banner/clubs-banner.jpg" alt="Clubs Banner" />
      </div>

      {/* ✅ Heading and Subheading */}
      <h2 className="clubs-title">MUJ Clubs</h2>
      <p className="clubs-subtitle">
        Explore the various student clubs at Manipal University Jaipur!
      </p>

      {/* ✅ Filter Buttons */}
      <div className="filter-buttons">
        <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>
          All Clubs
        </button>
        <button
          className={filter === 'Technical' ? 'active' : ''}
          onClick={() => setFilter('Technical')}
        >
          Technical Clubs
        </button>
        <button
          className={filter === 'Non-Technical' ? 'active' : ''}
          onClick={() => setFilter('Non-Technical')}
        >
          Non-Technical Clubs
        </button>
      </div>

      {/* ✅ Clubs Grid */}
      <div className="clubs-grid">
        {filteredClubs.map((club, index) => (
          <div className="club-card" key={club.id || index} onClick={() => handleClubClick(club.id)}>
            <h3>{club.name}</h3>
            {/* Fallback to category if tags are missing on backend */}
            <p className="club-tags">{club.category}</p>
            <p className="club-description">{club.description}</p>
            {/* Restored <Link> wrapping to navigate to the options page */}
            <Link to="/join-community" state={{ clubId: club.id }} onClick={e => e.stopPropagation()}>
              <button className="club-join-btn">
                Join Club Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clubs;