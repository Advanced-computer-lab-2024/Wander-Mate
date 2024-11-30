import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Icon } from "@iconify/react";
import { Button } from "../components/ui/button";
import AdminNavBar from "../components/AdminNavBar";
import OrderCard from "../components/orderCard";
import RevinueChart from "../components/RevinueChart";
import AdminOrders from "../components/adminOrders";
import PopularProducts from "../components/popularProducts";
const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminNavBar />

      {/* Main content */}
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
        <OrderCard />

        <RevinueChart />
        <AdminOrders/> 
        <PopularProducts/>
        </h1>
        <p className="text-gray-600">
        
        </p>
      </main>

      {/* Footer */}
      
    </div>

  );
};

export default Admin;
