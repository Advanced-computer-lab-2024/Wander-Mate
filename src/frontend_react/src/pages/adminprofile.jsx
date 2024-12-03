
import React from 'react';
import AdminSettings from '../components/AdminSettings';
import HeaderAdmin from '../components/headeradmin';
import AdminNavBar from '../components/AdminNavBar';


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
