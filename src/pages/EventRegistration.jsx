import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";   // ✅ ADD THIS
import { supabase } from "../supabaseClient";
import { API } from "../config";
import "./EventRegistration.css";

export default function EventRegistration() {

  /* ✅ GET EVENT ID FROM URL */
  const { eventId } = useParams();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    regNumber: "",
    attendees: 1
  });

  const [extraAttendees, setExtraAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUserEmail();
  }, []);

  /* ================= LOAD USER EMAIL ================= */

  async function loadUserEmail() {
    const { data } = await supabase.auth.getUser();

    if (data?.user?.email) {
      setForm(prev => ({
        ...prev,
        email: data.user.email
      }));
    }
  }

  /* ================= INPUT CHANGE ================= */

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  /* ================= ATTENDEE DROPDOWN ================= */

  function handleAttendeeChange(e) {
    const count = Number(e.target.value);

    setForm(prev => ({
      ...prev,
      attendees: count
    }));

    if (count > 1) {
      const extras = Array.from({ length: count - 1 }, () => ({
        firstName: "",
        lastName: "",
        email: ""
      }));

      setExtraAttendees(extras);
    } else {
      setExtraAttendees([]);
    }
  }

  /* ================= EXTRA ATTENDEE CHANGE ================= */

  function updateExtra(index, field, value) {
    const updated = [...extraAttendees];
    updated[index][field] = value;
    setExtraAttendees(updated);
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        setMessage("Please login first.");
        setLoading(false);
        return;
      }

      if (!eventId) {
        setMessage("Invalid event.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: eventId,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          regNumber: form.regNumber,
          attendees: form.attendees,
          extraAttendees: extraAttendees
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      setMessage("✅ Successfully Registered!");

      setForm({
        firstName: "",
        lastName: "",
        email: form.email,
        phone: "",
        regNumber: "",
        attendees: 1
      });

      setExtraAttendees([]);

    } catch (err) {
      setMessage(err.message);
    }

    setLoading(false);
  }

  /* ================= UI ================= */

  return (
    <div className="reg-wrapper">
      <div className="reg-card">

        <div className="reg-icon">📅</div>
        <h2>Join Our Event</h2>
        <p>Register now to secure your spot</p>

        <form onSubmit={handleSubmit}>

          <div className="row">
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <input name="email" value={form.email} disabled />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="regNumber"
            placeholder="Registration Number"
            value={form.regNumber}
            onChange={handleChange}
          />

          <select value={form.attendees} onChange={handleAttendeeChange}>
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>
                {n} Attendee{n > 1 && "s"}
              </option>
            ))}
          </select>

          {extraAttendees.length > 0 && (
            <div className="extra-section">
              <h4>Additional Attendees</h4>

              {extraAttendees.map((person, index) => (
                <div key={index} className="extra-card">

                  <input
                    placeholder={`Attendee ${index + 2} First Name`}
                    value={person.firstName}
                    required
                    onChange={(e) =>
                      updateExtra(index, "firstName", e.target.value)
                    }
                  />

                  <input
                    placeholder={`Attendee ${index + 2} Last Name`}
                    value={person.lastName}
                    onChange={(e) =>
                      updateExtra(index, "lastName", e.target.value)
                    }
                  />

                  <input
                    placeholder={`Attendee ${index + 2} Email`}
                    value={person.email}
                    required
                    onChange={(e) =>
                      updateExtra(index, "email", e.target.value)
                    }
                  />

                </div>
              ))}
            </div>
          )}

          <button disabled={loading}>
            {loading ? "Registering..." : "Register for Event"}
          </button>

        </form>

        {message && <div className="reg-message">{message}</div>}

      </div>
    </div>
  );
}
