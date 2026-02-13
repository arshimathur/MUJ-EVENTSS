import React from "react";
import "./Auth.css";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up for MUJ Events</h2>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
