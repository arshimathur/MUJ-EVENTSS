import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { API } from "../config";

import StudentDashboard from "./StudentDashboard";
import Dashboard from "./Dashboard"; // Admin dashboard
import ClubDashboard from "./ClubDashboard";

export default function DashboardRouter() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setRole(data.role);
      } catch (err) {
        console.error("Failed to load role", err);
      } finally {
        setLoading(false);
      }
    }

    loadRole();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  if (role === "student") return <StudentDashboard />;
  if (role === "club" || role === "admin") return <ClubDashboard />;
  
  return <div>No dashboard available</div>;
}
