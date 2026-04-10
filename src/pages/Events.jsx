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
    return <div className="events-container-wrapper loading-state">Loading events…</div>;
  }

  if (err) {
    return (
      <div className="events-container-wrapper error-state">
        ⚠️ {err}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="events-container-wrapper empty-state">
        No events yet. Stay tuned!
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-banner">
        <img src="/images/banner/all_events.png" alt="All Events Banner" />
      </div>
      
      <div className="events-header">
        <h2 className="events-title">All Events</h2>
        <div className="title-underline"></div>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            
            <div className="event-content">
              <h3>{event.title}</h3>

              {event.start_time && (
                <p className="event-date">
                  <span className="icon">📅</span> {new Date(event.start_time).toLocaleString()}
                </p>
              )}

              {event.location && (
                <p className="event-location">
                  <span className="icon">📍</span> {event.location}
                </p>
              )}

              {event.description && (
                <p className="event-desc">
                  {event.description}
                </p>
              )}

              <span className="event-category">
                {event.category ||
                  (event.is_published ? "Published" : "Draft")}
              </span>

              {/* ✅ REGISTER BUTTON */}
              <Link to={`/register/${event.id}`} className="participate-btn-link">
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
