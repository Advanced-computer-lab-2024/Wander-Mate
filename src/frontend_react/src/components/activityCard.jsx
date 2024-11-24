import React, { useState } from "react";
import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ActivityModal from "../components/activityModel";

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
  };

  return (
    <ActivityModal activity={activity} isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
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
            Price: ${price}
          </p>
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

