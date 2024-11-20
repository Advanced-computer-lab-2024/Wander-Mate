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
import { Badge } from "./ui/badge";
import axios from "axios";

export default function PlaceModal({ place, isOpen, setIsOpen, children }) {
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      const url = new URL(window.location.href);
      if (window.location.search.includes("open")) {
        url.searchParams.delete("open");
        url.searchParams.delete("place");
        window.history.replaceState({}, "", url);
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (place.reviews && place.reviews.length > 0) {
        try {
          const response = await axios.post(
            "http://localhost:8000/getReviews",
            {
              reviewIds: place.reviews,
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

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("open") === "true") {
      setIsOpen(true);
    }
  }, [isOpen, place.reviews]);

  const handleToggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post(`http://localhost:8000/toggleFavoritePlace`, {
        touristID: userID,
        placeId: place.placeId,
      });
    } catch (error) {
      console.error("Error toggling favorite place:", error);
    }
  };

  const handleShare = (method) => {
    const currentUrl = window.location.href.split("?")[0];
    const shareUrl = `${currentUrl}?open=true&place=${place.placeId}`;
    const shareText = `Check out this amazing place: ${place.name}`;

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
            <Icon icon="ph:x" className="h-4 w-4" />
          </Button>
          <div className="space-y-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Place Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Place Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {place.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        icon="ph:star-fill"
                        className={`w-5 h-5 ${
                          i < Math.floor(place.ratings)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({place.ratings})
                    </span>
                  </div>
                {/* Place Details */}
                <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Location:</span> {place.location}
                    {/* New Button to Open Google Maps */}
                    <Button
                    variant="outline"
                    className="ml-4"
                    onClick={() => {
                        const mapUrl = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
                        window.open(mapUrl, "_blank");
                    }}
                    >
                    <Icon icon="heroicons:location-marker" className="w-4 h-4 mr-2" />
                    Open in Google Maps
                    </Button>
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Category:</span> {place.category}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Best Time to Visit:</span> {place.bestTimeToVisit}
                </p>
                </div>

                  <p className="text-gray-600 mb-6">{place.description}</p>

                  {/* Favorite Button and Share Button */}
                  <div className="flex space-x-4 mb-6">
                    <Button
                      className={`flex-1 ${isFavorite ? 'bg-red-500 hover:bg-red-600' : ''}`}
                      onClick={handleToggleFavorite}
                    >
                      <Icon
                        icon={isFavorite ? "ph:heart-fill" : "ph:heart"}
                        className="w-4 h-4 mr-2"
                      />
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
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

            {/* Place Description Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="info">Place Information</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="attractions">Nearby Attractions</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">{place.description}</p>
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
              <TabsContent value="attractions" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      {place.nearbyAttractions ? place.nearbyAttractions : "No nearby attractions information available."}
                    </p>
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