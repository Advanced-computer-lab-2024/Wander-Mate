import React, { useState, useEffect } from "react";
import PlaceCard from "../components/placeCard"; // Make sure this points to your card component
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";  // Ensure this points to your loading skeleton component

const ViewItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredItineraries, setFilteredItineraries] = useState(itineraries);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch("http://localhost:8000/viewItineraries"); // Update the endpoint URL
        const data = await response.json();
        setItineraries(data);
        setFilteredItineraries(data); // Initialize filtered itineraries
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = itineraries.filter(itinerary =>
      itinerary.Activities.some(activity =>
        activity.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setFilteredItineraries(filtered);
  };

  // (Optional) Handle category change if you have categories for itineraries
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    const filtered = itineraries.filter(itinerary =>
      itinerary.Category === categoryId // Assuming you have a Category property
    );
    setFilteredItineraries(filtered);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ECommerceDefaultSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Itineraries</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by activity name"
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded w-full max-w-xs mb-4"
      />

      {/* Category Filter - optional if you have categories */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="border p-1 rounded w-48 mb-4"
      >
        <option value="">All Categories</option>
        {/* Populate categories here if needed */}
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItineraries.length > 0 ? (
          filteredItineraries.map((itinerary) => (
            <PlaceCard
              key={itinerary._id} // Unique ID for each itinerary
              name={itinerary.Name} // Adjust based on your itinerary data
              images={itinerary.Images} // Adjust based on your API response
              description={itinerary.Description} // Adjust based on your API response
              activities={itinerary.Activities.map(activity => activity.name)} // Extract activity names
              locations={itinerary.LocationsToVisit.map(location => location.name)} // Extract location names
            />
          ))
        ) : (
          <p>No itineraries found</p>
        )}
      </div>
    </div>
  );
};

export default ViewItineraries;
