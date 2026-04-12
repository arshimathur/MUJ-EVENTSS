import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Events.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";
const toneCycle = ["rose", "sky", "amber", "mint"];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API}/events`);

        if (!res.ok) {
          throw new Error(`Failed to load events (${res.status})`);
        }

        const data = await res.json();
        const shapedEvents = (Array.isArray(data) ? data : []).map((event, index) => ({
          ...event,
          tone: toneCycle[index % toneCycle.length]
        }));
        setEvents(shapedEvents);
      } catch (e) {
        console.error(e);
        setErr(e.message || "Could not load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filterOptions = useMemo(() => {
    const categories = Array.from(
      new Set(events.map((event) => event.category).filter(Boolean))
    );
    return ["All", ...categories];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesFilter = filter === "All" || event.category === filter;
      const haystack = `${event.title} ${event.location || ""} ${event.description || ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [events, filter, search]);

  const nextEvent = filteredEvents[0] || events[0] || null;

  if (loading) {
    return <div className="events-container-wrapper loading-state">Loading events…</div>;
  }

  if (err) {
    return (
      <div className="events-container-wrapper error-state">
        ⚠️ {err}
      </div>
    );
  }

  return (
    <div className="events-shell">
      <section className="events-hero no-banner">
        <div className="events-hero-copy">
          <span className="events-kicker">Campus Pulse</span>
          <h1>All Events</h1>
          <p>
            Discover what is happening across campus, from spotlight festivals to small
            community meetups and last-minute plans worth showing up for.
          </p>

          <div className="events-toolbar">
            <input
              className="events-search"
              type="text"
              placeholder="Search by title, location, or vibe"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <div className="events-filter-row">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`events-filter-chip ${filter === option ? "active" : ""}`}
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="events-hero-card standalone">
          <span>Spotlight</span>
          <strong>{nextEvent?.title || "No featured event yet"}</strong>
          <p>{nextEvent ? formatDate(nextEvent.start_time) : "Fresh events will appear here."}</p>
        </div>
      </section>

      <section className="events-insights">
        <InsightCard label="Visible Events" value={filteredEvents.length} />
        <InsightCard label="Published Right Now" value={events.filter((event) => event.is_published).length} />
        <InsightCard label="Categories" value={Math.max(filterOptions.length - 1, 0)} />
      </section>

      {!filteredEvents.length ? (
        <div className="events-empty-panel">
          <h3>No events match this view</h3>
          <p>Try a different search term or switch back to the full event list.</p>
        </div>
      ) : (
        <section className="events-grid">
          {filteredEvents.map((event) => (
            <article className={`event-card tone-${event.tone}`} key={event.id}>
              <div className="event-card-top">
                <span className="event-category">
                  {event.category || (event.is_published ? "Published" : "Draft")}
                </span>
                <span className="event-availability">
                  {event.is_published ? "Open" : "Upcoming"}
                </span>
              </div>

              <div className="event-content">
                <h3>{event.title}</h3>

                {event.start_time && (
                  <p className="event-date">
                    <span className="icon">🗓</span> {formatDate(event.start_time)}
                  </p>
                )}

                {event.location && (
                  <p className="event-location">
                    <span className="icon">📍</span> {event.location}
                  </p>
                )}

                {event.description && (
                  <p className="event-desc">
                    {event.description}
                  </p>
                )}

                <div className="event-footer">
                  <Link to={`/events/${event.id}`} className="event-secondary-link">
                    View details
                  </Link>

                  <Link to={`/register/${event.id}`} className="participate-btn-link">
                    <button className="participate-btn">
                      Participate Now
                    </button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

function InsightCard({ label, value }) {
  return (
    <article className="events-insight-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
