// Note: The project uses Create React App (react-scripts), so process.env is the correct way
// to access environment variables. We also support Vite's process.env.REACT_APP_API_URL for future compatibility.
export const API_URL = process.env.REACT_APP_API_URL || 
  (typeof import.meta !== 'undefined' && process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.VITE_API_URL : null) || 
  "https://muj-events.onrender.com";
