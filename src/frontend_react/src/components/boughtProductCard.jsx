import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import BoughtProductModal from "./boughtProductModal";
import { Rating } from "@smastrom/react-rating";

const BoughtProductCard = ({
  productId,
  name = "Unknown Product",
  image = "",
  description = "No description available",
  price = 0,
  discount = 0,
  rating = 0,
  reviews = [],
  quantity = 0,
  sellerId,
  sellerName,
  sellerUsername,
  sellerEmail,
  onLike,
  currency = "USD",
  myProductRating,
  mySellerRating,
  reFetchratings,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = {
    _id: productId,
    name,
    image,
    description,
    price,
    discount,
    rating,
    reviews,
    quantity,
    sellerId,
    sellerName,
    sellerUsername,
    sellerEmail,
    currency,
  };

  return (
    <>
      <Card className="p-3 rounded-md md:flex sm:flex-none md:gap-7">
        <Link href="#" onClick={() => setIsModalOpen(true)}>
          <div className="relative w-[210px] flex flex-col justify-center items-center mb-3 md:mb-0 rounded-md mt-7">
            <div className="w-full overflow-hidden rounded-md relative z-10 dark:bg-default-200 h-full group">
              <img
                className="h-full w-full object-contain p-6 transition-all duration-300 group-hover:scale-105 transform translate-y-[-30px]"
                src={image}
                alt={name}
              />

              {discount > 0 && (
                <Badge
                  color="destructive"
                  className="absolute top-3 rtl:right-3"
                >
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>
        </Link>

        <div className="md:mt-3 mt-0 w-full">
          <p className="text-xs text-foreground uppercase font-normal mb-1">
            {quantity > 0 ? `${quantity} in stock` : "Out of stock"}
          </p>
          <h6 className="text-foreground text-lg font-medium mb-1 truncate">
            <Link href="#" onClick={() => setIsModalOpen(true)}>
              {name}
            </Link>
          </h6>
          <p className="text-muted-foreground text-sm font-medium mb-1">
            {description}
          </p>
          <p className="mb-[5px] ltr:space-x-4 rtl:space-x-reverse">
            <span className="text-foreground text-lg font-semibold mt-2">
              {`${price.toFixed(2)} ${currency}`}
            </span>
            {discount > 0 && (
              <span className="text-muted-foreground line-through">
                {`${(price + (price * discount) / 100).toFixed(2)} ${currency}`}
              </span>
            )}
          </p>
          <div className="flex items-center mb-[9px] text-secondary-foreground font-normal text-base gap-x-2">
            <Rating
              style={{ maxWidth: 125 }}
              className="space-x-1.5"
              value={rating}
              readOnly
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              className="flex-auto"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>

      <BoughtProductModal
        product={product}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        myProductRating={myProductRating}
        mySellerRating={mySellerRating}
        reFetchratings={reFetchratings}
      />
    </>
  );
};

export default BoughtProductCard;
