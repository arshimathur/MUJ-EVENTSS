import { useState } from "react";
import { supabase } from "../../supabaseClient";

const MUJ_DOMAIN = "@muj.manipal.edu";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMagicLink = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!email.toLowerCase().endsWith(MUJ_DOMAIN)) {
      setMsg(`Please use your MUJ email (${MUJ_DOMAIN})`);
      return;
    }

    setLoading(true);
    try {
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
        <p style={{ color: "#777" }}>Use your MUJ Email</p>

        <form onSubmit={sendMagicLink} style={styles.form}>
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
