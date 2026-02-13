import React from "react";

const performers = [
  { name: "Sarah Chen", points: 2156, events: 22, color: "#c9b6ff", place: 2 },
  { name: "Alex Johnson", points: 2847, events: 28, color: "#ffe799", place: 1 },
  { name: "Mike Rodriguez", points: 1923, events: 19, color: "#ffdcdc", place: 3 }
];

const achievements = [
  { title: "Event Master", desc: "Attended 25+ events", color: "#fff6d7" },
  { title: "Party Starter", desc: "Created 5+ events", color: "#fce6f6" },
  { title: "Social Butterfly", desc: "50+ friends", color: "#eaf5ff" }
];

export default function Leaderboard() {
  return (
    <div style={{ background: "#fafbff", minHeight: "100vh", padding: "48px 0" }}>
      <div style={{ fontWeight: 900, fontSize: 32, marginLeft: 50 }}>Leaderboard</div>
      <div style={{ marginLeft: 50, color: "#5d5e74", fontSize: 17, marginBottom: 32 }}>
        See who's leading the campus in event participation and engagement!
      </div>
      <div style={{ display: "flex", gap: 36, marginLeft: 50 }}>
        {/* Left: Top Performers */}
        <div style={{
          background: "#fff", borderRadius: 22, boxShadow: "0 2px 12px #f1f2fd",
          padding: "36px 38px", width: 490
        }}>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 30 }}>🏆 Top Performers</div>
          <div style={{
            display: "flex", alignItems: "end", justifyContent: "center", marginBottom: 12
          }}>
            {/* Winner Podium */}
            {performers.map(p =>
              <div key={p.name} style={{
                width: 90, textAlign: "center"
              }}>
                <div style={{
                  width: 56, height: 56, margin: "0 auto", borderRadius: "50%", background: p.color,
                  fontSize: 33, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {p.place === 1 && <>🎓</>}
                  {p.place === 2 && <>🥈</>}
                  {p.place === 3 && <>🥉</>}
                </div>
                <div style={{
                  margin: "14px 0 2px", fontWeight: p.place === 1 ? 900 : 700, fontSize: 16
                }}>{p.name}</div>
                <div style={{ color: "#b18d5c", fontWeight: 700 }}>{p.points} pts</div>
              </div>
            )}
          </div>
          {/* Winner List */}
          {performers.map((p,i) =>
            <div key={p.name} style={{
              display: "flex", alignItems: "center", background: i === 0 ? "#fffde9" : i === 1 ? "#fbf9ff" : "#fff6f6",
              borderRadius: 13, padding: "8px 18px", marginTop: 7, fontWeight: 700
            }}>
              <span style={{ marginRight: 14, color: "#7b7d95" }}>{i+1}</span>
              <div style={{ flex: 2 }}>{p.name}{i===1?' (You)':null}<div style={{ fontWeight: 400, fontSize: 15, color: "#7b7d95" }}>{p.events} events attended</div></div>
              <div style={{ color: "#ff924a" }}>{p.points}</div>
              <span style={{ color: "#f6c46e", marginLeft: 14 }}>points</span>
            </div>
          )}
        </div>
        {/* Right: Your Stats / Achievements */}
        <div>
          <div style={{ background: "#fff", borderRadius: 18, padding: "22px 34px", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Your Stats</div>
            <StatRow label="Current Rank" value="#1" color="#ff7900" />
            <StatRow label="Total Points" value="2,847" />
            <StatRow label="Events Attended" value="28" />
            <StatRow label="Events Created" value="5" />
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: "22px 34px" }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Achievements</div>
            {achievements.map((ach) =>
              <div key={ach.title} style={{
                background: ach.color, borderRadius: 10, margin: "10px 0", padding: "8px 16px",
                fontWeight: 700, color: "#363556", fontSize: 16
              }}>
                <span style={{ marginRight: 14 }}>🏆</span>{ach.title}
                <span style={{ marginLeft: 16, fontWeight: 500, color: "#827f9b" }}>{ach.desc}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontWeight: 600, fontSize: 17 }}>
      <span>{label}</span>
      <span style={{ color: color || "#363556", fontWeight: 700, fontSize: 18 }}>{value}</span>
    </div>
  );
}
