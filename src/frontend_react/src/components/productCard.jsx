import React, { useState } from "react";
import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import ProductModal from "./productModel";

const ProductCard = ({
  productId,
  name,
  image,
  description,
  price,
  discount,
  ratings,
  reviews, 
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [count, setCount] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = async () => {
    console.log(reviews);
    setIsAdded(true);
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post(`http://localhost:8000/addItemToCart`, {
        touristID: userID,
        productId,
        name,
        price,
        picture: image,
      });
    } catch (error) {
      console.error("Error adding to cart data:", error);
    }
  };

  const incrementCount = async () => {
    setCount((prevCount) => prevCount + 1);
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post(`http://localhost:8000/addItemToCart`, {
        touristID: userID,
        productId,
        name,
        price,
        picture: image,
      });
    } catch (error) {
      console.error("Error adding to cart data:", error);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
    if (count <= 1) {
      setCount((prevCount) => 1);
      setIsAdded(false);
    }
  };

  return (
    <ProductModal
      product={{
        productId,
        name,
        image,
        description,
        price,
        discount,
        ratings,
        reviews,
      }}
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
    >
      <Card
        className="p-4 rounded-md cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-[191px] flex flex-col justify-center items-center mb-3 rounded-md">
          <div
            className="w-full overflow-hidden rounded-md relative z-10 bg-default-100 dark:bg-default-200 h-full group"
            style={{ left: "0%", top: "0%" }}
          >
            <img
              className="h-full w-full object-contain p-6 transition-all duration-300 group-hover:scale-105"
              src={image}
              alt={name}
            />
            {discount && (
              <Badge
                color="destructive"
                className="absolute top-3 ltr:left-3 rtl:right-3"
              >
                -{discount}%
              </Badge>
            )}
            <div className="hover-box flex flex-col invisible absolute top-3 right-2 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 space-y-[6px]">
              <button
                className="rounded-full bg-background p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <Icon
                  icon={isLiked ? "ph:heart-fill" : "ph:heart"}
                  className={`h-4 w-4 ${
                    isLiked ? "text-red-500" : "text-muted-foreground"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-secondary-foreground uppercase font-normal">
              {ratings}
            </p>
            <span className="flex items-center text-secondary-foreground font-normal text-xs gap-x-1">
              <Icon icon="ph:star-fill" className="text-yellow-400" />
              <span>{ratings}</span>
            </span>
          </div>
          <h6 className="text-secondary-foreground text-base font-medium mb-[6px] truncate"></h6>

          <p className="font-bold text-base mb-2">{name}</p>

          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            {description}
          </p>

          <p className="mb-4 space-x-4">
            <span className="text-secondary-foreground text-base font-medium mt-2">
              ${price}
            </span>
            {discount && (
              <del className="text-default-500 dark:text-default-500 font-normal text-base">
                ${price + (price * discount) / 100}
              </del>
            )}
          </p>

          {!isAdded ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              <Icon
                icon="heroicons:shopping-bag"
                className="w-4 h-4 ltr:mr-2 rtl:ml-2"
              />
              Add to Cart
            </Button>
          ) : (
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 h-10 flex border border-1 border-primary delay-150 ease-in-out divide-x-[1px] text-sm font-normal divide-primary rounded">
                <button
                  type="button"
                  className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    decrementCount();
                  }}
                >
                  <Icon icon="eva:minus-fill" />
                </button>

                <div className="flex-1 text-base py-2 flex items-center min-w-[45px] justify-center text-primary font-medium">
                  {count}
                </div>
                <button
                  type="button"
                  className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    incrementCount();
                  }}
                >
                  <Icon icon="eva:plus-fill" />
                </button>
              </div>
              <Button
                variant="outline"
                className="py-2 px-5 flex-none"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon icon="heroicons:shopping-bag" className="w-4 h-4" />
                Added
              </Button>
            </div>
          )}
        </div>
      </Card>
    </ProductModal>
  );
};

export default ProductCard;
