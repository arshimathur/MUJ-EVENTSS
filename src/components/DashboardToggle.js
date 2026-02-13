import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DashboardToggle.css";

export default function DashboardToggle() {
  const location = useLocation();
  const navigate = useNavigate();
  const isTeacher = location.pathname === "/dashboard";
  const isStudent = location.pathname === "/student-dashboard";

  return (
    <div className="dashboard-toggle">
      <button
        className={`toggle-btn${isStudent ? " active" : ""}`}
        onClick={() => navigate("/student-dashboard")}
      >
        🧑‍🎓 Student View
      </button>
      <button
        className={`toggle-btn${isTeacher ? " active" : ""}`}
        onClick={() => navigate("/dashboard")}
      >
        🧑‍🏫 Teacher View
      </button>
      <span className="welcome">
        Welcome, <strong>{isTeacher ? "Prof. Mahesh" : "Arshi Mathur "}</strong>
      </span>
    </div>
  );
}

