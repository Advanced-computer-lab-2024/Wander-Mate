import React from "react";
import SellerProfileManager from "./SellerProfileInformation";
import HeaderSE from "../components/headerSE";
import SellerNavBar from "../components/sellerNavBar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const SellerHomePage = () => {
  return (
    <div>
      <SellerNavBar />
      <HeaderSE />
      <SellerProfileManager />
      <TourismGovernerFooter />
    </div>
  );
};

export default SellerHomePage;
