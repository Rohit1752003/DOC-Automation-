import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./AdminDash.css";
import { FaHome, FaFileAlt, FaUsers, FaUser } from "react-icons/fa";

export default function RequestDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    const found = stored.find((r) => r.id === Number(id));
    setRequest(found);
  }, [id]);

  const updateStatusLocal = (status) => {

    const stored = JSON.parse(localStorage.getItem("requests")) || [];

    const updated = stored.map((r) =>
      r.id === Number(id) ? { ...r, status } : r
    );

    localStorage.setItem("requests", JSON.stringify(updated));

    setRequest((prev) => ({ ...prev, status }));
  };

  // APPROVE FUNCTION
  const handleApprove = async () => {

    if (!window.confirm("Approve this request?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/approve/${request.studentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentType: request.type,
          }),
        }
      );

      if (!response.ok) {
        alert("Approval failed");
        return;
      }

      updateStatusLocal("Approved");

      alert("Approved + Email Sent ✅");

      navigate("/all-requests");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // REJECT FUNCTION
  const handleReject = async () => {

    if (!window.confirm("Reject this request?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/reject/${request.studentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentType: request.type,
          }),
        }
      );

      if (!response.ok) {
        alert("Reject failed");
        return;
      }

      updateStatusLocal("Rejected");

      alert("Rejected + Email Sent ❌");

      navigate("/all-requests");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // GENERATE PDF + APPROVE + EMAIL
  const generateWithAI = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/generate-document",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({
            type: request.type,
            name: request.name,
            studentId: request.studentId,
            department: request.department,   // ✅ ADDED FIX
            classname: request.className,
            rollNo: request.rollNo            // ✅ FIXED HERE
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert("PDF generation failed");
        return;
      }

      const stored = JSON.parse(localStorage.getItem("requests")) || [];

      const updated = stored.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status: "Approved",
              generatedPdf: data.pdf,
              approvedDate: new Date().toLocaleDateString(),
            }
          : r
      );

      localStorage.setItem("requests", JSON.stringify(updated));

      await fetch(
        `http://localhost:5000/approve/${request.studentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentType: request.type,
          }),
        }
      );

      alert("Document Generated + Approved + Email Sent ✅");

      navigate("/all-requests");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  if (!request)
    return <h3 style={{ padding: "30px" }}>Loading...</h3>;

  return (
    <div className="dashboard-container">

      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/admin")}><FaHome /> Dashboard</li>
          <li onClick={() => navigate("/all-requests")}><FaFileAlt /> All Requests</li>
          <li onClick={() => navigate("/students")}><FaUsers /> Students</li>
          <li onClick={() => navigate("/adminprofile")}><FaUser /> Profile</li>
        </ul>
      </div>

      <div className="admin-main">
        <div className="admin-content-wrapper">

          <div className="admin-header">
            <h1>Request Details</h1>

            <div>
              <button
                className="back-btn"
                onClick={() => navigate("/all-requests")}
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

          <div className="details-card">

            <p><strong>Document:</strong> {request.type}</p>
            <p><strong>Student ID:</strong> {request.studentId}</p>
            <p><strong>Name:</strong> {request.name}</p>
            <p><strong>Department:</strong> {request.department}</p> {/* ✅ ADDED */}
            <p><strong>Date:</strong> {request.date}</p>
            <p><strong>Class:</strong> {request.className}</p>
            <p><strong>Roll No:</strong> {request.rollNo}</p> {/* ✅ FIXED */}
            <p><strong>Reason:</strong> {request.reason}</p>
            {/* Submitted Document */}

              {request.pdfFile && (
                <div style={{ marginTop: "25px" }}>
                  <h3>Submitted Document</h3>

                  {request.pdfFile.startsWith("data:application/pdf") ? (
                    <iframe
                      src={request.pdfFile}
                      title="Submitted PDF"
                      width="100%"
                      height="500"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px"
                      }}
                    />
                  ) : (
                    <img
                      src={request.pdfFile}
                      alt="Submitted Document"
                      style={{
                        width: "100%",
                        maxWidth: "600px",
                        border: "1px solid #ccc",
                        borderRadius: "8px"
                      }}
                    />
                  )}

                  <br />

                  <a
                    href={request.pdfFile}
                    download={`${request.studentId}-document`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button
                      style={{
                        marginTop: "15px",
                        padding: "10px 18px",
                        background: "#2f66c7",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Download Document
                    </button>
                  </a>
                </div>
              )}

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    request.status === "Approved"
                      ? "green"
                      : request.status === "Rejected"
                      ? "red"
                      : "orange",
                  fontWeight: "600"
                }}
              >
                {request.status}
              </span>
            </p>

            <div style={{ marginTop: "30px" }}>

              {(request.type === "Bonafide" ||
                request.type === "Leaving Certificate") ? (

                <button
                  className="accept-btn"
                  onClick={generateWithAI}
                  disabled={request.status !== "Pending"}
                >
                  Generate & Approve
                </button>

              ) : (

                <button
                  className="accept-btn"
                  onClick={handleApprove}
                  disabled={request.status !== "Pending"}
                >
                  Approve
                </button>

              )}

              <button
                className="reject-btn"
                onClick={handleReject}
                style={{ marginLeft: "15px" }}
                disabled={request.status !== "Pending"}
              >
                Reject
              </button>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
}