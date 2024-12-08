import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ActivityModal from "../components/activityModel";
import { StarIcon } from "lucide-react";

export default function ActivityCard({
  activityId,
  name,
  location,
  type,
  tags,
  price,
  date,
  time,
  category,
  isAvailable,
  rating = 0,
  currency,
  Creator
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activity = {
    activityId,
    name,
    location,
    type,
    tags,
    price,
    date,
    time,
    category,
    isAvailable,
    rating,
    currency,
    Creator
  };

  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) {
          console.log("No username found in session storage");
          setFavorite(false); // Set to false if no user is logged in
          return;
        }

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        const response = await fetch(
          `http://localhost:8000/checkIfEventBookmarked`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userID,
              eventId: activityId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setFavorite(data);
      } catch (error) {
        console.error("Error fetching favorite status:", error);
        setFavorite(false);
      }
    };

    if (activityId !== null) {
      fetchFavorite();
    }
  }, [activityId]);

  return (
    <ActivityModal
      activity={activity}
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      favorite={favorite === null ? false : favorite}
      setFavorite={setFavorite}
    >
      <Card
        className="p-4 rounded-md cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="mb-3">
          <p className="font-bold text-base mb-1">{name}</p>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            Date: {new Date(date).toLocaleDateString()} | Time: {time}
          </p>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            Category: {category || "Not specified"}
          </p>
          <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
            Price: {currency} {price}
          </p>
        </div>
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({Number(rating).toFixed(1)})
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))
          ) : (
            <div className="w-full h-4" />
          )}
        </div>
        <div className="flex items-center mb-2">
          <Icon
            icon={isAvailable ? "ph:check-circle" : "ph:x-circle"}
            className={`w-4 h-4 ${
              isAvailable ? "text-green-500" : "text-red-500"
            }`}
          />
          <span className="ml-2 text-sm">
            {isAvailable ? "Available" : "Not Available"}
          </span>
        </div>
        <Button
          className="w-full"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <Icon icon="ph:info" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
          Show More Details
        </Button>
      </Card>
    </ActivityModal>
  );
}
