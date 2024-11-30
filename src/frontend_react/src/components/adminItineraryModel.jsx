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
import NonMovableMap from "./ui/nonMovableMap";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import CustomConfirmationDialog from "./ui/confirmationDialog";

export default function AdminItineraryModel({ itinerary, isOpen, setIsOpen, children }) {
    const [reviews, setReviews] = useState([]);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isButtonPressed, setIsButtonPressed] = useState(false); // State for the button color
    const [isFlagged, setIsFlagged] = useState(itinerary.isFlagged);
    // const [isClicked, setIsClicked] = useState(false);



    const handleButtonClick = () => {
        setIsButtonPressed((prevState) => !prevState); // Toggle between true and false
      };
    const openInMaps = (latitude, longitude) => {
      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(mapUrl, "_blank");
    };

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
      try {
        const response = await fetch(
          `http://localhost:8000/getItineraryReviews/${itinerary.itineraryId}`
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

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("open") === "true" && urlParams.get("itinerary") === itinerary.itineraryId) {
        setIsOpen(true);
      }
    }, [isOpen, itinerary.Ratings]);

    const doNothing = () => {}
  
    const handleShare = (method) => {
      const currentUrl = window.location.href.split("?")[0];
      const shareUrl = `${currentUrl}?open=true&itinerary=${itinerary.itineraryId}`;
      const shareText = `Check out this amazing itinerary: ${itinerary.name}`;
    
      if (method === "link") {
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast("Link copied to Clipboard!", {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#826AF9",
              color: "#fff",
            },
          });
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
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // State for dialog visibility

    const handleDelete = () => {
        setIsConfirmationOpen(true); // Open the confirmation dialog
      };
    
      const handleConfirmDelete = async () => {
        try {
          const response = await axios.post(
            `http://localhost:8000/flag-event-or-itinerary`,{
                id: itinerary.itineraryId,
                type: "itinerary"
            }
          );
          if (response.status === 200) {
            toast.success("itinerary flagged successfully!");
          } else {
            toast.error("Failed to flag product");
          }
        } catch {
          toast.error("Failed to flag product");
        }
         setIsFlagged(!isFlagged);
        setIsConfirmationOpen(false); // Close the dialog after confirmation
      };
    
      const handleCancelDelete = () => {
        setIsConfirmationOpen(false); // Close the dialog if canceled
      };
    
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" size="full">
          <Toaster/>
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
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={itinerary.image || "/placeholder.svg"}
                    alt={itinerary.Name}
                    className="w-full h-full object-cover"
                  />
                </div>
  
                <div className="flex flex-col justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {itinerary.name}
                    </h1>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Timeline:</span>{" "}
                        {itinerary.TimeLine}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Price:</span> {itinerary.currrn} {itinerary.price || "N/A"}
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
  
                   <div className="space-y-4">
                    <div className="flex space-x-4">
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
                      <Button
                       variant="outline"
                       onClick={handleDelete}
                       className={`w-32 ${isButtonPressed ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                       
                    >
                        <CustomConfirmationDialog
                        isOpen={isConfirmationOpen}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        message="Are you sure you want to flag this itinerary?"
                      />
                        {/* <Icon icon="heroicons:star" className="w-4 h-4 mr-2" /> */}
                        {isFlagged? "Unflag" : "Flag"}
                    </Button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
  
              <Tabs defaultValue="info">
                <TabsList>
                  <TabsTrigger value="info">Itinerary Information</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="map">Pickup Location</TabsTrigger>
                  <TabsTrigger value="map1">Dropoff Location</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
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
                      <p className="text-sm text-gray-600">
                    <span className="font-semibold">Flagged:</span> {isFlagged ? "Flagged" : "Not Flagged"}
                  </p>  {/* Display the flag status here */}

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
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                      <Button
                        variant="outline"
                        className="ml-4"
onClick={() => openInMaps(itinerary.PickUpLocation.coordinates[1], itinerary.PickUpLocation.coordinates[0])}
                      >
                        <Icon icon="heroicons:location-marker" className="w-4 h-4 mr-2" />
                        Open in Maps
                      </Button>
                        <NonMovableMap
                          initialLocation={itinerary.PickUpLocation?.coordinates}
                          onLocationSelect={doNothing}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="map1" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                      <Button
                        variant="outline"
                        className="ml-4"
                        onClick={() => openInMaps(itinerary.DropOffLocation.coordinates[1], itinerary.DropOffLocation.coordinates[0])}
                      >
                        <Icon icon="heroicons:location-marker" className="w-4 h-4 mr-2" />
                        Open in Maps
                      </Button>
                        <NonMovableMap
                          initialLocation={itinerary.DropOffLocation?.coordinates}
                          onLocationSelect={doNothing}
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

