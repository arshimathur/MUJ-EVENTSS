import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { API } from "../config";
import "./StudentDashboard.css";

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        navigate("/login?next=/dashboard", { replace: true });
        return;
      }

      const res = await fetch(`${API}/dashboard/teacher`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Dashboard failed");
      }

      // ✅ SAFE DATA SHAPE
      setData({
        kpis: json.kpis || {
          active_events: 0,
          total_students: 0,
          attendance_pct: 0,
          pending_approvals: 0
        },
        event_list: json.event_list || [],
        notifications: json.notifications || []
      });

    } catch (e) {
      console.error(e);
      setErr("Failed to load teacher dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <div style={{ padding: 24 }}>Loading teacher dashboard…</div>;

  if (err)
    return <div style={{ padding: 24, color: "#b00020" }}>{err}</div>;

  if (!data)
    return <div style={{ padding: 24 }}>No dashboard data available</div>;

  const { kpis, event_list, notifications } = data;

  return (
    <div className="sd-page">

      {/* HERO */}
      <div className="sd-hero-wrap">
        <div className="sd-hero">
          <div className="sd-hero-left">
            <h1 className="sd-hero-title">Teacher Dashboard</h1>
            <p className="sd-hero-sub">
              Manage campus events and monitor student engagement.
            </p>
          </div>

          <div className="sd-hero-right">
            <nav className="view-toggle">
              <a className="toggle btn-ghost" href="/student-dashboard">
                👩‍🎓 Student View
              </a>
              <a className="toggle btn-primary" href="/dashboard">
                🧑‍🏫 Teacher View
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="sd-kpis" style={{ marginTop: 10 }}>
        <div className="kpi-card">
          <div className="kpi-title">Active Events</div>
          <div className="kpi-value">{kpis?.active_events || 0}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Total Students</div>
          <div className="kpi-value">{kpis?.total_students || 0}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Event Attendance</div>
          <div className="kpi-value">
            {kpis?.attendance_pct || 0}%
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Pending Approvals</div>
          <div className="kpi-value">{kpis?.pending_approvals || 0}</div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="sd-grid">

        {/* EVENTS */}
        <section className="sd-main">
          <div className="sd-panel">
            <div className="sd-panel-header">
              <h3>Event Management</h3>
              <a className="sd-link" href="/events">Manage events</a>
            </div>

            {event_list.length === 0 ? (
              <div className="empty">No events to show</div>
            ) : (
              event_list.map(ev => (
                <div className="event-row" key={ev.id}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{ev.title}</div>
                    <div style={{ color: "#666", marginTop: 6 }}>
                      Capacity: {ev.capacity || 0} • {ev.booked || 0} booked
                    </div>
                  </div>

                  <a className="btn small" href={`/events/${ev.id}`}>
                    Manage
                  </a>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="sd-side">

          <div className="sd-card">
            <h4>Recent Notifications</h4>

            {notifications.length === 0 ? (
              <div className="empty">No recent notifications</div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} style={{ padding: "8px 0" }}>
                  {n.message}
                </div>
              ))
            )}
          </div>

          <div className="sd-card">
            <h4>Admin Actions</h4>

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
