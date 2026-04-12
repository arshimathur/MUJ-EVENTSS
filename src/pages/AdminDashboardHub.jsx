import React from "react";
import "./StudentDashboard.css";

const dashboards = [
  {
    title: "Teacher Dashboard",
    description: "See event performance, student participation, and admin actions.",
    href: "/teacher-dashboard",
    cta: "Open Teacher View"
  },
  {
    title: "Club Dashboard",
    description: "Manage hosted events with the same operational tools as the teacher view.",
    href: "/club-dashboard",
    cta: "Open Club View"
  },
  {
    title: "Student Dashboard",
    description: "Review the student-facing experience, bookings, and activity feed.",
    href: "/student-dashboard",
    cta: "Open Student View"
  },
  {
    title: "Analytics Dashboard",
    description: "Track trends, category mix, and overall engagement metrics.",
    href: "/analytics",
    cta: "Open Analytics"
  }
];

export default function AdminDashboardHub() {
  return (
    <div className="sd-page">
      <div className="sd-hero-wrap">
        <div className="sd-hero">
          <div className="sd-hero-left">
            <h1 className="sd-hero-title">Admin Dashboard Hub</h1>
            <p className="sd-hero-sub">
              Jump between every dashboard view and manage the platform from one place.
            </p>
          </div>
        </div>
      </div>

      <div className="sd-kpis">
        <div className="kpi-card">
          <div className="kpi-title">Available Views</div>
          <div className="kpi-value">4</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Primary Role</div>
          <div className="kpi-value">Admin</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem"
        }}
      >
        {dashboards.map((dashboard) => (
          <div key={dashboard.title} className="sd-card" style={{ marginBottom: 0 }}>
            <h4>{dashboard.title}</h4>
            <p style={{ color: "#64748b", lineHeight: 1.6 }}>{dashboard.description}</p>
            <a className="btn" href={dashboard.href} style={{ marginTop: "1rem", display: "inline-block" }}>
              {dashboard.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
