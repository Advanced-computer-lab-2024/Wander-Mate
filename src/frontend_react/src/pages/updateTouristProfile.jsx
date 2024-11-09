import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Icon } from '@iconify/react';
import SiteLogo from '../components/NavigationMenuBar'; // Assuming you've moved SiteLogo to its own file

import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuItem 
  } from '@radix-ui/react-dropdown-menu';
  

// Dropdown Component to simplify creating menus
const Dropdown = ({ title, items }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="soft" color="secondary">
        {title}
        <Icon icon="heroicons:chevron-down" className="h-5 w-5 ml-2" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-[196px]" align="start">
      <DropdownMenuLabel>{title}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {items.map((item, index) => (
        <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Navigation Bar Component
const NavigationMenuBar = () => (
  <header className="w-full bg-white shadow-lg sticky top-0 z-50 flex justify-between items-center px-6 py-4 mx-auto">
    {/* Logo */}
    <SiteLogo />

    {/* Centered Dropdown Menus */}
    <div className="ml-6 flex justify-center items-center space-x-6 h-full">
      <Dropdown title="Destinations" items={["Beach Destinations", "Mountain Retreats", "City Tours"]} />
      <Dropdown title="Packages" items={["Family Packages", "Honeymoon Specials", "Adventure Tours"]} />
      <Dropdown title="About Us" items={["Our Story", "Meet the Team"]} />
    </div>

    {/* User Actions Section */}
    <UserActions />
  </header>
);

// User Actions Component
const UserActions = () => (
  <div className="flex items-center space-x-2">
    {/* Cart Icon */}
    <Link to="/cart">
      <button className="text-gray-600 hover:text-gray-800 focus:outline-none p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
          {/* SVG Path for Cart Icon */}
          <path fill="currentColor" d="M16 18a2 2 0 0 1 2 2 ... other paths here ..."></path>
        </svg>
      </button>
    </Link>

    {/* User Avatar with Dropdown */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="/path/to/user-image.jpg" alt="User Name" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default NavigationMenuBar;
