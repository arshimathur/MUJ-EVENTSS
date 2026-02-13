// src/components/EventCard.js
import './EventCard.css';

const EventCard = ({ title, date, location, image }) => {
  return (
    <div className="event-card">
      <img src={image} alt={title} className="event-img" />
      <div className="event-info">
        <h3>{title}</h3>
        <p className="event-date">{date}</p>
        <p className="event-location">{location}</p>
      </div>
    </div>
  );
};

export default EventCard;
