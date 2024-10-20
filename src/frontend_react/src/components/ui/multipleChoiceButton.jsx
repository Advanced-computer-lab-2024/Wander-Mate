import React from "react";
import "../../assets/css/multipleChoiceButton.css";
const MultButton = ({ isActive, onClick, children }) => {
  return (
    <div style={{paddingBottom:"2vh"}}>
    <div
      className={`button ${isActive ? "active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex="0" // For keyboard accessibility
      onKeyDown={(e) => e.key === "Enter" && onClick()} // Handle Enter key
    >
      <span className="label">{children}</span>
    </div>
    </div>
  );
};

export default MultButton;
