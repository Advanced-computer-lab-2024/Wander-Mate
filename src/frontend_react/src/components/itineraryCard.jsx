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

const ItineraryCard = ({
  name,
  images = [],
  description,
  tags,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-4 rounded-md">
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
        <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
          {description}
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
          onClick={() => setOpen(true)}
        >
          <Icon icon="ph:info" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
          Show More Details
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <DialogClose onClick={() => setOpen(false)}>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ItineraryCard;
