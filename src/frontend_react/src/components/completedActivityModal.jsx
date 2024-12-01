import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { X } from 'lucide-react';
import { StarRating } from "./StarRating";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function CompletedActivityModal({
  activity,
  isOpen,
  setIsOpen,
  myItRating,
  myTourRating,
  Creator,
  reFetchratings,
}) {
  const [reviews, setReviews] = useState([]);
  const [activityRating, setActivityRating] = useState(0);
  const [activityReview, setActivityReview] = useState("");
  const [advertiserInfo, setAdvertiserInfo] = useState(null);

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  useEffect(() => {
    console.log(Creator);
    setActivityRating(myItRating);
  }, [isOpen]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/getItineraryReviews/${activity._id}`
        );
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };


    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, activity._id, Creator.Username]);

  const handleSubmitReview = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      if (activityReview !== "") {
        const response = await axios.post(
          `http://localhost:8000/addCommentONEvent`,
          {
            Body: activityReview,
            eventId: activity._id,
            touristID: userID,
            username,
          }
        );
        if (response.status === 200) {
          toast.success("Comment posted successfully!");
          setActivityReview("");
        }
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const rateActivity = async (rating) => {
    console.log(rating);
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post("http://localhost:8000/rateEvent", {
        userId: userID,
        eventId: activity._id,
        rating: rating,
      });

      if (response.status !== 200) throw new Error("Failed to rate activity");
      setActivityRating(rating);
      reFetchratings(activity._id);
      toast.success("Rating submitted successfully!");
    } catch (error) {
      console.error("Error rating activity:", error);
      toast.error("Failed to submit rating");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {/* <Button>{activity.name}</Button> */}
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        size="full"
      >
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="space-y-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activity.name}
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(activity.BookedDate).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Advertiser:</span>{" "}
                  {Creator.FullName || Creator.Username}
                </p>
              </div>
            </div>

            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Rate Activity</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="advertiser">Advertiser Info</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="activity-rating">Activity Rating</Label>
                        <StarRating
                          rating={activityRating}
                          onRatingChange={rateActivity}
                        />
                      </div>
                      <div>
                        <Label htmlFor="activity-review">Comment on Activity</Label>
                        <Textarea
                          id="activity-review"
                          placeholder="Share your thoughts about the activity..."
                          value={activityReview}
                          onChange={(e) => setActivityReview(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    {reviews.length > 0 ? (
                      <ul className="space-y-4">
                        {reviews.map((review, index) => (
                          <li
                            key={index}
                            className="border-b pb-4 last:border-b-0"
                          >
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium">
                                {review.username}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.review}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No reviews yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="advertiser" className="mt-4">
                <Card>
                   <CardContent className="p-6">
                    {advertiserInfo ? (
                      <div>
                        <p className="text-lg mb-2">Full name</p>
                        <p>{Creator.FullName || "No description available."}</p>
                      </div>
                    ) : (
                        <div className="space-y-4">
                        <div className="flex flex-col">
                          <p className="text-lg font-medium text-gray-900">Username</p>
                          <p className="text-sm font-semibold text-gray-600">{Creator.Username || "No description available."}</p>
                        </div>
                      
                        <div className="flex flex-col">
                          <p className="text-lg font-medium text-gray-900">Email</p>
                          <p className="text-sm font-semibold text-gray-600">{Creator.Email || "No email available."}</p>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-lg font-medium text-gray-900">Website</p>
                          <p className="text-sm font-semibold text-gray-600">{Creator.Website || "No email available."}</p>
                        </div>
                      
                        <div className="flex flex-col">
                          <p className="text-lg font-medium text-gray-900">Hotline</p>
                          <p className="text-sm font-semibold text-gray-600">{Creator.Hotline || "No hotline available."}</p>
                        </div>
                      </div>
                      
                      
                    )
                    }
                  </CardContent> 
                </Card>
              </TabsContent>
            </Tabs>

            <Button className="w-full" onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

