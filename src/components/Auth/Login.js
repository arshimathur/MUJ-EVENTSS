import { supabase } from "../../supabaseClient";


export default function Login() {

  const handleMagicLogin = async () => {
    const email = prompt("Enter your email to login:");

    if (!email) return;

    const res = await fetch("http://localhost:8080/auth/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      alert("✅ Magic login link sent! Check your email.");
    } else {
      alert("❌ Could not send login link. Check backend is running.");
    }
  };

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log(session);
    if (session) {
      alert("✅ Logged in (check console)");
    } else {
      alert("❌ Not logged in yet.");
    }
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <button onClick={handleMagicLogin}>Login with Email</button>
      <button onClick={checkSession} style={{ marginLeft: "10px" }}>
        Check Login Status
      </button>
    </div>
  );
}
