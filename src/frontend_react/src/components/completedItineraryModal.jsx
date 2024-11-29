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

export default function CompletedItineraryModal({
  itinerary,
  isOpen,
  setIsOpen,
  children,
  myItRating,
  myTourRating,
  Creator,
}) {
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
  }, [itineraryRating, isOpen]);

  const handleSubmitReview = async () => {
    try {
      // Here you would typically send this data to your backend
      // For now, we'll just log it and show a success message
      console.log({
        itineraryId: itinerary._id,
        itineraryRating,
        tourGuideRating,
        itineraryReview,
        tourGuideReview,
      });
      toast.success("Review submitted successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
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
                          onRatingChange={setItineraryRating}
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
                          onRatingChange={setTourGuideRating}
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
