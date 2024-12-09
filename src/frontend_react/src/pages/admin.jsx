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
import LegendEvents from "../components/QuantityChart";
import LegendEvents2 from "../components/BookingsQuantity";
import { Label } from "../components/ui/label";
import AllProductsAtAdmin from "../components/AllProductsAdminDashBoard";
import TourismGovernerFooter from "../components/tourismGovernerFooter";
import TopUsers from "../components/topUsers";
import SalesReportTable from "../components/salestableseller";
import UserStatsCard from "../components/userscard";

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminNavBar />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {/* Card for OrderCard */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <OrderCard />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <UserStatsCard />
          </div>
        </h1>
        {/* Card for LegendEvents and LegendEvents2 side by side */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-8">
            <div className="w-1/2">
              {/* Centered and larger Label for Products */}
              <div className="text-center mb-4">
                <Label className="text-2xl font-semibold">Products</Label>
              </div>
              <LegendEvents />
            </div>
            <div className="w-1/2">
              {/* Centered and larger Label for Bookings */}
              <div className="text-center mb-4">
                <Label className="text-2xl font-semibold">Bookings</Label>
              </div>
              <LegendEvents2 />
            </div>
          </div>
        </div>
        <AdminOrders />
        {/* Adding margin-top to create space between AdminOrders and AllProductsAtAdmin */}
        <div className="flex space-x-8 mt-8">
          <div className="w-1/2 mt-8">
            <AllProductsAtAdmin />
          </div>
          <div className="w-1/2 mt-8">
            <TopUsers />
          </div>
        </div>
        <br />
        <Label className="text-2xl font-semibold">Sales Table</Label>{" "}
        <SalesReportTable />
      </main>

      {/* Footer */}
      <TourismGovernerFooter />
    </div>
  );
};

export default Admin;
