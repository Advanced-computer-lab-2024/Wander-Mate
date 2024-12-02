import React from 'react';
import TourGuideNavBar from '../components/tourGuideNavBar';
import HeaderTG from '../components/headdertourguide';
import AdvertiserProfileManager from './AdvertiserProfileInformation';
const AdvertiserHomePage = () =>{
  
  return (
    <div className="flex flex-col min-h-screen">
      <TourGuideNavBar />
      <main className="flex-grow">
        <div className="flex flex-col">
          <div className="relative -top-6"> {/* Negative margin to move the header up */}
            <HeaderTG />
          </div>
          <div className=" relative -top-10"> {/* h-full makes it cover remaining space */}
            <AdvertiserProfileManager />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdvertiserHomePage;