import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../assets/cit_logo2.png";
import { useDepartment } from "../components/DepartmentContext";
import { useRegulation } from "../components/RegulationContext";

const Header = () => {
  const navigate = useNavigate();
  const { department } = useDepartment();
  const { regulation } = useRegulation();
  // const location = useLocation();

  const handleSignOut = () => {
    // Add sign-out logic here (e.g., clearing session, tokens, etc.)
    navigate("/");
  };

  const navigateToDashboard = () => {
    // Navigate to the dashboard with department and regulation as state
    navigate("/dashboard", {
      state: { department, regulation },
    });
  };

  return (
    <div className="header">
      <div className="header-buttons">
        <Link to="/select-department" className="credits-button">
          <button id="credits-button">Regulations</button>
        </Link>
        <button
          id="credits-button"
          onClick = {navigateToDashboard}
        >
          DashBoard
        </button>
      </div>
      <div className = "regAndDeptDetail">
        <p>Regulation: {regulation}</p> {/* Display department */}
      </div>
      <div id="logo-container">
        <img src={logo} alt="CIT.AI Logo" id="logo" />
        <h1 id="header-h1">CIT.AI</h1>
      </div>
      <div className = "regAndDeptDetail">
        <p>Department: {department}</p> {/* Display department */}
      </div>
      <div className="header-buttons">
        <Link to="/chart" className="credits-button">
          <button id="credits-button">Go to Analysis</button>
        </Link>
        <button id="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;