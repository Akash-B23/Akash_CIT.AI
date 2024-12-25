/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "./Card.css"; // Ensure this is imported
import Header from "./Header.jsx";
import { useDepartment } from "../components/DepartmentContext";
import { useRegulation } from "../components/RegulationContext";
import { useNavigate } from "react-router-dom";

function Card({selectedOption, onOptionChange, onContinue }) {
  const { department } = useDepartment();
  const { regulation, setRegulation } = useRegulation();
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    const selected = event.target.value;
    setRegulation(selected); // Update regulation in global context
    onOptionChange(event); // Pass to parent handler
  };
  const handleContinue = () => {
    // When continue is clicked, navigate to the dashboard and pass rd as state
    const rd = `${department}-${regulation}`;
    navigate("/dashboard", {
      state: { rd } // Pass rd to the Dashboard component
    });
  };

  return (
    <>
    <Header />
    <div className="card-container">
      <div className="card">
        <h2 className="card-title">{department}</h2>
        <p className="card-description">
          Please select the Regulation
        </p>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="regulation"
                value="R21"
                checked={selectedOption === "R21"}
                onChange={handleOptionChange}
              />
              <span>Regulation 2021</span>
            </label>
            <label>
              <input
                type="radio"
                name="regulation"
                value="R22"
                checked={selectedOption === "R22"}
                onChange={handleOptionChange}
              />
              <span>Regulation 2022</span>
            </label>
            <label>
              <input
                type="radio"
                name="regulation"
                value="R22R"
                checked={selectedOption === "R22R"}
                onChange={handleOptionChange}
              />
              <span>Regulation 2022 Revised</span>
            </label>
            <label>
              <input
                type="radio"
                name="regulation"
                value="R24"
                checked={selectedOption === "R24"}
                onChange={handleOptionChange}
              />
              <span>Regulation 2024</span>
            </label>
          </div>

        {selectedOption && (
          <div className="selected-option-container">
            <h3 className="selected-option-text">
              Selected Option: {selectedOption}
            </h3>
            <div className="continue-button">
              <button onClick={handleContinue}>Continue</button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default Card;
