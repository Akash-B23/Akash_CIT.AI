/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDepartment } from "./DepartmentContext";  // Import context hook
import { useRegulation } from "./RegulationContext"; 
import NavBar from "./Navbar.jsx"; // Replace SideBar with NavBar
import Header from "./Header.jsx";
import MainContent from "./MainContent.jsx";
import "./DashBoard.css";

function DashBoard() {
  const { department } = useDepartment(); // Get department from context
  const { regulation } = useRegulation(); 
  const [selectedSemester, setSelectedSemester] = useState("1"); // Default semester
  const [courseData, setCourseData] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  });

  const location = useLocation();
  console.log(location.state, "Location State"); // Check if rd is correctly s

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester); // Update the selected semester state
  };

  const updateCoursesForSemester = (semester, updatedCourses) => {
    setCourseData((prevData) => ({
      ...prevData,
      [semester]: updatedCourses, // Update only the selected semester's course data
    }));
  };

  return (
    <div className="app-container">
      <Header />
      <NavBar onSelectSemester={handleSemesterSelect} /> {/* Use NavBar */}
      <MainContent
        selectedSemester={selectedSemester}
        courseData={courseData}
        onCourseDataChange={updateCoursesForSemester}
        department = {department || location}
        regulation = {regulation}
      />
    </div>
  );
}

export default DashBoard;