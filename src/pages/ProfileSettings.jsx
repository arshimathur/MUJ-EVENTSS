import React, { useState } from "react";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@campus.edu",
    bio: "Computer Science student who loves organizing campus events and meeting new people!",
    major: "Computer Science",
    year: "Junior",
    notifNew: true,
    notifRem: true,
    notifDigest: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ ...profile, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div style={{ background: "#f9fafd", minHeight: "100vh", padding: "44px 0" }}>
      <div style={{ display: "flex", maxWidth: 1000, margin: "0 auto" }}>
        {/* Settings Menu */}
        <div style={{
          width: 250, background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px #ececfd",
          padding: "22px 0", marginRight: 30, height: "fit-content"
        }}>
          <div style={{ fontWeight: 800, fontSize: 22, padding: "0 38px 30px" }}>Settings Menu</div>
          <MenuItem selected>Profile Settings</MenuItem>
          <MenuItem>Notifications</MenuItem>
          <MenuItem>Privacy</MenuItem>
          <MenuItem>System Settings</MenuItem>
        </div>
        {/* Profile Setting Form */}
        <div style={{
          background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px #ececfd",
          padding: "42px 44px", flex: 1
        }}>
          <div style={{ fontWeight: 800, fontSize: 25, marginBottom: 18 }}>Profile Settings</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={labelStyle}>First Name</div>
              <input style={inputStyle} name="firstName" value={profile.firstName} onChange={handleChange} />
            </div>
            <div>
              <div style={labelStyle}>Last Name</div>
              <input style={inputStyle} name="lastName" value={profile.lastName} onChange={handleChange} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Email</div>
            <input style={inputStyle} name="email" value={profile.email} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Bio</div>
            <textarea style={{ ...inputStyle, minHeight: 52 }} name="bio" value={profile.bio} onChange={handleChange} />
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
            <div>
              <div style={labelStyle}>Major</div>
              <select style={inputStyle} name="major" value={profile.major} onChange={handleChange}>
                <option>Computer Science</option>
                <option>Business</option>
                <option>Engineering</option>
                <option>Art & Design</option>
              </select>
            </div>
            <div>
              <div style={labelStyle}>Year</div>
              <select style={inputStyle} name="year" value={profile.year} onChange={handleChange}>
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
              </select>
            </div>
          </div>
          {/* Notification Preferences */}
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Notification Preferences</div>
          <label style={tickLabel}>
            <input type="checkbox" name="notifNew" checked={profile.notifNew} onChange={handleChange} /> Email notifications for new events
          </label>
          <label style={tickLabel}>
            <input type="checkbox" name="notifRem" checked={profile.notifRem} onChange={handleChange} /> Push notifications for event reminders
          </label>
          <label style={tickLabel}>
            <input type="checkbox" name="notifDigest" checked={profile.notifDigest} onChange={handleChange} /> Weekly digest emails
          </label>
          {/* Save Button */}
          <div style={{ marginTop: 24 }}>
            <button style={{
              background: "linear-gradient(90deg,#965df7,#71e5e5)", color: "#fff",
              fontWeight: 700, fontSize: 16, padding: "11px 32px", border: "none", borderRadius: 9, cursor: "pointer"
            }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function MenuItem({ children, selected }) {
  return (
    <div style={{
      padding: "13px 38px",
      fontWeight: selected ? 700 : 500,
      color: selected ? "#754bef" : "#48537e",
      fontSize: 17,
      background: selected ? "#f7f2fe" : "transparent",
      cursor: "pointer",
      borderRadius: 9,
      margin: "1.5px 0"
    }}>{children}</div>
  );
}
const inputStyle = {
  width: 260, borderRadius: 7, border: "1.5px solid #edefff", padding: "10px 12px", fontSize: 17, background: "#fafbfd"
};
const tickLabel = { display: "block", fontWeight: 500, fontSize: 15, margin: "9px 0" };
const labelStyle = { fontWeight: 600, fontSize: 15, marginBottom: 3 };
