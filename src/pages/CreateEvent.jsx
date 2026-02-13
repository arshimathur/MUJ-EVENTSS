import React, { useState } from "react";
import "./CreateEvent.css";
import { supabase } from "../supabaseClient";


export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    club: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log("Sending form:", form);  // ✅ ADD THIS LINE
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;
  
      if (!token) {
        alert("Please login first");
        return;
      }
  
      const res = await fetch("http://localhost:8080/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
      }
  
      alert("✅ Event submitted for review!");
  
    } catch (err) {
      console.error(err);
      alert("❌ Error creating event");
    }
  };
  
  return (
    <div className="ce-wrapper">
      <div className="ce-card">

        <h2>Create an Event</h2>
        <p className="ce-sub">
          Share your event with the MUJ community
        </p>

        <form onSubmit={handleSubmit}>

          {/* Event Name */}
          <label>Event Name *</label>
          <input
            name="title"
            placeholder="e.g., Annual Tech Summit 2024"
            value={form.title}
            onChange={handleChange}
          />

          {/* Description */}
          <label>Description *</label>
          <textarea
            name="description"
            placeholder="Tell us about your event..."
            value={form.description}
            onChange={handleChange}
          />

          {/* Category */}
          <label>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            <option>Technical</option>
            <option>Cultural</option>
            <option>Sports</option>
            <option>Social</option>
            <option>Other</option>
          </select>

          <div className="ce-divider"></div>

          {/* Date & Time Section */}
          <div className="ce-section-title">
            Date & Time
          </div>

          <div className="ce-row">
            <div>
              <label>Event Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Event Time *</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>Location *</label>
          <input
            name="location"
            placeholder="e.g., Main Auditorium, Campus"
            value={form.location}
            onChange={handleChange}
          />

          <div className="ce-divider"></div>

          {/* Organizer Block */}
          <div className="ce-section-title">
            Organizer Information
          </div>

          <label>Which Club? *</label>
          <select
            name="club"
            value={form.club}
            onChange={handleChange}
          >
            <option value="">Select a club</option>
            <option>IEEE</option>
            <option>ACM</option>
            <option>GDSC</option>
            <option>Cyberspace</option>
          </select>

          <div className="ce-row">
            <div>
              <label>Email *</label>
              <input
                name="email"
                placeholder="your.email@muj.manipal.edu"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Phone *</label>
              <input
                name="phone"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="ce-button">
            Create Event
          </button>

          <p className="ce-note">
            Your event will be reviewed before appearing on the platform
          </p>

        </form>
      </div>
    </div>
  );
}
