import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { API } from "../config";
import "./ClubDashboard.css"; // We'll link to a new CSS file

export default function ClubDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  async function fetchMyEvents() {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) return;

      const res = await fetch(`${API}/events/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    await fetch(`${API}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchMyEvents(); // Refresh after deletion
  }

  if (loading) return <div className="cd-loading">Loading Dashboard...</div>;

  return (
    <div className="cd-page">
      <div className="cd-hero-wrap">
        <div className="cd-hero">
          <div className="cd-hero-left">
            <h1 className="cd-hero-title">Club Dashboard</h1>
            <p className="cd-hero-sub">Manage your active events and club content.</p>
          </div>
          <div className="cd-hero-right">
            <Link to="/create-event" className="btn-primary">
              + Create Event
            </Link>
          </div>
        </div>
      </div>

      <div className="cd-grid">
        <section className="cd-main">
          <div className="cd-panel">
            <div className="cd-panel-header">
              <h3>My Hosted Events</h3>
            </div>

            <div className="cd-events">
              {events.length === 0 && (
                <div className="empty">You haven't created any events yet!</div>
              )}

              {events.map((event) => (
                <div className="cd-event-card" key={event.id}>
                  <div className="cd-event-info">
                    <h3>{event.title}</h3>
                    <p className="cd-meta">📍 {event.location} • 📅 {new Date(event.start_time).toLocaleString()}</p>
                  </div>
                  <div className="cd-event-actions">
                    <button
                      className="cd-btn-danger"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
