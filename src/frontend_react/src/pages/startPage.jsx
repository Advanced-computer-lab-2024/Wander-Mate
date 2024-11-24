import React, { useEffect, useRef } from "react";
import "../assets/css/startPage.css";
import MainNav from "../components/mainNav";
import OurAcheivementsBlock from "../components/OurAcheivementsBlock";
import OurService from "../components/OurServiceBlock";
import WhatPeopleSay from "../components/whatpeoplesay"; // Import the WhatPeopleSay component
import ExploreComponent from "../components/exploreComponent"; // Import the ExploreComponent
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();

  const handleRegClick = () => {
    navigate("/registerPage");
  };

  const ourServiceRef = useRef(null);
  const ourAchievementsRef = useRef(null);
  const whatPeopleSayRef = useRef(null);
  const exploreComponentRef = useRef(null); // Add ref for ExploreComponent

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
    const exploreComponentElement = exploreComponentRef.current;

    if (serviceElement) observer.observe(serviceElement);
    if (achievementsElement) observer.observe(achievementsElement);
    if (whatPeopleSayElement) observer.observe(whatPeopleSayElement);
    if (exploreComponentElement) observer.observe(exploreComponentElement);

    return () => {
      if (serviceElement) observer.unobserve(serviceElement);
      if (achievementsElement) observer.unobserve(achievementsElement);
      if (whatPeopleSayElement) observer.unobserve(whatPeopleSayElement);
      if (exploreComponentElement) observer.unobserve(exploreComponentElement);
    };
  }, []);

  return (
    <div className="full">
      <MainNav targetId1="ourServiceSection" targetId3="exploreComponent"/>
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

      {/* Our Services Section */}
      <div ref={ourServiceRef} className="fade-in">
        <OurService id="ourServiceSection" />
      </div>

      {/* Our Achievements Section */}
      <div ref={ourAchievementsRef} className="fade-in">
        <OurAcheivementsBlock />
      </div>

      {/* What People Say Section */}
      <div ref={whatPeopleSayRef} className="fade-in">
        <WhatPeopleSay />
      </div>
       {/* Explore Component Section */}
       <div ref={exploreComponentRef} className="fade-in" id="exploreComponent">
        <ExploreComponent />
      </div>
    </div>
  );
};

export default StartPage;
