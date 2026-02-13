import React from "react";

const categories = [
  { name: "Music & Entertainment", percent: 35, color: "#9d6cff" },
  { name: "Sports & Recreation", percent: 28, color: "#449cff" },
  { name: "Food & Dining", percent: 22, color: "#42d7a8" },
  { name: "Academic", percent: 15, color: "#ff924a" },
];

const monthly = [
  { month: "January", events: 42, color: "#faeefc" },
  { month: "February", events: 38, color: "#eaf5ff" },
  { month: "March", events: 47, color: "#edfaf4" },
];

export default function AnalyticsDashboard() {
  return (
    <div style={{ background: "#fafbff", minHeight: "100vh", padding: "48px 0" }}>
      <div style={{ fontWeight: 900, fontSize: 32, marginLeft: 50 }}>Analytics Dashboard</div>
      <div style={{ marginLeft: 50, color: "#5d5e74", fontSize: 17, marginBottom: 32 }}>
        Track event performance and student engagement metrics.
      </div>
      <div style={{ display: "flex", gap: 26, marginLeft: 50 }}>
        {/* Left - Categories */}
        <div style={{
          background: "#fff", borderRadius: 22, boxShadow: "0 2px 12px #f1f2fd",
          padding: "36px 38px", width: 440
        }}>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Event Categories</div>
          {categories.map(cat =>
            <div key={cat.name} style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
              <span style={{ width: "48%", fontWeight: 600 }}>{cat.name}</span>
              <span style={{
                display: "inline-block", background: "#f2f1fa", borderRadius: 20, width: 112, height: 11, overflow: "hidden", margin: "0 10px"
              }}>
                <span style={{
                  display: "inline-block", height: "100%", width: `${cat.percent}%`,
                  background: cat.color, borderRadius: 20
                }}></span>
              </span>
              <span style={{ fontWeight: 700, color: cat.color }}>{cat.percent}%</span>
            </div>
          )}
        </div>
        {/* Right - Metrics & Trends */}
        <div style={{ flex: 2 }}>
          <div style={{ display: "flex", gap: 22, marginBottom: 16 }}>
            <InfoCard title="Total Events" value="156" diff="+12% this month" icon="📊" color="#2980ff" />
            <InfoCard title="Avg Attendance" value="89%" diff="+5% this month" icon="👥" color="#23e0a3" />
            <InfoCard title="Active Students" value="342" diff="+8% this month" icon="🎓" color="#6c77ef" />
            <InfoCard title="Satisfaction" value="4.8" diff="+0.2 this month" icon="⭐" color="#ffd366" />
          </div>
          <div style={{
            marginTop: 18, background: "#fff", borderRadius: 18, padding: "28px 36px",
            boxShadow: "0 2px 12px #f1f2fd"
          }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Monthly Trends</div>
            {monthly.map(m =>
              <div key={m.month} style={{
                display: "flex", alignItems: "center", background: m.color, borderRadius: 10,
                margin: "12px 0", padding: "12px 20px", fontWeight: 600, fontSize: 16
              }}>
                <span style={{ width: 130 }}>{m.month}</span>
                <span style={{ marginLeft: 44, color: "#8859dd", fontWeight: 800 }}>{m.events} events</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, diff, icon, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px #f1f2fd", flex: 1, 
      padding: "22px 22px", minWidth: 164, textAlign: "center"
    }}>
      <div style={{ fontSize: 38, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 21 }}>{title}</div>
      <div style={{ fontWeight: 900, fontSize: 32, color: color, margin: "7px 0" }}>{value}</div>
      <div style={{ fontSize: 14, color: "#15bc7c", fontWeight: 700 }}>{diff}</div>
    </div>
  );
}
