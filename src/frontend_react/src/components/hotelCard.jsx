import React, { useState } from "react";
import { Star, DollarSign, Shield, Award } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";
import HotelModal from "./hotelModel";

const HotelCard = ({
  id,
  title,
  price,
  rating,
  provider,
  cardPhotos = [],
  cancellationPolicy,
  sponsor,
  checkInDate, // Destructure this prop
  checkOutdate, // Destructure this prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hotel = {
    id,
    title,
    price,
    rating,
    provider,
    cardPhotos,
    cancellationPolicy,
    sponsor,
  };

  return (
    <>
      <Card className="p-4 rounded-md cursor-pointer h-full flex flex-col">
        <div className="relative h-[191px] mb-3 rounded-md overflow-hidden">
          <Carousel>
            <CarouselContent>
              {cardPhotos.length > 0 ? (
                cardPhotos.map((photo, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-full flex items-center justify-center bg-default-100 dark:bg-default-200">
                      <img
                        className="max-h-[191px] w-auto object-cover transition-all duration-300"
                        src={photo}
                        alt={`${title} image ${index + 1}`}
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
            {cardPhotos.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-600" />
                <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-600" />
              </>
            )}
          </Carousel>
          {sponsor && (
            <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900">
              <Award className="w-3 h-3 mr-1" />
              {sponsor}
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-col flex-1">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 mr-1" />
              <span className="text-2xl font-bold">{price}</span>
              <span className="text-sm text-muted-foreground ml-1">
                per night
              </span>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="text-sm font-semibold">{rating || "N/A"}</span>
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            <Shield className="w-4 h-4 mr-1" />
            <span className="ml-1">
              Cancellation Policy: {cancellationPolicy}
            </span>
          </div>
          <div className="mt-auto">
            <Button
              className="w-full"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              Show More Details
            </Button>
          </div>
        </CardContent>
      </Card>
      <HotelModal
        hotel={hotel}
        checkInDate={checkInDate} // Pass checkInDate
        checkOutdate={checkOutdate} // Pass checkOutdate
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </>
  );
};

export default HotelCard;
