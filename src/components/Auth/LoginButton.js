import { supabase } from "../../supabaseClient";

export default function LoginButton() {
  const sendMagic = async () => {
    const email = prompt("Enter your email to login:");
    if (!email) return;
    const res = await fetch("http://localhost:8080/auth/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    alert(res.ok ? "Magic link sent! Check your email." : "Failed to send link.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    alert("Logged out");
  };

  return (
    <button className="btn-auth" onClick={sendMagic} title="Login">
      Login
    </button>
  );
}
