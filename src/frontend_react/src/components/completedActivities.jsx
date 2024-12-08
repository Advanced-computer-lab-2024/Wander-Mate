import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CompletedActivityCard from "./completedActivityCard";
import ECommerceDefaultSkeleton from "./ECommerceDefaultSkeleton";
import axios from "axios";

export default function CompletedActivities() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 2,
  });
  const [activities, setActivities] = useState([]); // Ensure it's an array
  const [loading, setLoading] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [userid, setUserid] = useState(0);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("Username not found in session storage");

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        setUserid(userID);
        const response = await fetch(
          `http://localhost:8000/viewAttendedActivities/${userID}`
        );
        const data = await response.json();

        // Ensure the response is an array
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    // Fetch all ratings when activities are fetched
    activities.forEach((activity) => {
      getMyRating(activity.itemId._id);
      getMyRating(activity.itemId.Creator._id);
    });
  }, [activities, userid]);

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

  const getMyRating = async (activityId) => {
    try {
      const reply = await fetch(
        `http://localhost:8000/getMyRating/${userid}/${activityId}`
      );
      if (!reply.ok) throw new Error("Failed to get rating");
      const data = await reply.json();
      setRatings((prevRatings) => ({
        ...prevRatings,
        [activityId]: data.rating,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Completed Activities</h1>
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
        <h1 className="text-2xl font-bold">Completed Activities</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous activities"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next activities"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -mx-2">
          {Array.isArray(activities) &&
            activities.map((activity) => (
              <div
                key={activity._id}
                className="flex-shrink-0 w-full md:w-1/2 px-2"
              >
                <CompletedActivityCard
                  activityId={activity.itemId._id}
                  name={activity.itemId.Name}
                  price={activity.itemId.Price}
                  currrn={activity.itemId.Currency || "USD"}
                  rating={activity.itemId.Ratings}
                  TimeLine={activity.itemId.TimeLine}
                  BookedDate={activity.bookedDate}
                  Language={activity.itemId.Language}
                  totalRatings={activity.itemId.Ratings}
                  myItRating={ratings[activity.itemId._id]}
                  myTourRating={ratings[activity.itemId.Creator._id]}
                  Creator={activity.itemId.Creator}
                  reFetchratings={getMyRating}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
