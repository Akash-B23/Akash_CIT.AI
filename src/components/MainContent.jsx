import React, { useState, useEffect } from "react";
import CourseDetails1 from "./semesters/courseDetails1.jsx";
import CourseDetails2 from "./semesters/courseDetails2.jsx";
import CourseDetails3 from "./semesters/courseDetails3.jsx";
import CourseDetails4 from "./semesters/courseDetails4.jsx";
import CourseDetails5 from "./semesters/courseDetails5.jsx";
import CourseDetails6 from "./semesters/courseDetails6.jsx";
import CourseDetails7 from "./semesters/courseDetails7.jsx";
import CourseDetails8 from "./semesters/courseDetails8.jsx";
import { useDepartment } from "../components/DepartmentContext"; // Import department context
import { useRegulation } from "../components/RegulationContext"; // Import regulation context
import "./MainContent.css";

const MainContent = ({ selectedSemester }) => {
  const [semesterCourses, setSemesterCourses] = useState({
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": [],
    "7": [],
    "8": [],
  });

  // Access department and regulation from context
  const { department } = useDepartment();
  const { regulation } = useRegulation();

  // Function to update course data for a specific semester
  const updateCoursesForSemester = (semester, updatedCourses) => {
    setSemesterCourses((prevCourses) => ({
      ...prevCourses,
      [semester]: updatedCourses,
    }));
  };

  // Function to fetch the course details for the selected semester (if needed)
  const fetchCourses = async (department, regulation, semester) => {
    try {
      const response = await fetch(
        `http://localhost:5000/semester-details?department=${department}&regulation=${regulation}&semester=${semester}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Try parsing the response as JSON
      const courses = await response.json();
      
      // Update the state with fetched data
      updateCoursesForSemester(semester, courses); // Set the courses fetched from the server
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch the courses when the component mounts or when the semester changes
  useEffect(() => {
    if (department && regulation) {
      fetchCourses(department, regulation, selectedSemester);
    }
  }, [selectedSemester, department, regulation]);

  // Function to render the corresponding CourseDetails component based on selectedSemester
  const renderCourseDetails = () => {
    const coursesForSelectedSemester = semesterCourses[selectedSemester] || [];

    if (!coursesForSelectedSemester) {
      return <div>Error: No courses found for this semester.</div>;
    }

    const commonProps = {
      department: department,
      regulation: regulation,
      semester: selectedSemester,
      setCourses: updateCoursesForSemester,
    };

    switch (selectedSemester) {
      case "1":
        return <CourseDetails1 {...commonProps} courses={semesterCourses["1"]} />;
      case "2":
        return <CourseDetails2 {...commonProps} courses={semesterCourses["2"]} />;
      case "3":
        return <CourseDetails3 {...commonProps} courses={semesterCourses["3"]} />;
      case "4":
        return <CourseDetails4 {...commonProps} courses={semesterCourses["4"]} />;
      case "5":
        return <CourseDetails5 {...commonProps} courses={semesterCourses["5"]} />;
      case "6":
        return <CourseDetails6 {...commonProps} courses={semesterCourses["6"]} />;
      case "7":
        return <CourseDetails7 {...commonProps} courses={semesterCourses["7"]} />;
      case "8":
        return <CourseDetails8 {...commonProps} courses={semesterCourses["8"]} />;
      default:
        return <div className="welcome-msg">Select a semester to add course details</div>;
    }
  };

  return <div className="main_content">{renderCourseDetails()}</div>;
};

export default MainContent;
