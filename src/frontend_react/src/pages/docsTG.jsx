import React from "react";
import TourGuideNavBar from "../components/tourGuideNavBar";
import HeaderTG from "../components/headdertourguide";
import ViewPDFModel from "../components/viewPDFModel"; // Import ViewPDFModel
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const TourGuideDocs = () => {
  return (
    <React.Fragment>
      <div className="flex flex-col min-h-screen">
        <TourGuideNavBar />
        <main className="flex-grow relative">
          {/* Adjust width of HeaderTG wrapper */}
          <div className="absolute top-[-30px] left-[0.5%] w-[99%]">
            <HeaderTG />
          </div>

          {/* Add the ViewPDFModel component here */}
          <div className="absolute top-[275px] left-[0.5%] w-[99%]">
            {" "}
            {/* Add margin to ensure content is below the header */}
            <ViewPDFModel /> {/* Add ViewPDFModel to render it */}
          </div>
        </main>
      </div>
      <TourismGovernerFooter />
    </React.Fragment>
  );
};

export default TourGuideDocs;
