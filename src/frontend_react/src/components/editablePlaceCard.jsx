import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import EditablePlaceModal from "./editablePlaceModel";
import { Ticket } from "lucide-react";

export default function EditablePlaceCard({
  placeId,
  name,
  images = [],
  description,
  tags,
  category,
  latitude,
  longitude,
  ratings,
  reviews,
  location,
  bestTimeToVisit,
  nearbyAttractions,
  TicketPrices,
  currency,
  OpeningHours,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) {
          console.log("No username found in session storage");
          setFavorite(false); // Set to false if no user is logged in
          return;
        }

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        const response = await fetch(
          `http://localhost:8000/checkIfEventBookmarked`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userID,
              eventId: placeId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setFavorite(data);
      } catch (error) {
        console.error("Error fetching favorite status:", error);
        setFavorite(false); // Set to false in case of any error
      }
    };

    if (placeId !== null) {
      // Only fetch if itineraryId is available
      fetchFavorite();
    }
  }, [placeId]);

  const place = {
    placeId,
    name,
    image:
      images.length > 0
        ? images[0].data
          ? `data:${images[0].contentType};base64,${images[0].data}`
          : images[0]
        : "/placeholder.svg?height=300&width=300",
    images: images.map((img) =>
      img.data ? `data:${img.contentType};base64,${img.data}` : img
    ),
    TicketPrices,
    description,
    category,
    ratings,
    reviews,
    location,
    bestTimeToVisit,
    nearbyAttractions,
    latitude,
    longitude,
    currency,
  };

  return (
    <EditablePlaceModal
      place={place}
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      favorite={favorite === null ? false : favorite}
      setFavorite={setFavorite}
    >
      <Card
        className="p-4 rounded-md cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-[191px] mb-3 rounded-md overflow-hidden">
          <Carousel>
            <CarouselContent>
              {images.length > 0 ? (
                images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-full flex items-center justify-center bg-default-100 dark:bg-default-200">
                      <img
                        className="max-h-[191px] w-auto object-cover transition-all duration-300"
                        src={
                          image.data
                            ? `data:${image.contentType};base64,${image.data}`
                            : image
                        }
                        alt={`${name} image ${index + 1}`}
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="flex items-center justify-center h-full">
                    <img
                      src="/placeholder.svg?height=191&width=191"
                      alt="Placeholder"
                      className="max-h-[191px] w-auto"
                    />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-600" />
                <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-600" />
              </>
            )}
          </Carousel>
        </div>
        <div>
          <p className="font-bold text-base mb-1">{name}</p>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2 line-clamp-2">
            {description}
          </p>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            Category: {category}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags && tags.length > 0 ? (
              tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              <div className="w-full h-4" /> // Add a space equivalent to the height of a badge
            )}
          </div>

          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon="ph:star-fill"
                className={`w-4 h-4 ${
                  i < Math.floor(ratings) ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{ratings}</span>
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            <Icon icon="ph:info" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            Show More Details
          </Button>
        </div>
      </Card>
    </EditablePlaceModal>
  );
}
