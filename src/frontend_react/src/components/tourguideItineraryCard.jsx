import React, { useState } from "react";
import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import BasicMap from "./ui/basic-map"; // Import the map component

import EditableItineraryModel from "./editableItineraryModel";
const TourGuideItineraryCard = ({
  itineraryId,
  name,
  images = [],
  tags,
  duration,
  latitude,
  longitude,
  reviews,
  TimeLine,
  price,
  AvailableDates,
  Activities,
  LocationsToVisit,
  PickUpLocation,
  DropOffLocation,
  Language,
  currrn,
  rating,
  Creator,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itinerary = {
    itineraryId,
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
    duration,
    latitude,
    longitude,
    reviews,
    TimeLine,
    price,
    AvailableDates,
    Activities,
    LocationsToVisit,
    PickUpLocation,
    DropOffLocation,
    Language,
    currrn,
    rating,
    Creator,
  };

  return (
    <>
      {/* Modal for Itinerary Details */}
      <EditableItineraryModel
        cur={currrn}
        itinerary={itinerary}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      >
        <Card className="p-4 rounded-md cursor-pointer">
          <div
            className="relative h-[191px] mb-3 rounded-md overflow-hidden"
            onClick={() => setIsModalOpen(true)} // Open modal when clicking on the image
          >
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
                  <div className="flex items-center justify-center h-full">
                    <p>No images available</p>
                  </div>
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

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag, index) => (
                  <Badge key={index} color="primary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <Button
              className="w-full"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering image click
                setIsModalOpen(true);
              }}
            >
              <Icon icon="ph:info" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
              Show More Details
            </Button>
          </div>
        </Card>
      </EditableItineraryModel>
    </>
  );
};

export default TourGuideItineraryCard;
