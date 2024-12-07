"use client";
import AdminNavBar from "../components/AdminNavBar"; // Assuming AdminNavBar is already correctly imported
import Orders from "../components/adminOrders"; // Import the Orders component

const AdminOrders = () => {
  return (
    <>
      <AdminNavBar /> {/* Admin Navbar */}
      
      <div className="container mx-auto px-4 py-6"> {/* Container for layout */}
        <Orders /> {/* Include the Orders component here */}
      </div>
    </>
  );
};

export default AdminOrders;
