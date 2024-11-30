import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { X } from "lucide-react";
import { StarRating } from "./StarRating";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function CompletedItineraryModal({
  itinerary,
  isOpen,
  setIsOpen,
  children,
  myItRating,
  myTourRating,
  Creator,
  reFetchratings,
}) {
  const [reviews, setReviews] = useState([]);
  const [GuideReviews, setGuideReviews] = useState([]);
  const [itineraryRating, setItineraryRating] = useState(0);
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [itineraryReview, setItineraryReview] = useState("");
  const [tourGuideReview, setTourGuideReview] = useState("");

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  useEffect(() => {
    setItineraryRating(myItRating);
    setTourGuideRating(myTourRating);
  }, [isOpen]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/getItineraryReviews/${itinerary._id}`
        );
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchGuideReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/getGuideReviews/${Creator._id}`
        );
        const data = await response.json();
        console.log(data);
        setGuideReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (isOpen) {
      fetchReviews();
      fetchGuideReviews();
    }
  }, [isOpen, itinerary.Ratings]);

  const handleSubmitReview = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      if (itineraryReview !== "") {
        const response = await axios.post(
          `http://localhost:8000/comment-on-itinerary/${userID}`,
          {
            itineraryID: itinerary._id,
            Body: itineraryReview,
            username,
          }
        );
        if (response.status === 200) {
          toast.success("Review submitted successfully!");
          setItineraryReview("");
        }
      }
      if (tourGuideReview !== "") {
        const response = await axios.post(
          `http://localhost:8000/commentOnGuide/${userID}`,
          {
            guideID: Creator._id,
            text: tourGuideReview,
            username,
          }
        );
        if (response.status === 200) {
          toast.success("Review submitted successfully!");
          setTourGuideReview("");
        }
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const rateItinerary = async (rating) => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post("http://localhost:8000/rateItinerary", {
        touristId: userID,
        itineraryId: itinerary._id,
        rating: rating,
      });
      if (!response.status === 200) throw new Error("Failed to rate itinerary");
      setItineraryRating(rating);
      reFetchratings(itinerary._id);
    } catch {
      console.log("Error");
    }
  };

  const rateTourGuide = async (rating) => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post("http://localhost:8000/RateGuide", {
        touristId: userID,
        guideId: Creator._id,
        rating: rating,
      });
      if (!response.status === 200) throw new Error("Failed to rate itinerary");
      setTourGuideRating(rating);
      reFetchratings(Creator._id);
    } catch {
      console.log("Error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={itinerary.image || "/placeholder.svg"}
                  alt={itinerary.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {itinerary.name}
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(itinerary.BookedDate).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Tour Guide:</span>{" "}
                  {Creator.FullName || Creator.Username}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Locations visited:</span>{" "}
                  {itinerary.LocationsToVisit &&
                  itinerary.LocationsToVisit.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {itinerary.LocationsToVisit.map((location, index) => (
                        <li key={index}>{location}</li> // Customize how you display each location
                      ))}
                    </ul>
                  ) : (
                    <span>No locations were to visit</span> // Fallback if there are no locations
                  )}
                </p>

                <p className="text-gray-600">
                  <span className="font-semibold">Activities:</span>{" "}
                  {itinerary.Activities && itinerary.Activities.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {itinerary.Activities.map((activity, index) => (
                        <li key={index}>{activity}</li> // Customize how you display each activity
                      ))}
                    </ul>
                  ) : (
                    <span>No activities were available</span> // Fallback if there are no activities
                  )}
                </p>
              </div>
            </div>

            <Tabs defaultValue="itinerary">
              <TabsList>
                <TabsTrigger value="itinerary">Rate Itinerary</TabsTrigger>
                <TabsTrigger value="tourguide">Rate Tour Guide</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="GuideReviews">
                  Tour Guide Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="itinerary" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="itinerary-rating">
                          Itinerary Rating
                        </Label>
                        <StarRating
                          rating={itineraryRating}
                          onRatingChange={rateItinerary}
                        />
                      </div>
                      <div>
                        <Label htmlFor="itinerary-review">
                          Itinerary Review
                        </Label>
                        <Textarea
                          id="itinerary-review"
                          placeholder="Share your thoughts about the itinerary..."
                          value={itineraryReview}
                          onChange={(e) => setItineraryReview(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tourguide" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tourguide-rating">
                          Tour Guide Rating
                        </Label>
                        <StarRating
                          rating={tourGuideRating}
                          onRatingChange={rateTourGuide}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tourguide-review">
                          Tour Guide Review
                        </Label>
                        <Textarea
                          id="tourguide-review"
                          placeholder="Share your thoughts about the tour guide..."
                          value={tourGuideReview}
                          onChange={(e) => setTourGuideReview(e.target.value)}
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
              <TabsContent value="GuideReviews" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    {reviews.length > 0 ? (
                      <ul className="space-y-4">
                        {GuideReviews.map((review, index) => (
                          <li
                            key={index}
                            className="border-b pb-4 last:border-b-0"
                          >
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium">
                                {review.username}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.Body}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No reviews yet.</p>
                    )}
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
