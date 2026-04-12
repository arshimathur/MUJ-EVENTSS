import React, { useState, useEffect } from 'react';
import './Clubs.css';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadClubs() {
      try {
        setLoading(true);
        setError('');

        const { data, error: clubsError } = await supabase
          .from('clubs')
          .select('*')
          .order('created_at', { ascending: false });

        if (clubsError) {
          throw clubsError;
        }

        if (!isMounted) return;
        setClubs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        if (!isMounted) return;
        setClubs([]);
        setError('Failed to load clubs right now.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadClubs();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClubClick = (club) => {
    alert(
      `Club: ${club.name}\nEmail: ${club.contact_email || 'Not available'}\nDescription: ${club.description || 'No description available.'}`
    );
  };

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

      {loading && <p className="clubs-subtitle">Loading clubs...</p>}
      {error && <p className="clubs-subtitle">{error}</p>}

      <div className="clubs-grid">
        {!loading && !error && filteredClubs.length === 0 && (
          <div className="club-card">
            <h3>No clubs found</h3>
            <p className="club-description">Try a different filter or add clubs to the database.</p>
          </div>
        )}

        {filteredClubs.map((club, index) => (
          <div className="club-card" key={club.id || index} onClick={() => handleClubClick(club)}>
            <h3>{club.name}</h3>
            <p className="club-tags">{club.category || 'Club'}</p>
            <p className="club-description">{club.description}</p>
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
