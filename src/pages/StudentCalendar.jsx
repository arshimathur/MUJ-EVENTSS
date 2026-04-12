import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { API } from "../config";
import "./StudentCalendar.css";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const toneCycle = ["lavender", "sky", "mint", "sun"];
const sourceLabelMap = {
  registration: "Registered",
  hosted: "Hosted",
  overview: "Overview"
};

export default function StudentCalendar() {
  const [role, setRole] = useState("student");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCalendar() {
      try {
        setLoading(true);
        setError("");

        const session = await supabase.auth.getSession();
        const token = session?.data?.session?.access_token;

        if (!token) {
          throw new Error("Please log in to view your calendar.");
        }

        const res = await fetch(`${API}/dashboard/calendar`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const raw = await res.text();
        let json = null;

        try {
          json = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error(
            "Calendar API returned HTML instead of JSON. Restart the backend server and try again."
          );
        }

        if (!res.ok) {
          throw new Error(json?.error || "Failed to load calendar");
        }

        if (!isMounted) return;

        const shapedEvents = (Array.isArray(json.events) ? json.events : []).map((event, index) => {
          const date = event.start_time ? new Date(event.start_time) : null;
          return {
            ...event,
            date,
            day: date && !Number.isNaN(date.getTime()) ? date.getDate() : null,
            tone: toneCycle[index % toneCycle.length],
            tag: sourceLabelMap[event.source] || "Event",
            icon: getEventIcon(event.title, event.location),
            timeLabel: formatEventTime(date),
            attendeeLabel: event.attendees || 0
          };
        });

        setRole(json.role || "student");
        setEvents(shapedEvents);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setEvents([]);
        setError(err.message || "Failed to load calendar");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCalendar();

    return () => {
      isMounted = false;
    };
  }, []);

  const monthDate = useMemo(() => {
    const datedEvents = events.filter((event) => event.date && !Number.isNaN(event.date.getTime()));
    return datedEvents.length > 0 ? datedEvents[0].date : new Date();
  }, [events]);

  const monthLabel = monthDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  const calendarDays = useMemo(() => buildCalendarDays(monthDate, events), [monthDate, events]);
  const nextEvent = events[0] || null;
  const monthEvents = calendarDays.filter((item) => !item.empty && item.event).length;
  const totalAttendees = events.reduce((sum, event) => sum + (Number(event.attendeeLabel) || 0), 0);
  const busiestWeek = findBusiestWeek(events);

  if (loading) {
    return <PageState message="Loading your calendar..." />;
  }

  if (error) {
    return <PageState message={error} isError />;
  }

  return (
    <div className="calendar-page">
      <div className="calendar-shell">
        <section className="calendar-hero">
          <div className="calendar-hero-copy">
            <span className="calendar-kicker">{capitalize(role)} Planner</span>
            <h1>My Calendar</h1>
            <p>
              Keep your upcoming {role === "student" ? "registrations" : "events"} in one bright,
              easy-to-scan schedule.
            </p>
          </div>

          <div className="calendar-hero-spotlight">
            <div className="calendar-spotlight-label">Next Up</div>
            {nextEvent ? (
              <div className={`calendar-mini-card tone-${nextEvent.tone}`}>
                <div className="calendar-mini-icon">{nextEvent.icon}</div>
                <div>
                  <div className="calendar-mini-title">{nextEvent.title}</div>
                  <div className="calendar-mini-meta">{nextEvent.timeLabel}</div>
                  <div className="calendar-mini-meta">{nextEvent.location || "Location TBA"}</div>
                </div>
              </div>
            ) : (
              <div className="calendar-empty-note">No upcoming events on your calendar yet.</div>
            )}
          </div>
        </section>

        <section className="calendar-stats">
          <StatCard
            label="Events This Month"
            value={monthEvents}
            detail={`Tracked for ${capitalize(role)} view`}
          />
          <StatCard
            label={role === "student" ? "Booked Seats" : "Total Attendance"}
            value={totalAttendees}
            detail="Based on current registration totals"
          />
          <StatCard
            label="Busy Week"
            value={busiestWeek}
            detail="The week with the most scheduled activity"
          />
        </section>

        <section className="calendar-layout">
          <div className="calendar-board">
            <div className="calendar-board-header">
              <div>
                <p className="calendar-board-label">Monthly View</p>
                <h2>{monthLabel}</h2>
              </div>
              <div className="calendar-chip-row">
                <span className="calendar-chip">{events.length} Saved Events</span>
                <span className="calendar-chip subtle">{capitalize(role)} schedule</span>
              </div>
            </div>

            <div className="calendar-weekdays">
              {weekdayLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((item) =>
                item.empty ? (
                  <div key={item.key} className="calendar-cell empty" />
                ) : (
                  <div
                    key={item.key}
                    className={`calendar-cell ${item.event ? `tone-${item.event.tone}` : ""}`}
                  >
                    <div className="calendar-day-number">{item.day}</div>
                    {item.event ? (
                      <div className="calendar-cell-event">
                        <span className="calendar-cell-icon">{item.event.icon}</span>
                        <span className="calendar-cell-tag">{item.event.tag}</span>
                        <strong>{item.event.title}</strong>
                        <small>{item.event.timeLabel}</small>
                      </div>
                    ) : (
                      <div className="calendar-cell-empty">Open day</div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <aside className="calendar-sidebar">
            <div className="calendar-panel">
              <div className="calendar-panel-heading">
                <h3>Upcoming Events</h3>
                <span>{events.length} plans</span>
              </div>

              <div className="calendar-event-list">
                {events.length === 0 ? (
                  <div className="calendar-empty-note light">No events found for this account yet.</div>
                ) : (
                  events.map((event) => (
                    <article key={`${event.id}-${event.timeLabel}`} className={`calendar-event-card tone-${event.tone}`}>
                      <div className="calendar-event-top">
                        <span className="calendar-event-icon">{event.icon}</span>
                        <span className="calendar-event-pill">{event.tag}</span>
                      </div>
                      <h4>{event.title}</h4>
                      <p>{event.timeLabel}</p>
                      <p>{event.location || "Location TBA"}</p>
                      <div className="calendar-event-footer">
                        <span>{event.attendeeLabel} attending</span>
                        <button type="button">View Plan</button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="calendar-panel dark">
              <div className="calendar-panel-heading">
                <h3>Energy Map</h3>
                <span>Weekly vibe</span>
              </div>

              <ul className="calendar-energy-list">
                {buildEnergyRows(events).map((row) => (
                  <li key={row.label}>
                    <span>{row.label}</span>
                    <div className="energy-bar"><i style={{ width: `${row.width}%` }} /></div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, detail }) {
  return (
    <article className="calendar-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function PageState({ message, isError = false }) {
  return (
    <div className="calendar-page">
      <div className="calendar-shell">
        <div className={`calendar-panel ${isError ? "" : ""}`} style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3 style={{ margin: 0 }}>{message}</h3>
        </div>
      </div>
    </div>
  );
}

function buildCalendarDays(monthDate, events) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let index = 0; index < 35; index += 1) {
    const dayNumber = index - firstDay + 1;

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push({ key: `blank-${index}`, empty: true });
      continue;
    }

    const event = events.find((item) => item.day === dayNumber);
    cells.push({
      key: `day-${dayNumber}`,
      day: dayNumber,
      event
    });
  }

  return cells;
}

function formatEventTime(date) {
  if (!date || Number.isNaN(date.getTime())) {
    return "Date TBA";
  }

  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getEventIcon(title = "", location = "") {
  const haystack = `${title} ${location}`.toLowerCase();

  if (haystack.includes("music") || haystack.includes("concert")) return "🎵";
  if (haystack.includes("sport") || haystack.includes("basketball")) return "🏀";
  if (haystack.includes("food") || haystack.includes("pizza")) return "🍕";
  if (haystack.includes("startup") || haystack.includes("tech")) return "🚀";
  return "📅";
}

function buildEnergyRows(events) {
  const dayCounts = events.reduce((acc, event) => {
    if (!event.date || Number.isNaN(event.date.getTime())) return acc;
    const label = event.date.toLocaleString("en-US", { weekday: "short" });
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const labels = ["Mon", "Wed", "Fri", "Sat"];
  const maxCount = Math.max(...labels.map((label) => dayCounts[label] || 0), 1);

  return labels.map((label) => ({
    label,
    width: Math.max(18, Math.round(((dayCounts[label] || 0) / maxCount) * 100))
  }));
}

function findBusiestWeek(events) {
  if (events.length === 0) return "None";

  const weeks = events.reduce((acc, event) => {
    if (!event.date || Number.isNaN(event.date.getTime())) return acc;
    const week = Math.ceil(event.date.getDate() / 7);
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  const [week] = Object.entries(weeks).sort((a, b) => b[1] - a[1])[0] || [];
  if (!week) return "None";
  return `${week}${getOrdinalSuffix(Number(week))}`;
}

function getOrdinalSuffix(value) {
  if (value % 10 === 1 && value % 100 !== 11) return "st";
  if (value % 10 === 2 && value % 100 !== 12) return "nd";
  if (value % 10 === 3 && value % 100 !== 13) return "rd";
  return "th";
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
