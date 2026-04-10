// src/pages/JoinCommunity.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function JoinCommunity() {
  const location = useLocation();
  const clubId = location.state?.clubId;

  const handleVisitWebsite = async (e) => {
    e.preventDefault();
    if (!clubId) {
      alert("No club selected.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5001/clubs/${clubId}`);
      const data = await res.json();
      if (data.success && data.data) {
        // Fallback to MUJ central if specific website_url is null
        const website = data.data.website_url || "https://jaipur.manipal.edu/muj/life-at-muj/clubs.html";
        window.open(website, "_blank");
      } else {
        alert("Failed to load club data.");
      }
    } catch (error) {
      console.error(error);
      alert("Error reaching the backend API.");
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #6f51fe 0%, #1ecbe1 100%)'
      }}
    >
      <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 46, marginBottom: 14 }}>
        Join Our Community
      </h1>
      <p style={{ color: '#e7e9f7', fontSize: 18, marginBottom: 52, textAlign: 'center' }}>
        Choose how you'd like to be part of our amazing community.<br />
        Whether you want to enjoy club activities or help make them happen!
      </p>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1200 }}>
        {/* Member Card */}
        <div
          style={{
            background: '#fff', borderRadius: 22, padding: '38px 42px', width: 330, boxShadow: '0 6px 24px rgba(120,80,220,0.12)', textAlign: 'center'
          }}
        >
          <div style={{
            background: '#e4f4ff', borderRadius: '50%', width: 62, height: 62,
            margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span role="img" aria-label="members" style={{ fontSize: 31, color: '#27bc96' }}>👥</span>
          </div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Join as Member</h2>
          <p style={{ color: '#5a5c6c', marginBottom: 24, fontSize: 16 }}>
            Participate in events, workshops, and activities. Connect with like-minded people and enjoy all the benefits of membership.
          </p>
          <Link to="/club-member-join" state={{ clubId }} style={{ color: '#295cea', fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Get Started  &rarr;
          </Link>
        </div>
        {/* Team Card */}
        <div
          style={{
            background: '#fff', borderRadius: 22, padding: '38px 42px', width: 330, boxShadow: '0 6px 24px rgba(185,44,198,0.10)', textAlign: 'center'
          }}
        >
          <div style={{
            background: '#f4e2ff', borderRadius: '50%', width: 62, height: 62,
            margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span role="img" aria-label="team" style={{ fontSize: 31, color: '#a95be2' }}>🧪</span>
          </div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Join Working Team</h2>
          <p style={{ color: '#5a5c6c', marginBottom: 24, fontSize: 16 }}>
            Help organize events, lead initiatives, and shape the future of our community. Perfect for those who want to make a difference.
          </p>
          <Link to="/club-team-apply" state={{ clubId }} style={{ color: '#a93dda', fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Apply Now &rarr;
          </Link>
        </div>
        {/* Info Card */}
        <div
          style={{
            background: '#fff', borderRadius: 22, padding: '38px 42px', width: 330, boxShadow: '0 6px 24px rgba(235,110,40,0.12)', textAlign: 'center'
          }}
        >
          <div style={{
            background: '#ffeedc', borderRadius: '50%', width: 62, height: 62,
            margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span role="img" aria-label="info" style={{ fontSize: 31 }}>🌐</span>
          </div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Get to know the club</h2>
          <p style={{ color: '#5a5c6c', marginBottom: 24, fontSize: 16 }}>
            Explore the club's official website to see their latest projects, achievements, and upcoming events in detail.
          </p>
          <a href="#" onClick={handleVisitWebsite} style={{ color: '#eb6e28', fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Visit Website &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
