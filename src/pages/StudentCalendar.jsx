import React from "react";

const events = [
  { day: 8, label: "Music", color: "#ede5fd", icon: "🎵", date: "Music", desc: "Spring Music Festival", datetime: "Tomorrow, 7:00 PM", location: "Main Quad" },
  { day: 15, label: "Pizza", color: "#ebf3ff", icon: "🍕", date: "Pizza", desc: "Pizza Night", datetime: "Friday, 6:30 PM", location: "Student Center" },
  { day: 16, label: "Sports", color: "#eaffe7", icon: "🏀", date: "Sports", desc: "Basketball Tournament", datetime: "Saturday, 2:00 PM", location: "Sports Complex" }
];
const month = "March 2024";

export default function StudentCalendar() {
  return (
    <div style={{ background: "#f9fafd", minHeight: "100vh", padding: "44px 0" }}>
      <div style={{ fontWeight: 900, fontSize: 32, marginLeft: 50 }}>Student My Calendar</div>
      <div style={{ marginLeft: 50, color: "#5d5e74", fontSize: 17, marginBottom: 18 }}>
        Keep track of all your events and activities in one place.
      </div>
      <div style={{ display: "flex", gap: 36, marginLeft: 50 }}>
        {/* Calendar Grid */}
        <div style={{
          background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px #f1f2fd", width: 470,
          padding: "32px 34px", fontSize: 18
        }}>
          <div style={{ fontWeight: 800, fontSize: 21, marginBottom: 10 }}>{month}</div>
          <CalendarMonth events={events} />
        </div>
        {/* Upcoming Events */}
        <div style={{
          background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px #f1f2fd", width: 330,
          padding: "32px 34px", fontSize: 17
        }}>
          <div style={{ fontWeight: 700, fontSize: 21, marginBottom: 13 }}>Upcoming Events</div>
          {events.map(ev =>
            <div key={ev.desc} style={{
              background: ev.color, borderRadius: 10, margin: "15px 0", padding: "12px 14px"
            }}>
              <div style={{ fontWeight: 700, marginBottom: 3 }}>{ev.desc}</div>
              <div style={{ fontSize: 15, marginBottom: 2 }}>{ev.datetime}</div>
              <div style={{ color: "#7758ea", fontSize: 15 }}>{ev.location}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarMonth({ events }) {
  // Only draws the "special" days for brevity!
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return (
    <div>
      <div style={{ display: "flex", color: "#888", fontWeight: 700, marginBottom: 9, marginTop: 3 }}>
        {days.map(day => <div key={day} style={{ flex: 1, textAlign: "center" }}>{day}</div>)}
      </div>
      {/* Display only one row for simplicity */}
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1 }}></div>
        <EventDay day={8} label="Music" color="#ede5fd" icon="🎵" />
        <EventDay day={15} label="Pizza" color="#ebf3ff" icon="🍕" />
        <EventDay day={16} label="Sports" color="#eaffe7" icon="🏀" />
      </div>
    </div>
  );
}
function EventDay({ day, label, color, icon }) {
  return (
    <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
      <div style={{
        background: color, borderRadius: 11, minWidth: 58, minHeight: 48, 
        margin: "0 auto", fontWeight: 700, color: "#7369b5", marginBottom: 2
      }}>
        <span style={{ fontSize: 15, marginRight: 5 }}>{day}</span>
        <span style={{ fontSize: 24, marginRight: 3 }}>{icon}</span>
        <span style={{ fontWeight: 400, fontSize: 15 }}>{label}</span>
      </div>
    </div>
  );
}
