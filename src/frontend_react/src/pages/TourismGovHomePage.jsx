import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Icon } from "@iconify/react";
import { Button } from "../components/ui/button";
import NavigationMenuBarTGov from "../components/NavigationMenuBarTGov";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const TourismGovHomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavigationMenuBarTGov />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to TourismGov
        </h1>
        <p className="text-gray-600">
          Explore our beautiful destinations and exciting events!
        </p>
      </main>

      {/* Footer */}
      <TourismGovernerFooter />
    </div>
  );
};

export default TourismGovHomePage;
