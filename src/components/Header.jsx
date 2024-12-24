import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/cit_logo2.png";

const Header = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add sign-out logic here (e.g., clearing session, tokens, etc.)
    navigate("/");
  };

  return (
    <div className="header">
      <div className="header-buttons">
        <Link to="/select-department" className="credits-button">
          <button id="credits-button">Regulations</button>
        </Link>
        <Link to="/dashboard" className="credits-button">
          <button id="credits-button">DashBoard</button>
        </Link>
      </div>
      <div id="logo-container">
        <img src={logo} alt="CIT.AI Logo" id="logo" />
        <h1 id="header-h1">CIT.AI</h1>
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