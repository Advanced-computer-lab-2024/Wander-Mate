import React, { useState, useEffect } from "react";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton"; // Ensure this points to your loading skeleton component
import ItineraryCard from "../components/itineraryCard";
const ViewItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredItineraries, setFilteredItineraries] = useState(itineraries);
  const [tags, setTags] = useState([]);
  const [tagMap, setTagMap] = useState({});
  const [categories, setCategories] = useState([]);

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
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/readHistoricalTags"
        );
        const reply = await fetch("http://localhost:8000/readPreferenceTags");
        if (!response.ok || !reply.ok)
          throw new Error("Network response was not ok");
        const data = await response.json();
        const data2 = await reply.json();
        const tagMapping = {};
        data.forEach((tag) => {
          tagMapping[tag._id] = tag.Name; // Create a mapping of tag ID to tag name
        });
        data2.forEach((tag) => {
          tagMapping[tag._id] = tag.Name;
        });
        setTags([...data, ...data2]);
        setTagMap(tagMapping); // Set the mapping state
      } catch (error) {
        console.error("Error fetching tags:", error);
        alert("Could not load tags. Please try again later.");
      }
    };
    
    fetchTags();
    fetchItineraries();
  }, []);

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = itineraries.filter((itinerary) =>
      itinerary.Activities.some((activity) =>
        activity.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setFilteredItineraries(filtered);
  };

  // (Optional) Handle category change if you have categories for itineraries
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    const filtered = itineraries.filter(
      (itinerary) => itinerary.Category === categoryId // Assuming you have a Category property
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

      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItineraries.length > 0 ? (
          filteredItineraries.map((itinerary) => {
            const placeImages = itinerary.LocationsToVisit.flatMap(
              (location) => location.Pictures || []
            );
            const placeTags = itinerary.LocationsToVisit.flatMap(
              (location) => location.Tags || []
            );
            const activityTags = itinerary.Activities.flatMap(
              (activity) => activity.Tags || []
            );

            const combinedTags = [...placeTags, ...activityTags];
            console.log(itinerary);

            return (
              <ItineraryCard
                key={itinerary._id} // Unique ID for each itinerary
                name={itinerary.Name} // Adjust based on your itinerary data
                images={placeImages} // Combine images from Places and Activities
                description={itinerary.Description} // Adjust based on your API response
                activities={itinerary.Activities.map(
                  (activity) => activity.name
                )}
                locations={itinerary.LocationsToVisit.map(
                  (location) => location.name
                )}
                tags={combinedTags.map((tagId) => tagMap[tagId])} // Combine tags from Places and Activities
              />
            );
          })
        ) : (
          <p>No itineraries found</p>
        )}
      </div>
    </div>
  );
};

export default ViewItineraries;
