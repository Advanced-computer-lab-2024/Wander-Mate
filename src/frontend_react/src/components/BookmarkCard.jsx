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
        <Card>
          <h2>{event.Name || "Unnamed Event"}</h2>
          <p>Price: ${event.Price || "N/A"}</p>
          {eventModel === "Attraction" && (
            <>
              <p>Type: {event.Category || "N/A"}</p>
              <p>Date: {new Date(event.Date).toLocaleDateString() || "N/A"}</p>
              {event.Location && (
                <p>Location: {event.Location.coordinates.join(", ")}</p>
              )}
            </>
          )}
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
        </Card>
      </div>
    </BookmarkModel>
  );
};

export default BookmarkCard;
