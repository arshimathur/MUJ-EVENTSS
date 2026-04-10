// src/components/ExploreSection.jsx
import { Link } from "react-router-dom";
import "./ExploreSection.css";

export default function ExploreSection() {
  return (
    <div className="explore-wrapper">
      <div className="explore-header">
        <h2 className="explore-title">Wanna Explore?</h2>
        <p className="explore-subtitle">Discover amazing opportunities and experiences</p>
      </div>

      <div className="explore-grid">

        {/* JAIPUR EVENTS */}
        <div className="explore-card card-jaipur">
          <div className="explore-icon">📍</div>
          <h3>View Jaipur Events</h3>
          <p>Discover exciting events happening across the pink city.</p>
          <Link to="/jaipur" className="explore-btn">
            Explore Jaipur
          </Link>
        </div>

        {/* CLUBS */}
        <div className="explore-card card-clubs">
          <div className="explore-icon">👥</div>
          <h3>View All Clubs</h3>
          <p>Browse all active clubs and student communities.</p>
          <Link to="/clubs" className="explore-btn">
            Explore Clubs
          </Link>
        </div>

        {/* ALL EVENTS */}
        <div className="explore-card card-events">
          <div className="explore-icon">📅</div>
          <h3>View All Events</h3>
          <p>Find and register for upcoming exclusive campus events.</p>
          <Link to="/events" className="explore-btn">
            Explore Events
          </Link>
        </div>

      </div>
    </div>
  );
}
