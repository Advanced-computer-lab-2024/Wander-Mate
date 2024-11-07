import React from "react";
import "../../assets/css/smallCard.css";

const SmallCard = ({ children, headerText, subheaderText }) => {
  return (
    <div className="card">
      <div>{children}</div>
      <div className="header">{headerText}</div>
      <div className="subheader">{subheaderText}</div>{" "}
    </div>
  );
};

export default SmallCard;
