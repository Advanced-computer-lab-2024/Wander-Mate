import React from "react";
import "../../assets/css/serviceCard.css";

const ServiceCard = ({children, style, title, subTitle}) => {
  return (
    <div className="group-593">
      <div className="rectangle-5" style={style}>
        <div className="carbon-hotel">
          {children}
          </div>
        <div className="frame-7">

          <h2 className="hotel-booking">{title}</h2>
          <p className="description">
            {subTitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
