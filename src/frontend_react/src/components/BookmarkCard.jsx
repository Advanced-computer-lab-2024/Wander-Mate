import React, { useState } from "react";
import BookmarkModel from "./BookmarkModel";
import { Card } from "./ui/card";

const BookmarkCard = ({ bookmark }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { event, eventModel } = bookmark;

  return (
    <BookmarkModel
      bookmark={bookmark}
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
    >
      <div
        onClick={() => setIsModalOpen(true)} // Open the modal when clicking the card
        style={{ cursor: "pointer" }} // Add pointer cursor for better UX
      >
        
          <h1>Activities</h1>
          {eventModel === "Attraction" && (
            <>
            <Card className="p-4 rounded-md cursor-pointer">
              <div className="mb-3">
              <p className="font-bold text-base mb-1">{event.Name}</p>
              <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            Date: {new Date(event.Date).toLocaleDateString()} | Time: {event.Time}
          </p>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            Category: {event.category || "Not specified"}
          </p>
              </div>
              </Card>
            </>
            
          )}
          <h1>Iternaries</h1>
          {eventModel === "Itinerary" && (
            <>
              <p>Timeline: {event.TimeLine || "N/A"}</p>
              <p>Language: {event.Language || "N/A"}</p>
              {event.PickUpLocation && (
                <p>Pickup: {event.PickUpLocation.coordinates.join(", ")}</p>
              )}
              {event.DropOffLocation && (
                <p>Dropoff: {event.DropOffLocation.coordinates.join(", ")}</p>
              )}
            </>
          )}
      </div>
    </BookmarkModel>
  );
};

export default BookmarkCard;
