import React from 'react';
import TourGuideNavBar from '../components/tourGuideNavBar';
import HeaderTG from '../components/headdertourguide';
import TourGuideProfileManager from './TourGuideProfileManager';

const TourGuidePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TourGuideNavBar />
      <main className="flex-grow">
        <div className="flex flex-col">
          <div className="relative -top-6"> {/* Negative margin to move the header up */}
            <HeaderTG />
          </div>
          <div className="mt-8 ml-0 px-4 h-full"> {/* h-full makes it cover remaining space */}
            <TourGuideProfileManager />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourGuidePage;
