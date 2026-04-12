import React from "react";
import { Navigate } from "react-router-dom";
import { getDashboardPathForRole, getStoredActiveRole } from "../../utils/roleAccess";

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const activeRole = getStoredActiveRole();

  if (!activeRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(activeRole)) {
    return <Navigate to={getDashboardPathForRole(activeRole)} replace />;
  }

  return children;
}
