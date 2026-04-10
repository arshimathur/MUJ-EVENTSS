import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { API } from "../config";
import "./StudentDashboard.css";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "", // Might be strictly from Supabase Auth, but we can store it in profiles if preferred
    bio: "",
    major: "Computer Science",
    year: "Freshman",
    notifNew: true,
    notifRem: true,
    notifDigest: false,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        if (!token) return;

        const res = await fetch(`${API}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const nameParts = (data.full_name || "").split(" ");
          
          setProfile({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: data.email || "", // Assuming email exists
            bio: data.bio || "",
            major: data.major || "Computer Science",
            year: data.year || "Freshman",
            notifNew: data.notif_new ?? true,
            notifRem: data.notif_rem ?? true,
            notifDigest: data.notif_digest ?? false,
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setSaveStatus(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      // Map local UI state back to the Supabase column schema
      const updates = {
        full_name: `${profile.firstName} ${profile.lastName}`.trim(),
        bio: profile.bio,
        major: profile.major,
        year: profile.year,
        notif_new: profile.notifNew,
        notif_rem: profile.notifRem,
        notif_digest: profile.notifDigest
      };

      const res = await fetch(`${API}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!res.ok) throw new Error("Failed to update");
      setSaveStatus("success");

    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="sd-loading">Loading configuration...</div>;

  return (
    <div className="sd-page">
      <div className="sd-hero-wrap">
        <div className="sd-hero" style={{ padding: "1.5rem 2.5rem" }}>
          <div className="sd-hero-left">
            <h1 className="sd-hero-title">Account Settings</h1>
            <p className="sd-hero-sub">Manage your profile details and notification preferences.</p>
          </div>
        </div>
      </div>

      <div className="sd-grid">
        <aside className="sd-side">
          <div className="sd-card" style={{ padding: "1.5rem 1rem" }}>
            <h4 style={{ paddingLeft: "1rem" }}>Settings Menu</h4>
            <div className="settings-menu">
              <MenuItem selected>Profile Settings</MenuItem>
              <MenuItem>Notifications</MenuItem>
              <MenuItem>Privacy</MenuItem>
              <MenuItem>System Settings</MenuItem>
            </div>
          </div>
        </aside>

        <section className="sd-main">
          <div className="sd-panel">
            <div className="sd-panel-header">
              <h3>Profile Settings</h3>
            </div>

            {saveStatus === 'error' && (
              <div style={{ color: '#ef4444', marginBottom: 15, fontWeight: 'bold' }}>
                ⚠️ An error occurred while saving your data. Verify these columns exist in your Supabase 'profiles' table!
              </div>
            )}
            
            {saveStatus === 'success' && (
              <div style={{ color: '#059669', marginBottom: 15, fontWeight: 'bold' }}>
                ✅ Profile successfully updated!
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" name="firstName" value={profile.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" name="lastName" value={profile.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "1.2rem" }}>
              <label className="form-label">Email (Read Only)</label>
              <input className="form-input" disabled style={{ width: "100%", background: '#e2e8f0' }} name="email" value={profile.email} />
            </div>

            <div className="form-group" style={{ marginTop: "1.2rem" }}>
              <label className="form-label">Bio</label>
              <textarea className="form-input form-textarea" name="bio" value={profile.bio} onChange={handleChange} />
            </div>

            <div className="form-grid" style={{ marginTop: "1.2rem" }}>
              <div className="form-group">
                <label className="form-label">Major</label>
                <select className="form-input" name="major" value={profile.major} onChange={handleChange}>
                  <option>Computer Science</option>
                  <option>Business</option>
                  <option>Engineering</option>
                  <option>Art & Design</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <select className="form-input" name="year" value={profile.year} onChange={handleChange}>
                  <option>Freshman</option>
                  <option>Sophomore</option>
                  <option>Junior</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "2.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", color: "#1e293b", marginBottom: "1rem" }}>Notification Preferences</h3>
              <label className="tick-label">
                <input type="checkbox" name="notifNew" checked={profile.notifNew} onChange={handleChange} /> 
                <span className="tick-text">Email notifications for new events</span>
              </label>
              <label className="tick-label">
                <input type="checkbox" name="notifRem" checked={profile.notifRem} onChange={handleChange} /> 
                <span className="tick-text">Push notifications for event reminders</span>
              </label>
              <label className="tick-label">
                <input type="checkbox" name="notifDigest" checked={profile.notifDigest} onChange={handleChange} /> 
                <span className="tick-text">Weekly digest emails</span>
              </label>
            </div>

            <div className="sd-actions" style={{ marginTop: "2.5rem", maxWidth: "250px" }}>
              <button 
                className="btn btn-primary" 
                style={{ padding: "12px", fontSize: "1rem", cursor: saving ? "not-allowed" : "pointer" }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </section>
      </div>

      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-weight: 600;
          font-size: 0.95rem;
          color: #475569;
        }
        .form-input {
          width: 100%;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          padding: 12px 14px;
          font-size: 1rem;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.2s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: #fff;
        }
        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }
        .tick-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          cursor: pointer;
        }
        .tick-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #6366f1;
          cursor: pointer;
        }
        .tick-text {
          font-size: 0.95rem;
          color: #334155;
          font-weight: 500;
        }
        .settings-menu {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      `}</style>
    </div>
  );
}

function MenuItem({ children, selected }) {
  return (
    <div style={{
      padding: "12px 16px",
      fontWeight: selected ? 700 : 600,
      color: selected ? "#4f46e5" : "#64748b",
      fontSize: "0.95rem",
      background: selected ? "#eef2ff" : "transparent",
      cursor: "pointer",
      borderRadius: "10px",
      transition: "all 0.2s"
    }}>
      {children}
    </div>
  );
}
