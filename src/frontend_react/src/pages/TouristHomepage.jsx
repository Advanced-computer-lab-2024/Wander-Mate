import React from 'react';


// Importing custom Navigation Menu components
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from '../components/ui/navigation-menu'; // Assuming the code you provided is saved as NavigationMenu.js

// Main Tourist Homepage Component
const TouristHomePage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <NavigationMenu className="flex justify-between px-6 py-4 max-w-screen-xl mx-auto">
          {/* Logo */}
          <div className="text-2xl font-bold text-primary">TourismCo</div>

          {/* Navigation Menu */}
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Destinations</NavigationMenuTrigger>
              <NavigationMenuContent className="w-[196px]" align="start">
                <div className="w-[196px]" align="start">
                  <NavigationMenuLink href="#beach">Beach Destinations</NavigationMenuLink>
                  <NavigationMenuLink href="#mountain">Mountain Retreats</NavigationMenuLink>
                  <NavigationMenuLink href="#city">City Tours</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Packages</NavigationMenuTrigger>
              <NavigationMenuContent className="w-[196px]" align="start">
                <div className="flex flex-col space-y-2">
                  <NavigationMenuLink href="#family">Family Packages</NavigationMenuLink>
                  <NavigationMenuLink href="#honeymoon">Honeymoon Specials</NavigationMenuLink>
                  <NavigationMenuLink href="#adventure">Adventure Tours</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
              <NavigationMenuContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <NavigationMenuLink href="#company">Our Story</NavigationMenuLink>
                  <NavigationMenuLink href="#team">Meet the Team</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuViewport />
          <NavigationMenuIndicator />
        </NavigationMenu>
      </header>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[60vh]" style={{ backgroundImage: 'url("https://example.com/hero-image.jpg")' }}>
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50 text-white text-center px-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore the World with Us</h1>
            <p className="text-lg md:text-2xl mb-6">Discover breathtaking destinations and unforgettable experiences.</p>
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition">Get Started</button>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-8">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Destination Cards */}
            <DestinationCard title="Maldives" description="White sandy beaches and crystal clear waters." imageUrl="https://example.com/maldives.jpg" />
            <DestinationCard title="Swiss Alps" description="Scenic mountains and winter wonderlands." imageUrl="https://example.com/swiss-alps.jpg" />
            <DestinationCard title="New York" description="The city that never sleeps." imageUrl="https://example.com/new-york.jpg" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} TourismCo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Destination Card Component
function DestinationCard({ title, description, imageUrl }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <button className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default TouristHomePage;