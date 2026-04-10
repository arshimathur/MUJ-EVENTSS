// src/pages/ClubTeamApply.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ClubTeamApply() {
  const [form, setForm] = useState({
    first: "", last: "", email: "", phone: "", reg: "",
    role: "", residence: "", resume: null, experience: "", motivation: ""
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setForm(prev => ({ ...prev, email: user.email }));
      }
    });
  }, []);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm(prev => ({ ...prev, resume: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const clubId = location.state?.clubId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clubId) {
      alert("Missing Club ID! Please select a club from the Clubs page.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Error: You must be logged in to apply for the working team!");
      return;
    }

    try {
      const { resume, ...formData } = form; // Strip out the File object so it doesn't break JSON
      
      const res = await fetch(`http://localhost:5001/clubs/${clubId}/join`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Team application sent successfully!");
        navigate('/clubs'); // Redirect back to clubs board
      } else {
        alert(data.message || "You have already joined or request is pending.");
      }
    } catch (err) {
      alert("API Error submitting application.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg,#6f51fe 0,#1ecbe1 100%)",
      padding: "60px 20px",
      boxSizing: "border-box"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        width: "100%",
        maxWidth: 480,
        borderRadius: 20,
        padding: "36px 32px",
        boxShadow: "0 8px 38px rgba(54,42,139,.16)",
        boxSizing: "border-box"
      }}>
        <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 14 }}>Join Working Team</div>
        <div style={{ display: "flex", gap: 12 }}>
          <input name="first" required placeholder="First Name" style={fld} onChange={handleChange} />
          <input name="last" required placeholder="Last Name" style={fld} onChange={handleChange} />
        </div>
        <input name="email" value={form.email} required placeholder="Email Address" style={fld} onChange={handleChange} />
        <input name="phone" required placeholder="Phone Number" style={fld} onChange={handleChange} />
        <input name="reg" required placeholder="Enter your registration number" style={fld} onChange={handleChange} />
        <div style={{ marginTop: 14, fontWeight: 500 }}>Preferred Role</div>
        <select name="role" required style={fld} onChange={handleChange}>
          <option value="">Select a role...</option>
          <option>Lead</option>
          <option>Coordinator</option>
          <option>Designer</option>
          <option>Developer</option>
        </select>
        <div style={{ marginTop: 10, fontWeight: 500 }}>Residence Type</div>
        <div style={{ marginBottom: 10 }}>
          <label>
            <input type="radio" name="residence" value=" Hostel" onChange={handleChange} required /> GHS
          </label>
          <label style={{ marginLeft: 24 }}>
            <input type="radio" name="residence" value="Day Scholar" onChange={handleChange} /> Day Scholar
          </label>
        </div>
        <div style={{ marginTop: 10, fontWeight: 500 }}>Upload Resume</div>
        <input name="resume" type="file" accept=".pdf,.doc,.docx" style={fld} onChange={handleChange} />
        <div style={{ marginTop: 10, fontWeight: 500 }}>Relevant Experience</div>
        <textarea name="experience" placeholder="Tell us about your experience and skills..." style={{ ...fld, minHeight: 50 }} onChange={handleChange} />
        <div style={{ marginTop: 10, fontWeight: 500 }}>Why do you want to join the working team?</div>
        <textarea name="motivation" required placeholder="Share your motivation and goals..." style={{ ...fld, minHeight: 50 }} onChange={handleChange} />
        <button type="submit" style={{
          marginTop: 18,
          width: "100%",
          padding: "13px 8px",
          background: "linear-gradient(90deg,#aa56e6 0,#fa53b0 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          border: "none",
          borderRadius: 8,
          cursor: "pointer"
        }}>Submit Application</button>
      </form>
    </div>
  );
}

const fld = {
  width: "100%", margin: "12px 0 0", padding: "11px 13px", borderRadius: 8, border: "1px solid #ececf7", fontSize: 16, boxSizing: "border-box"
};
