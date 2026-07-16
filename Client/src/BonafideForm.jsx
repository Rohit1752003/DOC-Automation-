import React, { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaDownload, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";

export default function BonafideForm() {

  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  const [formData, setFormData] = useState({
    className: "",
    division: "",
    rollNo: ""
  });

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));
    if (!storedStudent) {
      navigate("/");
    } else {
      setStudent(storedStudent);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/generate-document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "Bonafide",
        name: student.name,
        studentId: student.student_id,
        classname: formData.className,
        rollNo: formData.rollNo,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert("PDF generation failed");
      return;
    }

    // Save request locally
    const newRequest = {
      id: Date.now(),
      type: "Bonafide",
      studentId: student.student_id,
      name: student.name,
      phone: student.phone,
      className: formData.className,
      division: formData.division,
      rollNo: formData.rollNo,
      roll_no: formData.rollNo,
      status: "Pending",
      date: new Date().toLocaleDateString(),
      pdf: data.pdf,
    };

    const existing =
      JSON.parse(localStorage.getItem("requests")) || [];

    existing.push(newRequest);

    localStorage.setItem("requests", JSON.stringify(existing));

    alert("Bonafide Request Submitted ✅");

    navigate("/requested-documents");

  } catch (error) {
    console.error(error);
    alert("Server connection error");
  }
};

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">

          <li onClick={() => navigate("/dashboard")} style={{cursor:"pointer"}}>
            <FaHome /> Dashboard
          </li>

          <li onClick={() => navigate("/submitted-documents")} style={{cursor:"pointer"}}>
            <FaFileAlt /> Submitted Document
          </li>

          <li onClick={() => navigate("/requested-documents")} style={{cursor:"pointer"}}>
            <FaFileAlt /> Requested Documents
          </li>

          <li onClick={() => navigate("/downloads")}><FaDownload /> Downloaded Documents</li>

          <li onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}><FaUser /> Profile</li>


        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <div className="header">
  <div>
    <h1>Bonafide Certificate Request</h1>
    <p>Fill details to apply</p>
  </div>

  <div>
    <button
      className="back-btn"
      onClick={() => navigate("/dashboard")}
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

        {student && (
          <form onSubmit={handleSubmit} style={{maxWidth:"500px"}}>

            <input value={student.student_id} disabled />
            <input value={student.name} disabled />
            <input value={student.phone} disabled />

            <input
              type="text"
              name="className"
              placeholder="Class"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="division"
              placeholder="Division"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="rollNo"
              placeholder="Roll No"
              onChange={handleChange}
              required
            />

            <button type="submit" className="apply-btn">
                Request
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
