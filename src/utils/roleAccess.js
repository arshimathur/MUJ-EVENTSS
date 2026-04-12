export const ACTIVE_ROLE_KEY = "muj_active_role";

export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "club", label: "Club" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" }
];

export function getStoredActiveRole() {
  return localStorage.getItem(ACTIVE_ROLE_KEY) || "";
}

export function setStoredActiveRole(role) {
  localStorage.setItem(ACTIVE_ROLE_KEY, role);
}

export function clearStoredActiveRole() {
  localStorage.removeItem(ACTIVE_ROLE_KEY);
}

export function getDashboardPathForRole(role) {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "club":
      return "/club-dashboard";
    case "teacher":
      return "/teacher-dashboard";
    case "student":
      return "/student-dashboard";
    default:
      return "/login";
  }
}
