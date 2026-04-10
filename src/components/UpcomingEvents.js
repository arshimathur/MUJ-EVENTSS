import "./UpcomingEvents.css";
import { Link } from "react-router-dom";

const UpcomingEvents = () => {
  return (
    <div className="upcoming-container">
      <div className="video-overlay"></div>
      <video autoPlay loop muted playsInline className="hero-video">
        <source
          src="https://res.cloudinary.com/drcxko8nl/video/upload/v1771023138/upcoming_wl51x1.mp4"
          type="video/mp4"
        />
      </video>

      <div className="overlay-text glass-panel">
        <h1 className="hero-title">Welcome To <span className="text-glow">MUJ Events</span></h1>
        <p className="hero-subtitle">Don't miss out on the college festivals and parties!</p>
        <div className="hero-buttons">
            <Link to="/events" className="btn-primary">Explore Events</Link>
            <Link to="/clubs" className="btn-secondary">Join Clubs</Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
