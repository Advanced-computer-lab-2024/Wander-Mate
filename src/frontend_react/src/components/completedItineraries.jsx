"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CompletedItineraryCard from "./completedItineraryCard";
import ECommerceDefaultSkeleton from "./ECommerceDefaultSkeleton";
import axios from "axios";

export default function CompletedItineraries() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 2,
  });
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [userid, setUserid] = useState(0);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("Username not found in session storage");

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        setUserid(userID);
        const response = await fetch(
          `http://localhost:8000/viewAttendedItineraries/${userID}`
        );
        const data = await response.json();
        console.log(data);
        setItineraries(data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  useEffect(() => {
    // Fetch all ratings when itineraries are fetched
    itineraries.forEach((itinerary) => {
      getMyRating(itinerary.itemId._id);
      getMyRating(itinerary.itemId.Creator._id);
    });
  }, [itineraries, userid]); // Runs when itineraries or userId change

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      };

      emblaApi.on("select", onSelect);
      onSelect();

      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const getMyRating = async (itienraryId) => {
    try {
      const reply = await fetch(
        `http://localhost:8000/getMyRating/${userid}/${itienraryId}`
      );
      if (!reply.ok) throw new Error("Failed to get rating");
      const data = await reply.json(); // Get the rating from the response
      setRatings((prevRatings) => ({
        ...prevRatings,
        [itienraryId]: data.rating, // Store the rating by itineraryId
      }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Featured Itineraries</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <ECommerceDefaultSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Completed Itineraries</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous itineraries"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next itineraries"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -mx-2">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary._id}
              className="flex-shrink-0 w-full md:w-1/2 px-2"
            >
              <CompletedItineraryCard
                itineraryId={itinerary.itemId._id}
                name={itinerary.itemId.Name}
                images={itinerary.itemId.LocationsToVisit.flatMap(
                  (location) => location.Pictures || []
                )}
                price={itinerary.itemId.Price}
                currrn={itinerary.itemId.Currency || "USD"}
                rating={itinerary.itemId.Ratings}
                Activities={itinerary.itemId.Activities.map(
                  (activity) => activity.Name
                )}
                LocationsToVisit={itinerary.itemId.LocationsToVisit.map(
                  (location) => location.Name
                )}
                TimeLine={itinerary.itemId.TimeLine}
                BookedDate={itinerary.bookedDate}
                PickUpLocation={itinerary.itemId.PickUpLocation}
                DropOffLocation={itinerary.itemId.DropOffLocation}
                Language={itinerary.itemId.Language}
                totalRatings={itinerary.itemId.totalRatings}
                myItRating={ratings[itinerary.itemId._id]}
                myTourRating={ratings[itinerary.itemId.Creator._id]}
                Creator={itinerary.itemId.Creator}
                reFetchratings={getMyRating}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
