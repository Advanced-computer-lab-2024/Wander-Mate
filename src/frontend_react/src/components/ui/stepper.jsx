import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../assets/css/stepper.css";

const Stepper = ({ thisStep, page }) => {
  const [currentStep, setCurrentStep] = useState(thisStep);
  const navigate = useNavigate(); // Initialize useNavigate

  const steps = [
    { label: "Choose your own role", step: 1, path: "/registerStart" }, // Define paths
    { label: "Enter your info", step: 2, path: page },
    { label: "Create your password", step: 3, path: "/registerPassword" },
  ];



  const handleClick = (step, path) => {
    if (step <= currentStep) {
      // Allow click only for previous steps
      setCurrentStep(step);
      navigate(path); // Navigate to the specific page
    }
  };

  return (
    <div className="stepper-container">
      {steps.map((item, index) => (
        <div key={item.step} className="step-wrapper">
          <div
            className={`step ${currentStep === item.step ? "active" : ""} ${
              item.step <= currentStep ? "clickable" : "disabled"
            }`}
            onClick={() => handleClick(item.step, item.path)} // Pass path to handleClick
          >
            <div
              className={`circle ${
                item.step < currentStep ? "completed" : ""
              } ${currentStep === item.step ? "active" : ""}`}
            >
              {item.step}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`divider ${
                item.step < currentStep ? "completed" : ""
              }`}
            ></div>
          )}
          <span className="step-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
