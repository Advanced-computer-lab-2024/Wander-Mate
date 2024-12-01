import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import AdminProductModal from "./adminProductModel";
import { useNavigate } from "react-router-dom";

const AdminProductCard = ({
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
  onLike,
  isArchived,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userID, setUserID] = useState(0);
  
  // Fetch user data and check if the product is in the wishlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get user ID");

        const { userID } = await reply.json();
        setUserID(userID);

        const response = await axios.put("http://localhost:8000/isInWishlist", {
          productId: productId,
          touristId: userID,
        });

        if (response.status === 200) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [productId]);

  const isInStock = () => quantity > 0;

  const handleLike = async () => {
    setIsLiked(!isLiked);

    if (!isLiked) {
      try {
        const response = await axios.post(
          `http://localhost:8000/addToWishlist`,
          {
            touristId: userID,
            productId: productId,
          }
        );
      } catch (error) {
        console.error("Error liking product:", error);
      }
    } else {
      try {
        const response = await axios.delete(
          `http://localhost:8000/removeFromWishlist`,
          {
            data: {
              touristId: userID,
              productId: productId,
            },
          }
        );
      } catch (error) {
        console.error("Error unliking product:", error);
      }
    }

    onLike();
  };

  return (
    <AdminProductModal
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
        isLiked,
      }}
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      quantity={quantity}
      isAdded={false} // Add to cart logic is removed
      isArchiveded={isArchived}
    >
      <Card
        className="p-4 rounded-md cursor-pointer"
        onClick={() => setIsModalOpen(true)} // Opens modal on card click
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
                  className={`h-4 w-4 ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
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

          <Button
            className="w-full"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true); // Open the product details modal
            }}
          >
            View Details
          </Button>
        </div>
      </Card>
    </AdminProductModal>
  );
};

export default AdminProductCard;
