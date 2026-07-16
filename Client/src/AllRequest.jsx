import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaUsers, FaUser, FaTrash } from "react-icons/fa";
import axios from "axios";
import logo from "./assets/logo.jpeg";
import "./AdminDash.css";

export default function AllRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  // Load requests from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(stored.filter((r) => !r.hiddenForAdmin));
  }, []);

  // Update status locally
  const updateStatus = (id, newStatus) => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];

    const updated = stored.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );

    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated.filter((r) => !r.hiddenForAdmin));
  };

  // Approve request + send email
const handleApprove = async (studentId, documentType, requestId) => {

  const confirmApprove = window.confirm("Approve this request?");
  if (!confirmApprove) return;

  try {
    const response = await fetch(
      `http://localhost:5000/approve/${studentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentType }),
      }
    );

    if (!response.ok) {
      alert("Approval failed");
      return;
    }

    updateStatus(requestId, "Approved");

    alert("Approved + Email Sent ✅");

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};


const handleReject = async (studentId, documentType, requestId) => {

  const confirmReject = window.confirm("Reject this request?");
  if (!confirmReject) return;

  try {
    const response = await fetch(
      `http://localhost:5000/reject/${studentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentType }),
      }
    );

    if (!response.ok) {
      alert("Reject failed");
      return;
    }

    updateStatus(requestId, "Rejected");

    alert("Rejected + Email Sent ❌");

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

  // Delete request (after approval/rejection)
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    const stored = JSON.parse(localStorage.getItem("requests")) || [];

    const updated = stored.map((r) =>
      r.id === id ? { ...r, hiddenForAdmin: true } : r
    );

    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated.filter((r) => !r.hiddenForAdmin));
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
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

          {/* Header */}
          <div className="admin-header">
            <h1>All Requests</h1>

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

          {/* Table */}
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Student ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => navigate(`/request/${req.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{req.type}</td>
                    <td>{req.studentId}</td>
                    <td>{req.date}</td>

                    {/* Status */}
                    <td
                      className={
                        req.status === "Pending"
                          ? "status-pending"
                          : req.status === "Approved"
                          ? "status-approved"
                          : "status-rejected"
                      }
                    >
                      {req.status}
                    </td>

                    {/* Approve Reject Buttons */}
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {req.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                             handleApprove(req.studentId, req.type, req.id)
                            }
                            style={{
                              background: "green",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleReject(req.studentId, req.type, req.id)
                            }
                            style={{
                              background: "red",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>

                    {/* Delete Button */}
                    <td
                      onClick={(e) => {
                        e.stopPropagation();

                        if (
                          req.status === "Approved" ||
                          req.status === "Rejected"
                        ) {
                          handleDelete(req.id);
                        }
                      }}
                      style={{ textAlign: "center" }}
                    >
                      <FaTrash
                        style={{
                          color:
                            req.status === "Approved" ||
                            req.status === "Rejected"
                              ? "red"
                              : "#ccc",
                          cursor:
                            req.status === "Approved" ||
                            req.status === "Rejected"
                              ? "pointer"
                              : "not-allowed",
                        }}
                      />
                    </td>
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