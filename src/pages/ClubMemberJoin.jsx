// src/pages/ClubMemberJoin.jsx
import React, { useState } from 'react';

export default function ClubMemberJoin() {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    reg: "",
    interests: [],
    motivation: ""
  });

  const handleInput = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(prev =>
        checked
          ? { ...prev, interests: [...prev.interests, value] }
          : { ...prev, interests: prev.interests.filter(v => v !== value) }
      );
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg,#6f51fe 0,#1ecbe1 100%)"
    }}>
      <form style={{
        background: "#fff",
        width: 480,
        borderRadius: 20,
        padding: "36px 32px",
        boxShadow: "0 8px 38px rgba(54,42,139,.16)"
      }}>
        <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 14 }}>Join as Club Member</div>
        <div style={{ display: "flex", gap: 12 }}>
          <input name="first" required placeholder="First Name" style={fld} onChange={handleInput} />
          <input name="last" required placeholder="Last Name" style={fld} onChange={handleInput} />
        </div>
        <input name="email" required placeholder="Email Address" style={fld} onChange={handleInput} />
        <input name="phone" required placeholder="Phone Number" style={fld} onChange={handleInput} />
        <input name="reg" required placeholder="Enter your registration number" style={fld} onChange={handleInput} />
        <div style={{ margin: "14px 0 6px", fontWeight: 600 }}>Interests</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
          {["Sports & Fitness", "Technology", "Arts & Culture", "Social Events"].map(label =>
            <label key={label} style={{ fontWeight: 500 }}>
              <input type="checkbox" name="interests" value={label} onChange={handleInput} style={{ marginRight: 8 }} />
              {label}
            </label>
          )}
        </div>
        <div>
          <div style={{ margin: "14px 0 6px", fontWeight: 600 }}>Why do you want to join?</div>
          <textarea name="motivation" required style={{ ...fld, minHeight: 54 }} placeholder="Tell us about your motivation..." onChange={handleInput} />
        </div>
        <button type="submit" style={{
          marginTop: 20,
          width: "100%",
          padding: "13px 8px",
          background: "linear-gradient(90deg,#1ecbe1 0,#37e18d 100%)",
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
  width: "100%", margin: "12px 0 0", padding: "11px 13px", borderRadius: 8, border: "1px solid #ececf7", fontSize: 16
};
