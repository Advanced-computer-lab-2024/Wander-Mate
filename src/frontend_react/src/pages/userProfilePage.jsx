"use client";
import React from "react";
import TouristPreferenceTags from "../components/TouristPrefrenceTags";
import TouristSettings from "../components/TouristSettings";
import NavigationMenuBar from "../components/NavigationMenuBar";
import HeaderT from "../components/headerT";
import LevelAndBadge from "../components/levelAndBadge"; // Import the LevelAndBadge component
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const UserProfilePage = () => {
  // Example username for illustration
  const username = sessionStorage.getItem("username");

  return (
    <div>
      <NavigationMenuBar />

      <div className="w-full px-0 py-0">
        {/* Move HeaderT slightly up */}
        <div className="mt-[-23px]">
          <HeaderT />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* First Component - Move up a little bit */}
          <div className="lg:col-span-2 -mt-12 -mr-16">
            <TouristSettings />
          </div>

          {/* Second Component - Move up and left */}
          <div className="lg:col-span-1 flex justify-start">
            <div className="w-full lg:w-[158%] mt-[-24px] ml-[-300px]">
              <TouristPreferenceTags />

              {/* Position LevelAndBadge directly below TouristPreferenceTags */}
              <div className="mt-4">
                <LevelAndBadge /> {/* Add the LevelAndBadge component here */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TourismGovernerFooter />
    </div>
  );
};

export default UserProfilePage;
