import React, { useEffect, useState } from "react";
import NavigationMenuBar from "../components/NavigationMenuBar";
import axios from "axios";
import ItineraryCard from "../components/itineraryCard";
import ActivityCard from "../components/activityCard";
import PlaceCard from "../components/placeCard";

const ViewBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [tagMap, setTagMap] = useState({});
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/getCategories");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:8000/readHistoricalTags");
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
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const c = sessionStorage.getItem("curr");
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${c}`
      );
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  useEffect(() => {
    getBookmarks();
    fetchExchangeRates();
    fetchTags();
    fetchCategories();
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
          <h1 className="text-2xl font-bold mb-4">Places</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookmarks
              .filter((bookmark) => bookmark.eventModel === "Attraction")
              .flatMap((bookmark) =>
                bookmark.event
                  .filter((event) => event.Type !== "67025cb6bb14549b7e29f376")
                  .map((event, index) => (
                    <PlaceCard
                      key={`${bookmark._id}-${index}`}
                      placeId={event._id}
                      name={event.Name}
                      location={event.Location.coordinates}
                      images={event.Pictures}
                      description={event.Description}
                      tags={event.Tags.map((tagId) => tagMap[tagId])}
                      category={
                        categories.find((cat) => cat._id === event.Category)
                          ?.Name || "No Category"
                      }
                      latitude={event.Location.coordinates[0]}
                      longitude={event.Location.coordinates[1]}
                      ratings={[]}
                      reviews={[]}
                      TicketPrices={(
                        event.TicketPrices / (exchangeRates[currency] || 1)
                      ).toFixed(2)}
                      currency={currency}
                    />
                  ))
              )}
          </div>

          <h1 className="text-2xl font-bold my-4">Activities</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookmarks
              .filter((bookmark) => bookmark.eventModel === "Attraction")
              .flatMap((bookmark) =>
                bookmark.event
                  .filter((event) => event.Type === "67025cb6bb14549b7e29f376")
                  .map((event, index) => (
                    <ActivityCard
                      key={`${bookmark._id}-${index}`}
                      activityId={event._id}
                      name={event.Name}
                      location={event.Location}
                      type={
                        types.find((t) => t._id === event.Category)?.Name ||
                        "Unknown Category"
                      }
                      category={
                        categories.find((cat) => cat._id === event.Category)
                          ?.Name || "No Category"
                      }
                      tags={event.Tags.map((tagId) => tagMap[tagId])}
                      price={event.price}
                      date={event.Date}
                      time={event.Time}
                      isAvailable={event.IsAvailable}
                      rating={event.rating}
                    />
                  ))
              )}
          </div>

          <h1 className="text-2xl font-bold my-4">Itineraries</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookmarks
              .filter((bookmark) => bookmark.eventModel === "Itinerary")
              .flatMap((bookmark) =>
                bookmark.event.map((event, index) => (
                  <ItineraryCard
                    key={`${bookmark._id}-${index}`}
                    itineraryId={event._id}
                    name={event.Name}
                    images={event.LocationsToVisit.flatMap(
                      (location) => location.Pictures || []
                    )}
                    tags={[
                      ...event.LocationsToVisit.flatMap(
                        (location) => location.Tags || []
                      ),
                      ...event.Activities.flatMap(
                        (activity) => activity.Tags || []
                      ),
                    ].map((tagId) => tagMap[tagId])}
                    price={(
                      event.Price / (exchangeRates[currency] || 1)
                    ).toFixed(2)}
                    currrn={sessionStorage.getItem("curr")}
                    rating={event.Ratings}
                    Activities={event.Activities.map(
                      (activity) => activity.Name
                    )}
                    LocationsToVisit={event.LocationsToVisit.map(
                      (location) => location.Name
                    )}
                    TimeLine={event.TimeLine}
                    AvailableDates={event.AvailableDates}
                    PickUpLocation={event.PickUpLocation}
                    DropOffLocation={event.DropOffLocation}
                    Language={event.Language}
                    Creator={event.Creator}
                  />
                ))
              )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ViewBookmarks;
