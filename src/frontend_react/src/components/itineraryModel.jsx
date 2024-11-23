import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import {
  CustomPopover as Popover,
  PopoverTrigger,
  PopoverContent,
} from "./ui/popover";
import { Icon } from "@iconify/react";
import axios from "axios";
import BasicMap from "./ui/basic-map";

export default function ItineraryModel({ itinerary, isOpen, setIsOpen, children }) {
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    console.log(itinerary);
  
    const handleOpenChange = (open) => {
      setIsOpen(open);
      if (!open) {
        const url = new URL(window.location.href);
        if (window.location.search.includes("open")) {
          url.searchParams.delete("open");
          url.searchParams.delete("itinerary");
          window.history.replaceState({}, "", url);
        }
      }
    };
  
    useEffect(() => {
      const fetchReviews = async () => {
        if (itinerary.Ratings && itinerary.Ratings.length > 0) {
          try {
            const response = await axios.post(
              "http://localhost:8000/getItineraryReviews",
              {
                reviewIds: itinerary.Ratings,
              }
            );
            setReviews(response.data.reviews);
          } catch (error) {
            console.error("Error fetching reviews:", error);
          }
        }
      };
  
      if (isOpen) {
        fetchReviews();
      }
    }, [isOpen, itinerary.Ratings]);
  
    const handleToggleFavorite = async () => {
      setIsFavorite(!isFavorite);
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get user ID");
  
        const { userID } = await reply.json();
        await axios.post("http://localhost:8000/toggleFavoriteItinerary", {
          userID,
          itineraryId: itinerary._id,
        });
      } catch (error) {
        console.error("Error toggling favorite itinerary:", error);
      }
    };
  
    const handleShare = (method) => {
      const currentUrl = window.location.href.split("?")[0];
      const shareUrl = `${currentUrl}?open=true&itinerary=${itinerary._id}`;
      const shareText = `Check out this amazing itinerary: ${itinerary.Name}`;
  
      if (method === "link") {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert("Link copied to clipboard!");
          setIsShareOpen(false);
        });
      } else if (method === "email") {
        const mailtoLink = `mailto:?subject=${encodeURIComponent(
          shareText
        )}&body=${encodeURIComponent(shareUrl)}`;
        window.location.href = mailtoLink;
        setIsShareOpen(false);
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" size="full">
          <div className="relative">
            <Button
              variant="ghost"
              className="absolute right-0 top-0"
              onClick={() => handleOpenChange(false)}
            >
              <Icon icon="ph:x" className="h-4 w-4" />
            </Button>
            <div className="space-y-8 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Itinerary Images */}
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={itinerary.image || "/placeholder.svg"}
                    alt={itinerary.Name}
                    className="w-full h-full object-cover"
                  />
                </div>
  
                {/* Itinerary Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {itinerary.name}
                    </h1>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Category:</span>{" "}
                        {itinerary.language || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Timeline:</span>{" "}
                        {itinerary.timeLine || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Price:</span> ${itinerary.Price || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Available Dates:</span>{" "}
                        {itinerary.AvailableDates
                          ? itinerary.AvailableDates.map((date) =>
                              new Date(date.$date || date).toLocaleDateString()
                            ).join(", ")
                          : "N/A"}
                      </p>
                    </div>
  
                    {/* Favorite and Share Buttons */}
                    <div className="flex space-x-4">
                      <Button
                        className={`flex-1 ${
                          isFavorite ? "bg-red-500 hover:bg-red-600" : ""
                        }`}
                        onClick={handleToggleFavorite}
                      >
                        <Icon
                          icon={isFavorite ? "ph:heart-fill" : "ph:heart"}
                          className="w-4 h-4 mr-2"
                        />
                        {isFavorite
                          ? "Remove from Favorites"
                          : "Add to Favorites"}
                      </Button>
                      <Popover
                        open={isShareOpen}
                        onOpenChange={setIsShareOpen}
                        onClose={() => setIsShareOpen(false)}
                        trigger={
                          <Button
                            variant="outline"
                            onClick={() => setIsShareOpen(true)}
                          >
                            <Icon
                              icon="heroicons:share"
                              className="w-4 h-4 mr-2"
                            />
                            Share
                          </Button>
                        }
                      >
                        <div className="w-48 p-2">
                          <div className="flex flex-col space-y-2">
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("link")}
                              className="w-full justify-start"
                            >
                              <Icon
                                icon="heroicons:link"
                                className="w-4 h-4 mr-2"
                              />
                              Copy Link
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("email")}
                              className="w-full justify-start"
                            >
                              <Icon
                                icon="heroicons:envelope"
                                className="w-4 h-4 mr-2"
                              />
                              Email
                            </Button>
                          </div>
                        </div>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Itinerary Description Tabs */}
              <Tabs defaultValue="info">
                <TabsList>
                  <TabsTrigger value="info">Itinerary Information</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="map">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600">
                        Creator ID: {itinerary.Creator?.$oid || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Activities:{" "}
                        {itinerary.Activities
                          ? itinerary.Activities.map((activity) => activity.$oid || activity).join(", ")
                          : "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Locations to Visit:{" "}
                        {itinerary.LocationsToVisit
                          ? itinerary.LocationsToVisit.map(
                              (location) => location.$oid || location
                            ).join(", ")
                          : "N/A"}
                      </p>
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
                <TabsContent value="map" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">
                        <span className="font-semibold">Pick-Up Location:</span>{" "}
                        {itinerary.PickUpLocation?.coordinates?.join(", ") || "N/A"}
                      </p>
                      <p className="text-gray-600 mb-4">
                        <span className="font-semibold">Drop-Off Location:</span>{" "}
                        {itinerary.DropOffLocation?.coordinates?.join(", ") || "N/A"}
                      </p>
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                        <BasicMap
                          initialLocation={itinerary.PickUpLocation?.coordinates || [0, 0]}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
