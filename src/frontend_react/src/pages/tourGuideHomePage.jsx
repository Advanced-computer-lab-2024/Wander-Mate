import React from "react";
import TourGuideNavBar from "../components/tourGuideNavBar";
import HeaderTG from "../components/headdertourguide";
import TourGuideProfileManager from "./TourGuideProfileManager";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const TourGuidePage = () => {
  return (
    <React.Fragment>
      <div className="flex flex-col min-h-screen">
        <TourGuideNavBar />
        <main className="flex-grow">
          <div className="flex flex-col">
            <div className="relative -top-6">
              {" "}
              {/* Negative margin to move the header up */}
              <HeaderTG />
            </div>
            <div className=" relative -top-0">
              {" "}
              {/* h-full makes it cover remaining space */}
              <TourGuideProfileManager />
            </div>
          </div>
        </main>
      </div>
      <TourismGovernerFooter />
    </React.Fragment>
  );
};

export default TourGuidePage;
