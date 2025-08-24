import React, { useState } from "react";
import "../styles/Login.css";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        const res = await fetch("https://queue-manager-6ex4.onrender.com/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error("Signup failed");
        alert("Account created successfully! Please login.");
        setIsSignup(false);
      } else {
        const res = await fetch("https://queue-manager-6ex4.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error("Invalid credentials");
        const data = await res.json();

        // Store token and user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        onLogin();
      }
    } catch (err) {
      alert(err.message);
    }
    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setUsername("");
    setPassword("");
  };

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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
