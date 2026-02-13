import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:8080";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/events`);
        if (!res.ok) throw new Error("Failed to load events");
        setEvents(await res.json());
      } catch (e) {
        setErr(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={sx.loading}>Loading events…</div>;
  if (err) return <div style={sx.error}>⚠️ {err}</div>;
  if (!events.length) return <div style={sx.empty}>No events yet.</div>;

  return (
    <div style={sx.wrap}>
      {events.map((e) => (
        <div key={e.id} style={sx.card}>
          <div style={sx.row}>
            <Link to={`/events/${e.id}`} style={sx.titleLink}>
              <h3 style={sx.title}>{e.title}</h3>
            </Link>
            {e.is_published && <span style={sx.badge}>Published</span>}
          </div>

          {e.location && <div style={sx.meta}>📍 {e.location}</div>}
          <div style={sx.meta}>
            🗓 {new Date(e.start_time).toLocaleString()} — {new Date(e.end_time).toLocaleString()}
          </div>

          {e.description && <p style={sx.desc}>{e.description}</p>}

          <div style={{ marginTop: 10 }}>
            <Link to={`/participate/${e.id}`} style={sx.cta}>
              Participate Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

const sx = {
  wrap: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, padding: 16 },
  card: { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,.06)", border: "1px solid #eee" },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { margin: 0 },
  titleLink: { color: "inherit", textDecoration: "none" },
  badge: { background: "#e9e5ff", color: "#5a47d8", fontSize: 12, padding: "4px 8px", borderRadius: 999, fontWeight: 600 },
  meta: { color: "#555", marginTop: 6, fontSize: 14 },
  desc: { color: "#333", marginTop: 10, fontSize: 14 },
  loading: { padding: 24 },
  error: { padding: 24, color: "#b00020" },
  empty: { padding: 24, color: "#777" },
  cta: { display: "inline-block", background: "#6e59f0", color: "#fff", padding: "8px 12px", borderRadius: 8, textDecoration: "none" }
};
