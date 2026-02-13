import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaCalendarAlt, FaUserCircle, FaHome, FaCalendarCheck, FaUsers, FaCity, FaEnvelope } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { supabase } from "../supabaseClient";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Navbar.css';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [user, setUser] = useState(null);
  const calendarRef = useRef();

  // Demo calendar data (you can replace later)
  const eventData = [
    { date: new Date(2025, 6, 30), name: 'Dance Fiesta', location: 'Auditorium', time: '5:00 PM' },
    { date: new Date(2025, 7, 2),  name: 'Tech Symposium', location: 'Seminar Hall 2', time: '10:00 AM' },
    { date: new Date(2025, 7, 5),  name: 'Music Night',    location: 'Central Lawn',  time: '7:30 PM' },
  ];
  const eventDates = eventData.map(e => e.date);

  const toggleCalendar = () => setCalendarOpen(v => !v);
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const handleDateSelect = (date) => setSelectedDate(date);
  const eventsToday = eventData.filter(
    (e) => e.date.toDateString() === selectedDate?.toDateString()
  );

  // 🔐 watch auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">MUJ events </div>

        {/* Right icon cluster */}
        <div className="navbar-center">
          {/* Profile: icon when logged out, avatar when logged in */}
          {user ? (
            <div className="profile-avatar" title={user.email}>
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          ) : (
            <Link to="/login" title="Login / Signup" className="profile-icon">
              <FaUserCircle size={26} style={{ color: "#6e59f0" }} />
            </Link>
          )}

          <Link to="/dashboard" title="Dashboard" className="dashboard-icon">
            <MdDashboard size={24} style={{ color: "#6e59f0" }} />
          </Link>

          <div className="calendar-container">
            <button className="calendar-button" onClick={toggleCalendar}>
              <FaCalendarAlt size={22} />
            </button>
            {calendarOpen && (
              <div className="datepicker-wrapper" ref={calendarRef}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelect}
                  inline
                  highlightDates={eventDates}
                />
                {selectedDate && (
                  <div className="event-info">
                    <h4>Events on {selectedDate.toDateString()}</h4>
                    {eventsToday.length ? (
                      <ul>
                        {eventsToday.map((event, i) => (
                          <li key={i}>
                            <strong>{event.name}</strong><br />
                            📍 {event.location}<br />
                            ⏰ {event.time}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="no-events">No events on this day.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="menu-btn" onClick={openSidebar} aria-label="Open menu">
            <FaBars />
          </button>
        </div>
      </nav>

      <div
        className={`backdrop ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      />

      <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`} aria-hidden={!sidebarOpen}>
        <button className="close-btn" onClick={closeSidebar} aria-label="Close menu">✕</button>
        <ul>
          <li>
            <Link to="/" onClick={closeSidebar}>
              <FaHome style={{ marginRight: '9px', marginBottom: '-3px' }} /> Home
            </Link>
          </li>
          <li>
            <Link to="/events" onClick={closeSidebar}>
              <FaCalendarCheck style={{ marginRight: '9px', marginBottom: '-3px' }} /> Events
            </Link>
          </li>
          <li>
            <Link to="/clubs" onClick={closeSidebar}>
              <FaUsers style={{ marginRight: '9px', marginBottom: '-3px' }} /> Clubs
            </Link>
          </li>
          <li>
            <Link to="/jaipur" onClick={closeSidebar}>
              <FaCity style={{ marginRight: '9px', marginBottom: '-3px' }} /> Jaipur
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeSidebar}>
              <FaEnvelope style={{ marginRight: '9px', marginBottom: '-3px' }} /> Contact
            </Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={closeSidebar}>
              <MdDashboard style={{ marginRight: '9px', marginBottom: '-3px' }} /> Dashboard
            </Link>
          </li>

          {/* 🔐 Logout only when logged in */}
          {user && (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          )}
        </ul>
      </aside>
    </>
  );
};

export default Navbar;
