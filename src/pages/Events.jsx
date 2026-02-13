// src/pages/Events.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Events.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API}/events`);

        if (!res.ok) {
          throw new Error(`Failed to load events (${res.status})`);
        }

        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr(e.message || "Could not load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading events…</div>;
  }

  if (err) {
    return (
      <div style={{ padding: 24, color: "#b00020" }}>
        ⚠️ {err}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div style={{ padding: 24, color: "#777" }}>
        No events yet.
      </div>
    );
  }

  return (
    <div className="events-container">
      <h2 className="events-title">All Events</h2>

      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
            )}

            <div className="event-content">
              <h3>{event.title}</h3>

              {event.start_time && (
                <p className="event-date">
                  {new Date(event.start_time).toLocaleString()}
                </p>
              )}

              {event.description && (
                <p className="event-desc">
                  {event.description}
                </p>
              )}

              {event.location && (
                <p className="event-location">
                  <strong>📍</strong> {event.location}
                </p>
              )}

              <span className="event-category">
                {event.category ||
                  (event.is_published ? "Published" : "Draft")}
              </span>

              {/* ✅ REGISTER BUTTON */}
              <Link to={`/register/${event.id}`}>
                <button className="participate-btn">
                  Participate Now
                </button>
              </Link>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
