import React from 'react'
import NavigationMenuBar from "../components/NavigationMenuBar"
import OurAcheivementsBlock from "../components/OurAcheivementsBlock"
import OurService from "../components/OurServiceBlock"
import WhatPeopleSay from "../components/whatpeoplesay" // Import the WhatPeopleSay component
import ExploreComponent from "../components/exploreComponent" // Import the ExploreComponent
import BookingSteps from "../components/processComponent"
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
    
    const navigate = useNavigate();
    
      const handleRegClick = () => {
        navigate("/products");
      };
    
  return (
   
    <div className="min-h-screen bg-gray-50">
      <NavigationMenuBar />
      <div className="full">
    <div className="frame">
      <div className="inner-container">
        <h1 className="title">QUALITY & PASSION</h1>
        <div className="buttonR">
          <span className="buttonR-text" onClick={handleRegClick}>
            Products
          </span>
        </div>
      </div>
    </div>
      <main className="w-full px-0 py-6"> {/* Set the main container to full width */}
        <div className="w-full">
          <OurAcheivementsBlock />
        </div>
        <div className="w-full">
          <OurService />
        </div>
        <div className="w-full">
          <WhatPeopleSay />
        </div>
        <div className="w-full">
          <ExploreComponent />
        </div>
        <div className="w-full">
          <BookingSteps />
        </div>
      </main>
    </div>
    </div>
  )
}
