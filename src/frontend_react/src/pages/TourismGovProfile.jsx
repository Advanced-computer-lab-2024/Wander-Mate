
import React from 'react';
import TGovSettings from '../components/TGovSettings';
import HeaderAdmin from '../components/headeradmin';
import NavigationMenuBarTGov from '../components/NavigationMenuBarTGov';


const TourismGovProfile = () => {
  // Example username for illustration
  const username = sessionStorage.getItem("username");

  return (
    <div>
      <NavigationMenuBarTGov />
    
      <div className="w-full px-0 py-0">
        {/* Top Banner with full-width image */}
        <div className="mt-[-23px]">
          <HeaderAdmin />
        </div>
  
        {/* Main Content */}
      <div className="w-full max-w-8xl mx-auto space-y-10">
        <TGovSettings/>
      </div>
        </div>
      </div>
  );
};

export default TourismGovProfile;
