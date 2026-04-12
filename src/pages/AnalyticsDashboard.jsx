import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { API } from "../config";

const emptyData = {
  summary: {
    total_events: 0,
    avg_attendance: 0,
    active_students: 0,
    fill_rate: 0,
    publish_rate: 0,
    total_registrations: 0
  },
  categories: [],
  monthly: []
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setErr("");

        const session = await supabase.auth.getSession();
        const token = session?.data?.session?.access_token;

        if (!token) {
          throw new Error("Please log in to view analytics.");
        }

        const res = await fetch(`${API}/dashboard/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const raw = await res.text();
        let json = null;

        try {
          json = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error(
            "Analytics API returned HTML instead of JSON. Restart the backend server and try again."
          );
        }

        if (!res.ok) {
          throw new Error(json?.error || "Failed to load analytics");
        }

        if (!isMounted) return;

        setData({
          summary: { ...emptyData.summary, ...(json.summary || {}) },
          categories: Array.isArray(json.categories) ? json.categories : [],
          monthly: Array.isArray(json.monthly) ? json.monthly : []
        });
      } catch (error) {
        console.error(error);
        if (!isMounted) return;
        setErr(error.message || "Failed to load analytics");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <PageState message="Loading analytics dashboard…" />;
  }

  if (err) {
    return <PageState message={err} isError />;
  }

  const { summary, categories, monthly } = data;

  return (
    <div style={{ background: "#fafbff", minHeight: "100vh", padding: "48px 0" }}>
      <div style={{ fontWeight: 900, fontSize: 32, marginLeft: 50 }}>Analytics Dashboard</div>
      <div style={{ marginLeft: 50, color: "#5d5e74", fontSize: 17, marginBottom: 32 }}>
        Track live event performance and student engagement metrics.
      </div>

      <div style={{ display: "flex", gap: 26, marginLeft: 50, marginRight: 50, flexWrap: "wrap" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            boxShadow: "0 2px 12px #f1f2fd",
            padding: "36px 38px",
            width: 440,
            flex: "1 1 340px"
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Event Categories</div>
          {categories.length === 0 ? (
            <div style={{ color: "#8b90a7" }}>No category data available yet.</div>
          ) : (
            categories.map((cat) => (
              <div key={cat.name} style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
                <span style={{ width: "48%", fontWeight: 600 }}>{cat.name}</span>
                <span
                  style={{
                    display: "inline-block",
                    background: "#f2f1fa",
                    borderRadius: 20,
                    width: 112,
                    height: 11,
                    overflow: "hidden",
                    margin: "0 10px"
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      height: "100%",
                      width: `${cat.percent}%`,
                      background: cat.color,
                      borderRadius: 20
                    }}
                  />
                </span>
                <span style={{ fontWeight: 700, color: cat.color }}>
                  {cat.percent}% ({cat.count})
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ flex: "2 1 520px" }}>
          <div style={{ display: "flex", gap: 22, marginBottom: 16, flexWrap: "wrap" }}>
            <InfoCard
              title="Total Events"
              value={summary.total_events}
              diff={`${summary.publish_rate}% published`}
              icon="📊"
              color="#2980ff"
            />
            <InfoCard
              title="Avg Attendance"
              value={summary.avg_attendance}
              diff={`${summary.total_registrations} registrations`}
              icon="👥"
              color="#23e0a3"
            />
            <InfoCard
              title="Active Students"
              value={summary.active_students}
              diff="Distinct registered users"
              icon="🎓"
              color="#6c77ef"
            />
            <InfoCard
              title="Capacity Filled"
              value={`${summary.fill_rate}%`}
              diff="Across all events"
              icon="⭐"
              color="#ffd366"
            />
          </div>

          <div
            style={{
              marginTop: 18,
              background: "#fff",
              borderRadius: 18,
              padding: "28px 36px",
              boxShadow: "0 2px 12px #f1f2fd"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Monthly Trends</div>
            {monthly.length === 0 ? (
              <div style={{ color: "#8b90a7" }}>No monthly trend data available yet.</div>
            ) : (
              monthly.map((month) => (
                <div
                  key={month.month}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: month.color,
                    borderRadius: 10,
                    margin: "12px 0",
                    padding: "12px 20px",
                    fontWeight: 600,
                    fontSize: 16
                  }}
                >
                  <span style={{ width: 130 }}>{month.month}</span>
                  <span style={{ color: "#8859dd", fontWeight: 800 }}>{month.events} events</span>
                  <span style={{ color: "#0f766e", fontWeight: 800 }}>
                    {month.registrations} registrations
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, diff, icon, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 12px #f1f2fd",
        flex: "1 1 180px",
        padding: "22px 22px",
        minWidth: 164,
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: 38, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 21 }}>{title}</div>
      <div style={{ fontWeight: 900, fontSize: 32, color, margin: "7px 0" }}>{value}</div>
      <div style={{ fontSize: 14, color: "#15bc7c", fontWeight: 700 }}>{diff}</div>
    </div>
  );
}

function PageState({ message, isError = false }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafbff",
        color: isError ? "#b00020" : "#1f2937",
        fontSize: "1.1rem",
        padding: "2rem",
        textAlign: "center"
      }}
    >
      {message}
    </div>
  );
}
