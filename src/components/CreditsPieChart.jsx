/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Table from "./Table.jsx";
import Header from "./Header.jsx";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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
  const [allRegulationsCategoryData, setAllRegulationsCategoryData] = useState({});
  const [viewMode, setViewMode] = useState("chart");

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

  useEffect(() => {
    if (selectedDept) {
      fetchAllRegulationsCategoryData(selectedDept);
    }
  }, [selectedDept]);

  const fetchSemesterData = async (department, regulation) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/courses/semester",
        {
          params: { department, regulation },
        }
      );
      console.log("Semester Data:", response.data); // Log the response here
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

  const fetchAllRegulationsCategoryData = async (department) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/courses/category/all",
        {
          params: { department },
        }
      );
      setAllRegulationsCategoryData(response.data);
    } catch (err) {
      console.error(err);
      setAllRegulationsCategoryData({});
    }
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const calculatePieChartData = (data) => {
    const totalCourses = Object.values(data).reduce(
      (sum, courses) => sum + (courses ? courses.length : 0),
      0
    );

    if (totalCourses === 0)
      return Array(Object.keys(categoryMapping).length).fill(0);

    return Object.keys(categoryMapping).map((key) => {
      const categoryCourses = data[key] ? data[key].length : 0;
      return (categoryCourses / totalCourses) * 100;
    });
  };

  const pieChartOptions = {
    plugins: {
      datalabels: {
        display: true,
        color: "#ffffff",
        font: { size: 14, weight: "bold" },
        formatter: (value) => (value > 0 ? `${value.toFixed(1)}%` : ""),
        anchor: "center",
        align: "center",
        offset: 6,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    rotation: Math.PI / 2,
    cutout: "50%",
  };

  const handleSignOut = () => {
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

          {/* Show regulation dropdown only for "table" view mode */}
          {viewMode === "table" && (
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
          )}

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
        </div>

        {viewMode === "chart" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              maxWidth: "950px",
              margin: "0 auto",
            }}
          >
            {selectedDept ? (
              <>
                {Object.entries(allRegulationsCategoryData).map(
                  ([regulation, data]) => {
                    if (Object.values(data).every((category) => !category.length)) {
                      return null; // Skip empty data
                    }
                    return (
                      <div
                        key={regulation}
                        style={{
                          backgroundColor: "#fff",
                          padding: "20px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          border: "none"
                        }}
                      >
                        <h2 style={{ textAlign: "center", color: "black"}}>{regulation}</h2>
                        <Pie
                          data={{
                            labels: Object.values(categoryMapping),
                            datasets: [
                              {
                                data: calculatePieChartData(data),
                                backgroundColor: [
                                  "#FF6384",
                                  "#36A2EB",
                                  "#FFCE56",
                                  "#4BC0C0",
                                  "#9966FF",
                                  "#FF9F40",
                                  "#C9CBCF",
                                ],
                                hoverBackgroundColor: [
                                  "#FF6384",
                                  "#36A2EB",
                                  "#FFCE56",
                                  "#4BC0C0",
                                  "#9966FF",
                                  "#FF9F40",
                                  "#C9CBCF",
                                ],
                              },
                            ],
                          }}
                          options={pieChartOptions}
                        />
                      </div>
                    );
                  }
                )}
              </>
            ) : (
              <p style={{ textAlign: "center", color: "#fff" }}>
                Please select a department to view the chart.
              </p>
            )}
          </div>
        )}

        {viewMode === "table" && (
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