import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import CompletedActivityModal from "./completedActivityModal";
import { StarRating } from "./StarRating";
import { Rating } from "@smastrom/react-rating";

const CompletedActivityCard = ({
  activityId,
  name,
  tags,
  duration,
  latitude,
  longitude,
  reviews,
  TimeLine,
  price,
  BookedDate,
  Language,
  currrn,
  date,
  tourGuide,
  rating,
  totalRatings,
  myItRating,
  myTourRating,
  Creator,
  reFetchratings,
}) => {
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  const activity = {
    _id: activityId,
    name,
    duration,
    latitude,
    longitude,
    reviews,
    TimeLine,
    price,
    BookedDate,
    Language,
    currrn,
    date,
    tourGuide,
  };

  return (
    <>
      <Card className="p-3 rounded-md md:flex sm:flex-none md:gap-7">
        <Link href="#" onClick={() => setIsCompletedModalOpen(true)}>
          {/* <div className="relative w-[210px] flex flex-col justify-center items-center mb-3 md:mb-0 rounded-md mt-7"> */}
            {/* <div className="w-full overflow-hidden rounded-md relative z-10  dark:bg-default-200 h-full group"> */}
              {/* <Carousel>
                <CarouselContent>
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="w-full h-full flex items-center justify-center bg-default-100 dark:bg-default-200">
                          <img
                            className=" w-auto object-cover transition-all duration-300"
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
                </CarouselContent> */}
                {/* {images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-600" />
                    <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-600" />
                  </>
                )}
              </Carousel> */}
            {/* </div> */}
          {/* </div> */}
        </Link>

        <div className="md:mt-3 mt-0 w-full">
          <p className="text-xs text-foreground uppercase font-normal mb-1">
            {duration}
          </p>
          <h6 className="text-foreground text-lg font-medium mb-1 truncate">
            <Link href="#" onClick={() => setIsCompletedModalOpen(true)}>
              {name}
            </Link>
          </h6>
          <p className="mb-[5px] ltr:space-x-4 rtl:space-x-reverse">
            <span className="text-foreground text-lg font-semibold mt-2">
              {`${price} ${currrn}`}
            </span>
          </p>
          <div className="flex items-center mb-[9px] text-secondary-foreground font-normal text-base gap-x-2">
            <Rating
              style={{ maxWidth: 125 }}
              className="space-x-1.5"
              value={rating}
              readOnly
            />
            <span>{`(${totalRatings})` || "an"}</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              className="flex-auto"
              variant="outline"
              onClick={() => setIsCompletedModalOpen(true)}
            >
              <Icon icon="ph:info" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
              Rate & Review
            </Button>
          </div>
        </div>
      </Card>

      <CompletedActivityModal
        activity={activity}
        isOpen={isCompletedModalOpen}
        setIsOpen={setIsCompletedModalOpen}
        myItRating={myItRating}
        myTourRating={myTourRating}
        Creator={Creator}
        reFetchratings={reFetchratings}
      />
    </>
  );
};

export default CompletedActivityCard;