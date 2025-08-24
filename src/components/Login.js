import React, { useState, useEffect } from "react";
import "../styles/Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsAuthenticated(true);
      // No navigate — just let parent switch UI
      onLogin();
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isSignup) {
        // Save credentials
        const users = JSON.parse(localStorage.getItem("users")) || {};
        if (users[username]) {
          alert("Username already exists. Please try another one.");
        } else {
          users[username] = password;
          localStorage.setItem("users", JSON.stringify(users));
          alert("Account created successfully! Please login.");
          setIsSignup(false);
          setUsername("");
          setPassword("");
        }
      } else {
        // Delegate login check to parent
        onLogin(username, password);
      }
      setIsLoading(false);
    }, 800);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setUsername("");
    setPassword("");
  };

  if (isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Queue Management System</h1>
            <p className="login-subtitle">
              {isSignup ? "Create your account" : "Sign in to manage your queues"}
            </p>
          </div>
          <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary login-button"
                disabled={isLoading}
              >
                {isLoading
                  ? isSignup
                    ? "Creating Account..."
                    : "Signing in..."
                  : isSignup
                  ? "Create Account"
                  : "Sign In"}
              </button>

              <div className="form-toggle">
                <p className="toggle-text">
                  {isSignup ? "Already have an account?" : "Don't have an account?"}
                  <button
                    type="button"
                    className="toggle-button"
                    onClick={toggleMode}
                    disabled={isLoading}
                  >
                    {isSignup ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>

              <div className="demo-credentials">
                <p className="demo-text">Demo credentials (built-in):</p>
                <p className="demo-info">Username: admin | Password: admin</p>
                <p className="demo-note">
                  If not found, sign up with these to create.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
