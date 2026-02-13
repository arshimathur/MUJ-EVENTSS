import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { API } from "../config";

export default function ClubDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  async function fetchMyEvents() {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(`${API}/events/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    await fetch(`${API}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchMyEvents();
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Club Dashboard</h1>

      {events.length === 0 && <p>No events created yet.</p>}

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            background: "#fff",
            padding: 20,
            marginBottom: 20,
            borderRadius: 12,
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}
        >
          <h3>{event.title}</h3>
          <p>{event.location}</p>
          <p>
            {new Date(event.start_time).toLocaleString()}
          </p>

          <button
            onClick={() => deleteEvent(event.id)}
            style={{
              background: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Delete Event
          </button>
        </div>
      ))}
    </div>
  );
}
