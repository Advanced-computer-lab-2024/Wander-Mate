import React from "react";
import AdminSettings from "../components/AdminSettings";
import HeaderAdmin from "../components/headeradmin";
import AdminNavBar from "../components/AdminNavBar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const AdminProfilePage = () => {
  // Example username for illustration
  const username = sessionStorage.getItem("username");

  return (
    <div>
      <AdminNavBar />

      <div className="w-full px-0 py-0">
        {/* Top Banner with full-width image */}
        <div className="mt-[-23px]">
          <HeaderAdmin />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-8xl mx-auto space-y-10">
          <AdminSettings />
        </div>
      </div>
      <TourismGovernerFooter />
    </div>
  );
};

export default AdminProfilePage;
