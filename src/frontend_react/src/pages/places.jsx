import { useState, useEffect } from "react";
import PlaceCard from "../components/placeCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton"; 


const Places = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagMap, setTagMap] = useState({}); // New state for tag mapping
  const [loading, setLoading] = useState(true);

  const fetchImages = async (activityId)=> {
    try {
      const response = await fetch(`http://localhost:8000/getPlaceImage/${activityId}`);
      console.log(response);
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Error fetching images for place:", activityId);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    return [];
  }

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/getCategories");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Could not load categories. Please try again later.");
    }
  };

  // Fetch tags from the backend
  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:8000/readHistoricalTags");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const tagMapping = {};
      data.forEach(tag => {
        tagMapping[tag._id] = tag.Name; // Create a mapping of tag ID to tag name
      });
      setTags(data);
      setTagMap(tagMapping); // Set the mapping state
    } catch (error) {
      console.error("Error fetching tags:", error);
      alert("Could not load tags. Please try again later.");
    }
  };

  // Fetch places from the backend
  const fetchPlaces = async () => {
    try {
      const response = await fetch("http://localhost:8000/readPlaces");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const placesWithImages = await Promise.all(data.map(async (place) => {
        const images = await fetchImages(place._id); // Fetch images using the place's ID
        return {
          ...place,
          images, // Add images to the place object
        };
      }));
      setPlaces(placesWithImages);
    } catch (error) {
      console.error("Error fetching places:", error);
      alert("Could not load places. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchTags();
      await fetchPlaces();
    };
    
    fetchData();
  }, []);

  // Filter places based on search term, selected category, and selected tags
  const filteredPlaces = places.filter(place => {
    const matchesName = place.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? place.Category === selectedCategory : true;
    const matchesTags = selectedTags.length > 0 ? selectedTags.every(tag => place.Tags.includes(tag)) : true;

    return matchesName && matchesCategory && matchesTags;
  });

  // Event handlers for input changes
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleTagChange = (tagId) => {
    setSelectedTags((prevTags) => 
      prevTags.includes(tagId) ? prevTags.filter(t => t !== tagId) : [...prevTags, tagId]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Places</h1>

      {/* Flex container for search and filters */}
      <div className="flex space-x-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by place name"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-full max-w-xs"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-1 rounded w-48"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.Name}</option>
          ))}
        </select>
      </div>

      {/* Tag Filter */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Select Tags:</h2>
        <div className="flex flex-wrap space-x-4">
          {tags.map(tag => (
            <div key={tag._id} className="flex items-center">
              <input
                type="checkbox"
                id={`tag-${tag._id}`}
                value={tag._id}
                checked={selectedTags.includes(tag._id)}
                onChange={() => handleTagChange(tag._id)}
                className="mr-2"
              />
              <label htmlFor={`tag-${tag._id}`}>{tag.Name}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <ECommerceDefaultSkeleton key={index} />
            ))
          : filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <PlaceCard
                  key={place._id} // Assuming each place has a unique _id
                  name={place.Name} // Replace with the correct property
                  images={place.Pictures} // Adjust based on your API response
                  description={place.Description} // Adjust based on your API response
                  tags={place.Tags.map(tagId => tagMap[tagId])} // Map tag IDs to names
                  category={categories.find(cat => cat._id === place.Category)?.Name || "No Category"} // Use find to get category name
                />
              ))
            ) : (
              <p>No places found</p>
            )}
      </div>
    </div>
  );
};

export default Places;
