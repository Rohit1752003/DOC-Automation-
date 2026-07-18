import React, { useState } from "react";
import "./LoginPage.css";
import { FaKey, FaUser } from "react-icons/fa";
import logo from "./assets/logo.jpeg";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { success, ...studentData } = data;

        localStorage.setItem("student", JSON.stringify(studentData));

        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid Student ID or Password");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <img src={logo} alt="College Logo" />

        <ul>
          <li>
            <FaKey />
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                marginLeft: "8px",
              }}
            >
              Student Login
            </Link>
          </li>

          <li>
            <FaUser />
            <Link
              to="/admin-login"
              style={{
                textDecoration: "none",
                color: "inherit",
                marginLeft: "8px",
              }}
            >
              Admin Login
            </Link>
          </li>
        </ul>
      </div>

      <div className="main">
        <div className="login-box">
          <h1>Student Login</h1>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Student ID</label>

              <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Password</label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  marginTop: "10px",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}