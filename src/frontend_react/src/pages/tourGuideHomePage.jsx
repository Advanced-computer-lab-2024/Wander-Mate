import React from 'react';
import TourGuideNavBar from '../components/tourGuideNavBar';
import HeaderTG from '../components/headdertourguide';

const TourGuidePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TourGuideNavBar />
      <main className="flex-grow relative">
        {/* Adjust width of HeaderTG wrapper */}
        <div className="absolute top-[-30px] left-[0.5%] w-[99%]">
          <HeaderTG />
        </div>
      </main>
    </div>
  );
};

export default TourGuidePage;

