import React from "react";
import "../../assets/css/serviceCard.css";

const ServiceCard = ({children, style}) => {
  return (
    <div className="group-593">
      <div className="rectangle-5" style={style}>
        <div className="carbon-hotel">
          {children}
          </div>
        <div className="frame-7">

          <h2 className="hotel-booking">Hotel Booking</h2>
          <p className="description">
            You can easily book your according to your budget hotel by our
            website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
