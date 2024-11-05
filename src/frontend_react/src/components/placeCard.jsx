import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel"; // Ensure to import the Carousel components

const PlaceCard = ({
    name,
    images = [], // Default to an empty array
    description,
    tags,
    category,
  }) => {
    return (
      <Card className="p-4 rounded-md">
        <div className="relative h-[191px] mb-3 rounded-md">
          <Carousel>
            <CarouselContent>
              {images.length > 0 ? (
                images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-full overflow-hidden rounded-md relative z-10 bg-default-100 dark:bg-default-200">
                      <img
                        className="h-full w-full object-cover p-6 transition-all duration-300"
                        src={image}
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
            <CarouselPrevious className="text-white" />
            <CarouselNext className="text-white" />
          </Carousel>
        </div>
        <div>
          <p className="font-bold text-base mb-1">{name}</p>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            {description}
          </p>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            Category: {category}
          </p>
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
            onClick={() => alert(`Showing more details about ${name}`)}
          >
            <Icon icon="ph:info" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            Show More Details
          </Button>
        </div>
      </Card>
    );
  };
  
export default PlaceCard;
