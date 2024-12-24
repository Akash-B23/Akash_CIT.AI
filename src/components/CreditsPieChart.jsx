import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Table from "./Table.jsx";
import Header from "./Header.jsx"

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // Register the plugin

const CreditsPieChart = () => {
  const navigate = useNavigate();
  const [departments] = useState([
    { id: 1, name: "CSE" },
    { id: 2, name: "IT" },
    { id: 3, name: "AIDS" },
    { id: 4, name: "AIML" },
    { id: 5, name: "CyberSecurity" },
    { id: 6, name: "CSBS" },
    { id: 7, name: "MECH" },
    { id: 8, name: "MCT" },
    { id: 9, name: "ECE" },
    { id: 10, name: "EEE" },
    { id: 11, name: "VLSI" },
    { id: 12, name: "BME" },
    { id: 13, name: "ACT" },
    { id: 14, name: "CIVIL" },
  ]);

  const [regulations] = useState(["R21", "R22", "R22R", "R24"]);
  const [selectedReg, setSelectedReg] = useState("R21");
  const [selectedDept, setSelectedDept] = useState("");
  const [semesterData, setSemesterData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [viewMode, setViewMode] = useState("chart"); // Default to 'chart'

  const categoryMapping = {
    HSMC: "Humanities & Social Science Courses (HSMC)",
    BSC: "Basic Science Courses (BSC)",
    ESC: "Engineering Science Courses (ESC)",
    PCC: "Program Core Courses (PCC)",
    PEC: "Professional Elective Courses (PEC)",
    OEC: "Open Elective Courses (OEC)",
    EEC: "Employability Enhancement Courses (EEC)",
    MC: "Mandatory Courses (MC)",
  };

  useEffect(() => {
    if (selectedDept && selectedReg) {
      fetchSemesterData(selectedDept, selectedReg);
      fetchCategoryData(selectedDept, selectedReg);
    } else {
      setSemesterData({});
      setCategoryData({});
    }
  }, [selectedDept, selectedReg]);

  const fetchSemesterData = async (department, regulation) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/courses/semester",
        {
          params: { department, regulation },
        }
      );
      setSemesterData(response.data);
    } catch (err) {
      console.error(err);
      setSemesterData({});
    }
  };

  const fetchCategoryData = async (department, regulation) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/courses/category",
        {
          params: { department, regulation },
        }
      );
      setCategoryData(response.data);
    } catch (err) {
      console.error(err);
      setCategoryData({});
    }
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  // Calculate the values dynamically
  const calculatePieChartData = () => {
    const totalCourses = Object.values(categoryData).reduce(
      (sum, courses) => sum + (courses ? courses.length : 0),
      0
    );

    if (totalCourses === 0)
      return Array(Object.keys(categoryMapping).length).fill(0);

    return Object.keys(categoryMapping).map((key) => {
      const categoryCourses = categoryData[key] ? categoryData[key].length : 0;
      return (categoryCourses / totalCourses) * 100;
    });
  };

  const pieChartData = {
    labels: Object.values(categoryMapping), // Category names
    datasets: [
      {
        data: calculatePieChartData(), // Calculated percentages
        backgroundColor: [
          "#FF5733", // Bright Red-Orange
          "#33FF57", // Vibrant Green
          "#5733FF", // Deep Blue
          "#FFD700", // Gold
          "#8E44AD", // Purple
          "#00CED1", // Turquoise
          "#FF69B4", // Hot Pink
          "#CD5C5C", // Medium Coral
        ],
        hoverBackgroundColor: [
          "#E04A2C", // Darker Red-Orange
          "#2CE04A", // Darker Green
          "#4A2CE0", // Darker Blue
          "#E6C400", // Darker Gold
          "#7C3C9E", // Darker Purple
          "#00B8BE", // Darker Turquoise
          "#E1589C", // Darker Pink
          "#B04F4F", // Darker Coral
        ],
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 18, // Increased font size for legend labels
            family: "Arial", // Use a clean and readable font
          },
          color: "#FFFFFF", // White font color for better readability on dark backgrounds
          padding: 15, // Add spacing between legend items
        },
      },
      datalabels: {
        color: "#FFFFFF", // White font color for data labels
        formatter: (value) => (value > 0 ? `${value.toFixed(3)}%` : null), // Show values as percentages, hide 0%
        font: {
          size: 18, // Increased font size for data labels
          weight: "bold",
        },
      },
    },
    responsive: true,
  };
  
  const handleSignOut = () => {
    // Add sign-out logic here (e.g., clearing session, tokens, etc.)
    navigate("/");
  };
  
  return (
    <>
    <Header />
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
        Department Courses Overview
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
          gap: "15px",
        }}
      >
        <select
          onChange={(e) => setSelectedDept(e.target.value)}
          value={selectedDept}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            width: "200px",
          }}
        >
          <option value="">Select a Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedReg(e.target.value)}
          value={selectedReg}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            width: "200px",
          }}
        >
          {regulations.map((reg, index) => (
            <option key={index} value={reg}>
              {reg}
            </option>
          ))}
        </select>

        <button
          onClick={() => handleViewChange("chart")}
          disabled={viewMode === "chart"}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: viewMode === "chart" ? "#bbb" : "#007bff",
            color: "#fff",
            cursor: viewMode === "chart" ? "not-allowed" : "pointer",
            width: "150px",
          }}
        >
          View Chart
        </button>

        <button
          onClick={() => handleViewChange("table")}
          disabled={viewMode === "table"}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: viewMode === "table" ? "#bbb" : "#007bff",
            color: "#fff",
            cursor: viewMode === "table" ? "not-allowed" : "pointer",
            width: "150px",
          }}
        >
          View Table
        </button>

        {/* <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#28a745",
            color: "#fff",
            cursor: "pointer",
            width: "150px",
            gap: "10px",
          }}
        >
          <FontAwesomeIcon icon={faHome} />
          Home
        </button> */}
      </div>

      {viewMode === "chart" && (
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
          {selectedDept ? (
            <Pie data={pieChartData} options={pieChartOptions} />
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#ffffff",
                fontSize: "25px",
              }}
            >
              Please select a department
            </p>
          )}
        </div>
      )}

      {viewMode === "table" && Object.keys(semesterData).length !== 0 && (
        <Table
          semesterData={semesterData}
          categoryData={categoryData}
          categoryMapping={categoryMapping}
        />
      )}
    </div>
    </>
  );
};

export default CreditsPieChart;