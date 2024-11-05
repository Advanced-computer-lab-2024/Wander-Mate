import React from 'react';
// Importing required Dropdown components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu'; // Adjust path as needed
import { Button } from '../components/ui/button';
import { Icon } from '@iconify/react'; // Assuming you're using iconify for icons

// SiteLogo Component
const SiteLogo = () => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 97.11 72.85"
    className="h-20 w-20 2xl:w-28 2xl:h-28"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* SVG content here */}
  </svg>
);

// Simplified Navigation Menu Component
const NavigationMenuBar = () => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto">
      {/* Navigation Menu */}
      <div className="flex items-center">
        {/* Site Logo in Top left */}
        <SiteLogo />

        <div className="ml-6 space-x-6 flex">
          {/* First Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Destinations
                <Icon icon="heroicons:chevron-down" className="h-5 w-5 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[196px]" align="start">
              <DropdownMenuLabel>Explore Destinations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Beach Destinations</DropdownMenuItem>
              <DropdownMenuItem>Mountain Retreats</DropdownMenuItem>
              <DropdownMenuItem>City Tours</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Second Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Packages
                <Icon icon="heroicons:chevron-down" className="h-5 w-5 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[196px]" align="start">
              <DropdownMenuLabel>Available Packages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Family Packages</DropdownMenuItem>
              <DropdownMenuItem>Honeymoon Specials</DropdownMenuItem>
              <DropdownMenuItem>Adventure Tours</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Third Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                About Us
                <Icon icon="heroicons:chevron-down" className="h-5 w-5 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[196px]" align="start">
              <DropdownMenuLabel>About Us</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Our Story</DropdownMenuItem>
              <DropdownMenuItem>Meet the Team</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavigationMenuBar;
