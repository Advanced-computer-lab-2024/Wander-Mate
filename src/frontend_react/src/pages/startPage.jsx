import React, { useEffect, useRef } from "react";
import "../assets/css/startPage.css";
import MainNav from "../components/mainNav";
import OurAcheivementsBlock from "../components/OurAcheivementsBlock";
import OurService from "../components/OurServiceBlock";
import WhatPeopleSay from "../components/whatpeoplesay"; // Import the WhatPeopleSay component
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();

  const handleRegClick = () => {
    navigate("/registerPage");
  };

  const ourServiceRef = useRef(null);
  const ourAchievementsRef = useRef(null);
  const whatPeopleSayRef = useRef(null); // Add reference for WhatPeopleSay if needed

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible"); // Re-add this to allow re-triggering
        }
      });
    }, observerOptions);

    // Observe components
    const serviceElement = ourServiceRef.current;
    const achievementsElement = ourAchievementsRef.current;
    const whatPeopleSayElement = whatPeopleSayRef.current;

    if (serviceElement) observer.observe(serviceElement);
    if (achievementsElement) observer.observe(achievementsElement);
    if (whatPeopleSayElement) observer.observe(whatPeopleSayElement);

    return () => {
      if (serviceElement) observer.unobserve(serviceElement);
      if (achievementsElement) observer.unobserve(achievementsElement);
      if (whatPeopleSayElement) observer.unobserve(whatPeopleSayElement);
    };
  }, []);

  return (
    <div className="full">
      <MainNav targetId1="ourServiceSection" />
      <div className="frame">
        <div className="inner-container">
          <h1 className="title">QUALITY & PASSION</h1>
          <div className="buttonR">
            <span className="buttonR-text" onClick={handleRegClick}>
              Register Now
            </span>
          </div>
        </div>
      </div>

      <div ref={ourServiceRef} className="fade-in">
        <OurService id="ourServiceSection" />
      </div>

      {/* Move Our Achievements Block Above What People Say */}
      <div ref={ourAchievementsRef} className="fade-in">
        <OurAcheivementsBlock />
      </div>

      {/* Ensure WhatPeopleSay is Below Our Achievements */}
      <div ref={whatPeopleSayRef} className="fade-in">
        <WhatPeopleSay />
      </div>
    </div>
  );
};

export default StartPage;
