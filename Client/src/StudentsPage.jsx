import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaUsers, FaUser } from "react-icons/fa";
import logo from "./assets/logo.jpeg";
import "./AdminDash.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/students`);

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message || "Failed to fetch students");
          return;
        }

        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="image" />

        <ul className="sidebar-menu">
          <li
            onClick={() => navigate("/admin")}
            style={{ cursor: "pointer" }}
          >
            <FaHome /> Dashboard
          </li>

          <li
            onClick={() => navigate("/all-requests")}
            style={{ cursor: "pointer" }}
          >
            <FaFileAlt /> All Requests
          </li>

          <li
            onClick={() => navigate("/students")}
            style={{ cursor: "pointer" }}
          >
            <FaUsers /> Students
          </li>

          <li
            onClick={() => navigate("/adminprofile")}
            style={{ cursor: "pointer" }}
          >
            <FaUser /> Profile
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content-wrapper">
          <div className="admin-header">
            <div>
              <h1>All Students</h1>
              <p>Registered Students List</p>
            </div>

            <div>
              <button
                className="back-btn"
                onClick={() => navigate("/admin")}
              >
                Back
              </button>

              <button
                className="logout-btn"
                onClick={() => navigate("/")}
                style={{ marginLeft: "10px" }}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    <td>{student.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}