import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  ROLE_OPTIONS,
  getDashboardPathForRole,
  getStoredActiveRole,
  setStoredActiveRole
} from "../../utils/roleAccess";

const MUJ_DOMAIN = "@muj.manipal.edu";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(getStoredActiveRole() || "student");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate(getDashboardPathForRole(getStoredActiveRole() || role), { replace: true });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate(getDashboardPathForRole(getStoredActiveRole() || role), { replace: true });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate, role]);

  const sendMagicLink = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!email.toLowerCase().endsWith(MUJ_DOMAIN)) {
      setMsg(`Please use your MUJ email (${MUJ_DOMAIN})`);
      return;
    }

    setLoading(true);
    try {
      setStoredActiveRole(role);
      const res = await fetch("http://localhost:8080/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error("Failed to send login link");

      setMsg("✅ Magic login link sent! Check your MUJ email inbox.");
    } catch (err) {
      setMsg("❌ Something went wrong. Make sure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2>Login</h2>
        <p style={{ color: "#777" }}>Choose your role and use your MUJ Email</p>

        <form onSubmit={sendMagicLink} style={styles.form}>
          <div style={styles.roleGroup}>
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                style={{
                  ...styles.roleButton,
                  ...(role === option.value ? styles.roleButtonActive : {})
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <input
            style={styles.input}
            type="email"
            placeholder={`example${MUJ_DOMAIN}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: 360,
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  form: { display: "flex", flexDirection: "column", gap: 12, marginTop: 12 },
  roleGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8
  },
  roleButton: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d4d4d8",
    background: "#f8fafc",
    color: "#334155",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer"
  },
  roleButtonActive: {
    border: "1px solid #6e59f0",
    background: "#ede9fe",
    color: "#5b21b6"
  },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    background: "#6e59f0",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
  },
  msg: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
};
