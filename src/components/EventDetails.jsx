import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../config/api";

export default function EventDetails() {
  const { id } = useParams();
  const [evt, setEvt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        setEvt(await res.json());
      } catch (e) {
        setErr(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (err) return <div style={{ padding: 24, color: "#b00020" }}>⚠️ {err}</div>;
  if (!evt) return null;

  const remaining = evt.availability?.remaining ?? null;

  return (
    <div style={{ padding: 24 }}>
      <h2>{evt.title}</h2>
      <p>📍 {evt.location || "—"}</p>
      <p>
        🗓 {new Date(evt.start_time).toLocaleString()} — {new Date(evt.end_time).toLocaleString()}
      </p>
      {typeof remaining === "number" && (
        <p>🎟 Seats remaining: <b>{remaining}</b> {evt.capacity ? `(of ${evt.capacity})` : ""}</p>
      )}
      {evt.description && <p style={{ marginTop: 12 }}>{evt.description}</p>}

      <Link to={`/participate/${evt.id}`} style={btn}>Participate Now</Link>
      <div style={{ marginTop: 12 }}>
        <Link to="/events">← Back to events</Link>
      </div>
    </div>
  );
}

const btn = {
  display: "inline-block",
  background: "#6e59f0",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 8,
  textDecoration: "none"
};
