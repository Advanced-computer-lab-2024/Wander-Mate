import React, { useEffect, useState } from "react";
import ItineraryCard from "./itineraryCard"; // Use your ItineraryCard-like component
import { Button } from "./ui/button";
import ECommerceDefaultSkeleton from "./ECommerceDefaultSkeleton";
import ItineraryCardGuest from "./itineraryCardGuest";

const ExploreComponent = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [tagMap, setTagMap] = useState({});

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch("http://localhost:8000/viewItineraries");
        const data = await response.json();
        setItineraries(data.slice(0, 3)); // Fetch only the first 3 itineraries
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
          tagMapping[tag._id] = tag.Name;
        });
        data2.forEach((tag) => {
          tagMapping[tag._id] = tag.Name;
        });
        setTags([...data, ...data2]);
        setTagMap(tagMapping);
      } catch (error) {
        console.error("Error fetching tags:", error);
        alert("Could not load tags. Please try again later.");
      }
    };

    fetchTags();
    fetchItineraries();
  }, []);

  const handleDiscoverMore = () => {
    // Redirect to View Itineraries page (adjust the navigation logic as per your setup)
    window.location.href = "/viewItineraries"; // Replace with your routing mechanism if needed
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Explore Our Best Packages</h1>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <ECommerceDefaultSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {itineraries.map((itinerary) =>
            !itinerary.isFlagged ? (
              <ItineraryCardGuest
                key={itinerary._id}
                itineraryId={itinerary._id}
                name={itinerary.Name}
                images={
                  itinerary.LocationsToVisit.flatMap(
                    (location) => location.Pictures || []
                  ) || []
                }
                tags={[
                  ...itinerary.LocationsToVisit.flatMap(
                    (location) => location.Tags || []
                  ),
                  ...itinerary.Activities.flatMap(
                    (activity) => activity.Tags || []
                  ),
                ].map((tagId) => tagMap[tagId])}
                duration={itinerary.Duration || "Unknown Duration"}
                latitude={itinerary.LocationsToVisit[0]?.Latitude || null}
                longitude={itinerary.LocationsToVisit[0]?.Longitude || null}
                reviews={itinerary.Reviews || []}
                TimeLine={itinerary.TimeLine}
                price={itinerary.Price}
                AvailableDates={itinerary.AvailableDates}
                Activities={itinerary.Activities.map(
                  (activity) => activity.Name
                )}
                LocationsToVisit={itinerary.LocationsToVisit.map(
                  (location) => location.Name
                )}
                PickUpLocation={itinerary.PickUpLocation}
                DropOffLocation={itinerary.DropOffLocation}
                Language={itinerary.Language}
                Creator={itinerary.Creator}
              />
            ) : (
              <></>
            )
          )}
        </div>
      )}
      <div className="text-center mt-6">
        <Button className="rounded-full px-8" onClick={handleDiscoverMore}>
          Discover More
        </Button>
      </div>
    </div>
  );
};

export default ExploreComponent;
