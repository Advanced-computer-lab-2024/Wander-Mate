import React, { useState } from "react";
import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import EditableProductModal from "./editableProductModal";

const EditableProductCard = ({
  productId,
  name,
  image,
  description,
  price,
  discount,
  ratings,
  reviews,
  quantity,
  seller,
  isArchived,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isInStock = () => quantity > 0;

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <EditableProductModal
      product={{
        productId,
        name,
        image,
        description,
        price,
        discount,
        ratings,
        reviews,
        seller,
        
      }}
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      quantity={quantity}
      isArchiveded={isArchived}
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
              className="h-full w-full transition-all duration-300 group-hover:scale-105"
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
            <p className="font-bold text-base mb-2">{name}</p>
            <span className="flex items-center text-secondary-foreground font-normal text-xs gap-x-1">
              <Icon icon="ph:star-fill" className="text-yellow-400" />
              <span>{ratings}</span>
            </span>
          </div>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            {description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <p className="space-x-4">
              <span className="text-secondary-foreground text-base font-medium">
                {discount > 0 ? price - (price * discount) / 100 : price}
              </span>
              {discount && (
                <del className="text-default-500 dark:text-default-500 font-normal text-base">
                  {price}
                </del>
              )}
            </p>
            <p
              className={`text-sm ${
                isInStock() ? "text-gray-500" : "text-red-500 font-semibold"
              }`}
            >
              {isInStock() ? `${quantity} in stock` : "Out of stock"}
            </p>
          </div>

          <Button className="w-full" variant="outline">
            <Icon icon={"ph:info"} className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            Show details
          </Button>
        </div>
      </Card>
    </EditableProductModal>
  );
};

export default EditableProductCard;
