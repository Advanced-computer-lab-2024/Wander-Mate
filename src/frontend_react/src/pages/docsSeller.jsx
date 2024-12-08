import React from "react";
import SellerNavBar from "../components/sellerNavBar";
import HeaderSE from "../components/headerSE";
import ViewPDFModelSeller from "../components/viewPDFModelSeller"; // Import ViewPDFModel
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const SellerDocs = () => {
  return (
    <React.Fragment>
      <div className="flex flex-col min-h-screen">
        <SellerNavBar />
        <main className="flex-grow relative">
          <HeaderSE />
          {/* Add the ViewPDFModel component here */}
          <div className="absolute top-[275px] w-[100%]">
            {" "}
            {/* Add margin to ensure content is below the header */}
            <ViewPDFModelSeller /> {/* Add ViewPDFModel to render it */}
          </div>
        </main>
      </div>
      <TourismGovernerFooter />
    </React.Fragment>
  );
};

export default SellerDocs;
