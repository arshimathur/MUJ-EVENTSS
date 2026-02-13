// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { API } from "../config";
import "./StudentDashboard.css";
import { Link } from "react-router-dom";


export default function StudentDashboard() {
  const [data, setData] = useState({
    kpis: { events_attended: 0, party_points: 0 },
    upcoming_events: [],
    my_bookings: [],
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
  
      try {
        const sessionResp = await supabase.auth.getSession();
        const token = sessionResp?.data?.session?.access_token;
  
        if (!token) {
          navigate(`/login?next=/student-dashboard`, { replace: true });
          return;
        }
  
        const res = await fetch(`${API}/dashboard/student`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("dashboard/student failed:", res.status, text);
          throw new Error("Failed to load dashboard");
        }
  
        const json = await res.json();
        console.log("Dashboard API response:", json);
  
        /**
         * 🔁 ADAPT BACKEND RESPONSE → UI SHAPE
         */
        const registrations = Array.isArray(json) ? json : [];
  
        setData({
          kpis: {
            events_attended: registrations.length,
            party_points: registrations.length * 10
          },
  
          // Upcoming events = registered events mapped
          upcoming_events: registrations.map(r => ({
            id: r.id,
            title: r.events?.title,
            location: r.events?.location,
            start_time: r.events?.start_time
          })),
  
          // Bookings derived from registrations
          my_bookings: registrations.map(r => ({
            id: r.id,
            qty: 1,
            status: "registered",
            created_at: r.created_at,
            events: r.events
          })),
  
          // Optional activity feed
          recent_activity: registrations.map(r => ({
            type: "registration",
            meta: { title: r.events?.title },
            created_at: r.created_at
          }))
        });
  
      } catch (e) {
        console.error(e);
        setErr(e.message || "Error loading dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);
  
  if (loading) return <div className="sd-loading">Loading student dashboard…</div>;
  if (err) return <div className="sd-error">{err}</div>;

  const { kpis, upcoming_events, my_bookings, recent_activity } = data;

  return (
    <div className="sd-page">
     
     <div className="sd-hero-wrap">
  <div className="sd-hero">
    <div className="sd-hero-left">
      <h1 className="sd-hero-title">Student Dashboard</h1>
      <p className="sd-hero-sub">Welcome back — here's an overview of your events & activity</p>
    </div>

    <div className="sd-hero-right">
      <nav className="view-toggle">
        <a className="toggle btn-ghost" href="/student-dashboard">👩‍🎓 Student View</a>
        <a className="toggle btn-primary" href="/dashboard">🧑‍🏫 Teacher View</a>
      </nav>
    </div>
  </div>
</div>
  <div>
    


  {/* right-side quick-toggle to match teacher page layout */}

</div>


      <div className="sd-kpis">
        <KpiCard title="Events Attended" value={kpis.events_attended} />
        <KpiCard title="Party Points" value={kpis.party_points} />
        <KpiCard title="Upcoming Events" value={upcoming_events.length} />
        <KpiCard title="My Bookings" value={my_bookings.length} />
      </div>

      <div className="sd-grid">
        <section className="sd-main">
          <div className="sd-panel">
            <div className="sd-panel-header">
              <h3>Upcoming Events</h3>
              <a className="sd-link" href="/events">View all</a>
            </div>
            <div className="sd-events">
              {upcoming_events.length === 0 && <div className="empty">No upcoming events</div>}
              {upcoming_events.map(ev => (
                <EventRow key={ev.id} ev={ev} />
              ))}
            </div>
          </div>

          <div className="sd-panel">
            <div className="sd-panel-header">
              <h3>My Bookings</h3>
              <a className="sd-link" href="/student-dashboard">Manage</a>
            </div>
            <div className="sd-bookings">
              {my_bookings.length === 0 && <div className="empty">You have no bookings</div>}
              {my_bookings.map(b => (
                <BookingRow key={b.id} b={b} />
              ))}
            </div>
          </div>
        </section>

        <aside className="sd-side">
          <div className="sd-card">
            <h4>Recent Activity</h4>
            <div className="sd-activity">
              {recent_activity.length === 0 && <div className="empty">No recent activity</div>}
              {recent_activity.map((a, i) => (
                <div key={i} className="act-row">
                  <div className="act-type">{a.type === 'booking' ? 'Booking' : 'Event'}</div>
                  <div className="act-meta">{a.meta?.title || `Event ${a.event_id || ''}`}</div>
                  <div className="act-time">{new Date(a.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="sd-card">
            <h4>Quick Actions</h4>
            <div className="sd-actions">
              <a className="btn" href="/create-event">Create Event</a>
              <a className="btn ghost" href="/leaderboard">Leaderboard</a>
              <a className="btn ghost" href="/profile">Profile</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* small components */
function KpiCard({ title, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

function EventRow({ ev }) {
  // Debug helper: if event has no id, show a console warning
  if (!ev?.id) {
    console.warn("Event missing id:", ev);
  }

  return (
    <div className="event-row">
      <div className="event-left">
        <div className="event-title">{ev.title}</div>
        <div className="event-meta">{ev.start_time ? new Date(ev.start_time).toLocaleString() : ''} • {ev.location}</div>
      </div>

      <div className="event-right">
        {ev?.id ? (
          <Link className="btn small" to={`/register/${ev.id}`}>
            Participate
          </Link>
        ) : (
          <button className="btn small disabled" disabled title="Event ID missing">
            Participate
          </button>
        )}
      </div>
    </div>
  );
}

function BookingRow({ b }) {
  return (
    <div className="booking-row">
      <div className="booking-left">
        <div className="booking-title">{b.events?.title || 'Event'}</div>
        <div className="booking-meta">Qty: {b.qty} • {b.status}</div>
      </div>
      <div className="booking-right">
        <span className="text-muted">{new Date(b.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
