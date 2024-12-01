'use client';
import React from 'react';
import TouristPreferenceTags from "../components/TouristPrefrenceTags";
import TouristSettings from '../components/TouristSettings';
import NavigationMenuBar from '../components/NavigationMenuBar';
import photo from "../public/images/files/wideview.jpg";
import LevelAndBadge from '../components/levelAndBadge'; // Import the LevelAndBadge component

const UserProfilePage = () => {
  // Example username for illustration
  const username = sessionStorage.getItem("username");

  return (
    <div>
      <NavigationMenuBar />
    
      <div className="w-full px-0 py-0">
        {/* Top Banner with full-width image */}
        <div className="relative w-full h-[150px]">
          <div className="absolute inset-0">
            <img
              src={photo}
              alt="Profile Banner"
              className="w-full h-full object-cover opacity-100"
            />
          </div>
          <div className="absolute bottom-4 left-4 text-white font-semibold text-xl">
            {username}
          </div>
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
    </div>
  );
};

export default UserProfilePage;
