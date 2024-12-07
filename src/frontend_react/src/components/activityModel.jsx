import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import NonMovableMap from "./ui/nonMovableMap";
import { StarIcon } from "lucide-react";
import PayForActivity from "./PayForActivity";
import {
  CustomPopover as Popover,
  PopoverTrigger,
  PopoverContent,
} from "./ui/popover";
import axios from "axios";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function ActivityModal({
  activity,
  isOpen,
  setIsOpen,
  children,
  favorite,
  setFavorite,
}) {
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [userAge, setUserAge] = useState(19);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      // setIsBookingConfirmed(false);
    }
  };

  const handleBook = () => {
    if (userAge < 18) {
      toast.error("You must be 18 or older to book this itinerary.");
      return;
    }

    if (!isBooking) {
      setIsBooking(true);
    }
  };

  useEffect(() => {
    setIsFavorite(favorite);
  }, [favorite]);

  const handleToggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    setFavorite(!favorite);
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();

      console.log({
        userID,
        eventId: activity.activityId,
        type: "Attraction",
      });

      if (isFavorite) {
        await axios.delete("http://localhost:8000/unbookmarkEvent", {
          data: {
            userId: userID,
            eventId: activity.activityId,
            type: "Attraction",
          },
        });
        toast.success("Removed from Favorites");
      } else {
        await axios.post("http://localhost:8000/Bookmarkevent", {
          userId: userID,
          eventId: activity.activityId,
          type: "Attraction",
        });
        toast.success("Added to Favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite Activity:", error);
      toast.error("Failed to update favorite Activity: " + error.message);
    }
  };

  const handlePaymentSuccess = () => {
    setBookingError(null);
    console.log("Booking successful!");
  };

  const handlePaymentError = (error) => {
    setBookingError(error.message || "Payment failed. Please try again.");
    setIsBooking(false);
  };

  const fetchUserAge = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");
      const { userID } = await reply.json();
      const userResponse = await fetch(
        `http://localhost:8000/gettourist/${userID}`
      );
      if (!userResponse.ok) throw new Error("Failed to get user details");

      const userData = await userResponse.json();
      const birthDate = new Date(userData.DOB);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      setUserAge(age);
    } catch (error) {
      console.error("Error fetching user age:", error);
    }
  };

  useEffect(() => {
    fetchUserAge();
  }, []);

  const handleShare = (method) => {
    const currentUrl = window.location.href.split("?")[0];
    const shareUrl = `${currentUrl}?open=true&activity=${activity.activityId}`;
    const shareText = `Check out this amazing activity: ${activity.name}`;

    if (method === "link") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success("Link copied to clipboard!");
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

  const handleNotifyMe = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();
      console.log(activity.activityId);
      const response = await axios.post(
        "http://localhost:8000/requestToBeNotifiedForAttraction",
        {
          touristId: userID,
          attractionId: activity.activityId,
        }
      );
      if (response.status === 200) {
        toast.success("You will be notified when it starts taking bookings!");
      } else {
        toast.error("Failed to request to be notified");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to request to be notified");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        size="full"
      >
        <Toaster />
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={() => handleOpenChange(false)}
          >
            <Icon icon="ph:x" className="h-4 w-4" />
          </Button>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Map Section */}
              <div>
                <Tabs defaultValue="location" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  <TabsContent value="location" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="w-full h-64 rounded-lg overflow-hidden">
                          <NonMovableMap
                            initialLocation={activity.location.coordinates.slice()}
                            onLocationSelect={() => {}}
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            const [lat, lng] = activity.location.coordinates;
                            const mapUrl = `https://www.google.com/maps?q=${lng},${lat}`;
                            window.open(mapUrl, "_blank");
                          }}
                        >
                          <Icon
                            icon="heroicons:location-marker"
                            className="w-4 h-4 mr-2"
                          />
                          Open in Maps
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Activity Details Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {activity.name}
                </h1>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(activity.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({activity.rating.toFixed(1)})
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(activity.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Time:</span> {activity.time}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Category:</span>{" "}
                  {activity.category || "Not specified"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Price: </span>
                  {activity.currency} {activity.price}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {activity.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center mb-4">
                  <Icon
                    icon={
                      activity.isAvailable ? "ph:check-circle" : "ph:x-circle"
                    }
                    className={`w-5 h-5 ${
                      activity.isAvailable ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span className="ml-2 text-sm">
                    {activity.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
                <div
                  className={`flex ${
                    activity.isAvailable
                      ? "flex-row space-x-4"
                      : "flex-col space-y-4"
                  } w-full`}
                >
                  {activity.isAvailable ? (
                    <>
                      <Button
                        className="flex-1 py-2"
                        onClick={handleBook}
                        disabled={userAge < 18}
                      >
                        <Icon
                          icon="heroicons:shopping-bag"
                          className="w-4 h-4 mr-2"
                        />
                        Book Now
                      </Button>
                      <Button
                        className={`flex-1 py-2 ${
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
                            className="flex-1 py-2"
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
                    </>
                  ) : (
                    <>
                      <Button
                        className="text-white w-full py-2"
                        onClick={handleNotifyMe}
                      >
                        <Icon icon="heroicons:bell" className="w-4 h-4 mr-2" />
                        Notify Me When Available
                      </Button>
                      <Button
                        className={`w-full py-2 ${
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
                            className="w-full py-2"
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
