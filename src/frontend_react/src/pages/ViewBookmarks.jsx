import React, { useEffect, useState } from "react";
import NavigationMenuBar from "../components/NavigationMenuBar";
import axios from "axios";
import ItineraryCard from "../components/itineraryCard";
import ActivityCard from "../components/activityCard";

const ViewBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types] = useState([]);

  const getBookmarks = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) {
        throw new Error("Username not found in session storage");
      }

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();

      const response = await axios.get(
        `http://localhost:8000/ViewBookmarkedAttractions/${userID}`
      );
      console.log(response.data.bookmarkedAttractions);
      setBookmarks(response.data.bookmarkedAttractions);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setError("Could not load places. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <React.Fragment>
      <NavigationMenuBar />
      {bookmarks.length === 0 ? (
        <div>No bookmarks found.</div>
      ) : (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Activities</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookmarks
              .filter((bookmark) => bookmark.eventModel === "Attraction")
              .map((bookmark, index) => (
                <ActivityCard
                  key={index}
                  activityId={bookmark.event._id}
                  name={bookmark.event.Name}
                  location={bookmark.event.location}
                  type={
                    types.find((t) => t._id === bookmark.event.Category)?.Name ||
                    "Unknown Category"
                  }
                  tags={bookmark.event.Tags || []}
                  price={bookmark.event.price}
                  date={bookmark.event.date}
                  time={bookmark.event.time}
                  isAvailable={bookmark.event.IsAvailable}
                  rating={bookmark.event.rating}
                />
              ))}
          </div>
          <h1 className="text-2xl font-bold my-4">Itineraries</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookmarks
              .filter((bookmark) => bookmark.eventModel === "Itinerary")
              .map((bookmark, index) => (
                <ItineraryCard
                  key={index}
                  itineraryId={bookmark.event._id}
                  name={bookmark.event.Name}
                  images={bookmark.event.images || []}
                  tags={bookmark.event.Tags || []}
                  duration={bookmark.event.duration}
                  latitude={bookmark.event.latitude}
                  longitude={bookmark.event.longitude}
                  reviews={bookmark.event.reviews}
                  TimeLine={bookmark.event.TimeLine}
                  price={bookmark.event.price}
                  AvailableDates={bookmark.event.AvailableDates}
                  Activities={bookmark.event.Activities}
                  LocationsToVisit={bookmark.event.LocationsToVisit}
                  PickUpLocation={bookmark.event.PickUpLocation}
                  DropOffLocation={bookmark.event.DropOffLocation}
                  Language={bookmark.event.Language}
                  currrn={bookmark.event.currrn}
                  rating={bookmark.event.rating}
                  Creator={bookmark.event.Creator}
                />
              ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ViewBookmarks;

