// Note: The project uses Create React App (react-scripts), so process.env is the correct way
// to access environment variables. We also support Vite's import.meta.env for future compatibility.
export const API_URL = process.env.REACT_APP_API_URL || 
  (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_URL : null) || 
  "https://muj-events.onrender.com";
