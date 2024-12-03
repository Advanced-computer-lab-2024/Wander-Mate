import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
const AdvertiserFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">About WanderMate</h3>
            <p className="text-gray-400">
            Your Traveling Best Mate
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Icon icon="mdi:facebook" className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Icon icon="mdi:twitter" className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Icon icon="mdi:instagram" className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2024 WanderMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AdvertiserFooter;
