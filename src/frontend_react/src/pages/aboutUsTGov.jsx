import React from "react";
import NavigationMenuBarTGov from "../components/NavigationMenuBarTGov";
import OurAcheivementsBlock from "../components/OurAcheivementsBlock";
import OurService from "../components/OurServiceBlock";
import WhatPeopleSay from "../components/whatpeoplesay"; // Import the WhatPeopleSay component
import ExploreComponent from "../components/exploreComponent"; // Import the ExploreComponent
import BookingSteps from "../components/processComponent";
import { useNavigate } from "react-router-dom";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

export default function AboutUsTGov() {
  const navigate = useNavigate();

  const handleRegClick = () => {
    navigate("/TourismGovHomePage");
  };

  return (
    <React.Fragment>
      <div className="min-h-screen bg-gray-50">
        <NavigationMenuBarTGov />
        <div className="full">
          <div className="frame">
            <div className="inner-container">
              <h1 className="title">DREAMS COME TRUE</h1>
              <div className="buttonR">
                <span className="buttonR-text" onClick={handleRegClick}>
                  Home Page
                </span>
              </div>
            </div>
          </div>
          <main className="w-full px-0 py-6">
            {" "}
            {/* Set the main container to full width */}
            <div className="w-full">
              <OurAcheivementsBlock />
            </div>
            <div className="w-full">
              <OurService />
            </div>
            <div className="w-full">
              <WhatPeopleSay />
            </div>
          </main>
        </div>
      </div>
      <TourismGovernerFooter />
    </React.Fragment>
  );
}
