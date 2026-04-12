import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { API } from "../config";
import "./StudentDashboard.css";

export default function ClubDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadClubDashboard() {
      try {
        setLoading(true);
        setErr("");

        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        if (!token) {
          navigate("/login?next=/club-dashboard", { replace: true });
          return;
        }

        const [summaryRes, eventsRes] = await Promise.all([
          fetch(`${API}/dashboard/teacher`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API}/events/my`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const summaryJson = await summaryRes.json();
        const eventsJson = await eventsRes.json();

        if (!summaryRes.ok) {
          throw new Error(summaryJson.error || "Failed to load club dashboard");
        }

        if (!eventsRes.ok) {
          throw new Error(eventsJson.error || "Failed to load your hosted events");
        }

        const eventDetails = Array.isArray(eventsJson) ? eventsJson : [];
        const detailMap = new Map(eventDetails.map((event) => [event.id, event]));
        const teacherEvents = Array.isArray(summaryJson.event_list) ? summaryJson.event_list : [];

        const mergedEvents = teacherEvents.map((event) => {
          const detail = detailMap.get(event.id) || {};
          return {
            ...detail,
            ...event,
            location: detail.location || "TBA",
            start_time: detail.start_time || null
          };
        });

        if (!isMounted) return;

        setData({
          kpis: summaryJson.kpis || {
            active_events: 0,
            total_students: 0,
            attendance_pct: 0,
            pending_approvals: 0
          },
          event_list: mergedEvents,
          notifications: Array.isArray(summaryJson.notifications)
            ? summaryJson.notifications
            : [],
          hosted_count: eventDetails.length
        });
      } catch (error) {
        console.error(error);
        if (!isMounted) return;
        setErr(error.message || "Failed to load club dashboard");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadClubDashboard();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return <div className="sd-loading">Loading club dashboard…</div>;
  }

  if (err) {
    return <div className="sd-error">{err}</div>;
  }

  if (!data) {
    return <div className="sd-error">No club dashboard data available.</div>;
  }

  const { kpis, event_list, notifications, hosted_count } = data;

  return (
    <div className="sd-page">
      <div className="sd-hero-wrap">
        <div className="sd-hero">
          <div className="sd-hero-left">
            <h1 className="sd-hero-title">Club Dashboard</h1>
            <p className="sd-hero-sub">
              Manage hosted events, track registrations, and handle club operations.
            </p>
          </div>

          <div className="sd-hero-right">
            <nav className="view-toggle">
              <a className="toggle btn-ghost" href="/teacher-dashboard">
                Teacher View
              </a>
              <a className="toggle btn-ghost" href="/analytics">
                Analytics
              </a>
              <a className="toggle btn-primary" href="/club-dashboard">
                Club View
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="sd-kpis">
        <KpiCard title="Hosted Events" value={hosted_count} />
        <KpiCard title="Active Events" value={kpis.active_events || 0} />
        <KpiCard title="Total Students" value={kpis.total_students || 0} />
        <KpiCard title="Attendance" value={`${kpis.attendance_pct || 0}%`} />
      </div>

      <div className="sd-grid">
        <section className="sd-main">
          <div className="sd-panel">
            <div className="sd-panel-header">
              <h3>Event Management</h3>
              <a className="sd-link" href="/events">
                View all events
              </a>
            </div>

            {event_list.length === 0 ? (
              <div className="empty">No hosted events yet</div>
            ) : (
              event_list.map((event) => (
                <div className="event-row" key={event.id}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{event.title}</div>
                    <div style={{ color: "#64748b", marginTop: 6 }}>
                      {formatDate(event.start_time)} • {event.location}
                    </div>
                    <div style={{ color: "#666", marginTop: 6 }}>
                      Capacity: {event.capacity || 0} • {event.booked || 0} booked
                    </div>
                  </div>

                  <a className="btn small" href={`/events/${event.id}`}>
                    Manage
                  </a>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="sd-side">
          <div className="sd-card">
            <h4>Recent Notifications</h4>

            {notifications.length === 0 ? (
              <div className="empty">No recent notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} style={{ padding: "8px 0" }}>
                  {notification.message}
                </div>
              ))
            )}
          </div>

          <div className="sd-card">
            <h4>Club Actions</h4>

            <div className="sd-actions">
              <a className="btn" href="/create-event">
                Create Event
              </a>
              <a className="btn ghost" href="/manage-students">
                Manage Students
              </a>
              <a className="btn ghost" href="/analytics">
                View Analytics
              </a>
              <a className="btn ghost" href="/settings">
                Settings
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Date TBA";
  return new Date(value).toLocaleString();
}
