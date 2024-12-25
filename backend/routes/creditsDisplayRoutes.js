/* eslint-disable no-unused-vars */
// /routes/courses.js

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Helper function to log parameters
const logParams = (department, regulation) => {
  console.log("Department:", department);
  console.log("Regulation:", regulation);
};

// Endpoint to fetch semester-wise courses data for a department
router.get("/courses/semester", async (req, res) => {
  try {
    const { department, regulation } = req.query;
    logParams(department, regulation);

    if (!department || !regulation) {
      return res.status(400).json({
        message: "Missing department or regulation parameter",
      });
    }

    const result = await pool.query(
      `SELECT course_code, course_name, credits, ltp, tp, semester
       FROM courses
       WHERE department = $1 AND regulation = $2
       ORDER BY semester`,
      [department, regulation]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No courses found for the selected department and regulation",
      });
    }

    const semesterData = result.rows.reduce((acc, course) => {
      if (!acc[course.semester]) {
        acc[course.semester] = [];
      }
      acc[course.semester].push({
        course_code: course.course_code,
        course_name: course.course_name,
        credits: course.credits,
        ltp: course.ltp,
        tp: course.tp, // Include the TP field
      });
      return acc;
    }, {});

    res.json(semesterData);
  } catch (error) {
    console.error("Error fetching semester-wise courses:", error.message);
    res.status(500).json({ message: "Error retrieving semester-wise courses" });
  }
});

// Endpoint to fetch category-wise courses data for a department
router.get("/courses/category", async (req, res) => {
  try {
    const { department, regulation } = req.query;
    logParams(department, regulation);

    if (!department || !regulation) {
      return res.status(400).json({
        message: "Missing department or regulation parameter",
      });
    }

    const result = await pool.query(
      `SELECT course_code, course_name, category, credits, ltp, tp, semester
       FROM courses
       WHERE department = $1 AND regulation = $2
       ORDER BY category, semester`,
      [department, regulation]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No courses found for the selected department and regulation",
      });
    }

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

    const categoryData = result.rows.reduce((acc, course) => {
      const categoryName = categoryMapping[course.category] || course.category;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push({
        course_code: course.course_code,
        course_name: course.course_name,
        credits: course.credits,
        ltp: course.ltp,
        tp: course.tp, // Include the TP field
        semester: course.semester || "N/A", // Fallback for missing semester
      });
      return acc;
    }, {});

    res.json(categoryData);
  } catch (error) {
    console.error("Error fetching category-wise courses:", error.message);
    res.status(500).json({ message: "Error retrieving category-wise courses" });
  }
});

export default router;
