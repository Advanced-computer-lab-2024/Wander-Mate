import React, { useCallback } from "react";
import NavigationMenuBar from "../components/NavigationMenuBar";
import axios from "axios";
import ItineraryCard from "../components/itineraryCard";
import ActivityCard from "../components/activityCard";
import PlaceCard from "../components/placeCard";
import useEmblaCarousel from "embla-carousel-react";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const EmblaCarousel = ({ children, title }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>
    </div>
  );
};

const ViewBookmarks = () => {
  const [bookmarks, setBookmarks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [types] = React.useState([]);
  const [currency, setCurrency] = React.useState("USD");
  const [exchangeRates, setExchangeRates] = React.useState({});
  const [tagMap, setTagMap] = React.useState({});
  const [tags, setTags] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

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

  React.useEffect(() => {
    getBookmarks();
    fetchExchangeRates();
    fetchTags();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <ECommerceDefaultSkeleton />
      </div>
    );
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
        <div className="container mx-auto p-4 space-y-8">
          <EmblaCarousel title="Places">
            {bookmarks
              .filter((bookmark) => bookmark.eventModel === "Attraction")
              .flatMap((bookmark) =>
                bookmark.event
                  .filter((event) => event.Type !== "67025cb6bb14549b7e29f376")
                  .map((event, index) => (
                    <div
                      key={`${bookmark._id}-${index}`}
                      className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4"
                    >
                      <PlaceCard
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
                        TicketPrices={
                          event.TicketPrices && event.TicketPrices.length > 0
                            ? JSON.parse(event.TicketPrices[0]).map(([type, price]) => ({
                                type,
                                price: (parseFloat(price) / (exchangeRates[currency] || 1)).toFixed(2)
                              }))
                            : []
                        }
                        currency={currency}
                      />
                    </div>
                  ))
              )}
          </EmblaCarousel>

          <EmblaCarousel title="Activities">
            {bookmarks
              .filter((bookmark) => bookmark.eventModel === "Attraction")
              .flatMap((bookmark) =>
                bookmark.event
                  .filter((event) => event.Type === "67025cb6bb14549b7e29f376")
                  .map((event, index) => (
                    <div
                      key={`${bookmark._id}-${index}`}
                      className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4"
                    >
                      <ActivityCard
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
                    </div>
                  ))
              )}
          </EmblaCarousel>

          <EmblaCarousel title="Itineraries">
            {bookmarks
              .filter((bookmark) => bookmark.eventModel === "Itinerary")
              .flatMap((bookmark) =>
                bookmark.event.map((event, index) => (
                  <div
                    key={`${bookmark._id}-${index}`}
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4"
                  >
                    <ItineraryCard
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
                  </div>
                ))
              )}
          </EmblaCarousel>
        </div>
      )}
      <TourismGovernerFooter />
    </React.Fragment>
  );
};

export default ViewBookmarks;
