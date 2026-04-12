import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { API } from "../config";
import { getDashboardPathForRole, getStoredActiveRole } from "../utils/roleAccess";

import StudentDashboard from "./StudentDashboard";
import ClubDashboard from "./ClubDashboard";
import Dashboard from "./Dashboard";
import AdminDashboardHub from "./AdminDashboardHub";

export default function DashboardRouter() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const activeRole = getStoredActiveRole();

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

  if (activeRole === "student") return <StudentDashboard />;
  if (activeRole === "club") return <ClubDashboard />;
  if (activeRole === "teacher") return <Dashboard />;
  if (activeRole === "admin") return <AdminDashboardHub />;

  if (role === "student") return <StudentDashboard />;
  if (role === "club") return <ClubDashboard />;
  if (role === "teacher") return <Dashboard />;
  if (role === "admin") return <AdminDashboardHub />;

  return <div>No dashboard available. <a href={getDashboardPathForRole(activeRole)}>Go to dashboard</a></div>;
}
