
import React from 'react';
import AdminSettings from '../components/AdminSettings';

import AdminNavBar from '../components/AdminNavBar';
import photo from "../public/images/files/wideview.jpg";
import LevelAndBadge from '../components/levelAndBadge'; // Import the LevelAndBadge component

const AdminProfilePage = () => {
  // Example username for illustration
  const username = sessionStorage.getItem("username");

  return (
    <div>
      <AdminNavBar />
    
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
         
          <div className="lg:col-span-2 -mt-12 -mr-16 w-full">
            <AdminSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
