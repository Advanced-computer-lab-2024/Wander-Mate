import React from "react";
import { Rating } from "./ui/rating";

export function StarRating({ rating, onRatingChange }) {
  return (
    <div className="flex">
      <Rating
        value={rating}
        onChange={onRatingChange}
        style={{ maxWidth: 125 }}
        className="space-x-1.5"
      />
    </div>
  );
}
