'use client'

import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";
import { Rating } from "../components/ui/rating";
import PurchasedProductModal from "./purchasedProductsModal";

const PurchasedProductCard = ({
  productId,
  name,
  images,
  price,
  currency,
  rating,
  description,
  seller,
  totalRatings,
  myProductRating,
  mySellerRating,
  reFetchRatings,
}) => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const product = {
    _id: productId,
    name,
    image: images[0] || "/placeholder.svg?height=300&width=300",
    images,
    price,
    currency,
    rating,
    description,
    seller,
  };

  return (
    <>
      <Card className="p-3 rounded-md md:flex sm:flex-none md:gap-7">
        <div className="relative w-[210px] flex flex-col justify-center items-center mb-3 md:mb-0 rounded-md mt-7">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={`${name} image ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>

        <div className="md:mt-3 mt-0 w-full">
          <p className="text-xs text-foreground uppercase font-normal mb-1">
            {description}
          </p>
          <h6 className="text-foreground text-lg font-medium mb-1 truncate">
            {name}
          </h6>
          <p className="mb-[5px]">
            <span className="text-foreground text-lg font-semibold mt-2">
              {`${price} ${currency}`}
            </span>
          </p>
          <div className="flex items-center mb-[9px] text-secondary-foreground font-normal text-base gap-x-2">
            <Rating value={rating} />
            <span>{`(${totalRatings})`}</span>
          </div>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsProductModalOpen(true)}
          >
            Rate & Review
          </Button>
        </div>
      </Card>

      <PurchasedProductModal
        product={product}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        myProductRating={myProductRating}
        mySellerRating={mySellerRating}
        seller={seller}
        reFetchRatings={reFetchRatings}
      />
    </>
  );
};

export default PurchasedProductCard;
