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
        <div className="mt-8">
          <AllProductsAtAdmin />
        </div>
      </main>

      {/* Footer */}
    </div>
  );
};

export default Admin;
