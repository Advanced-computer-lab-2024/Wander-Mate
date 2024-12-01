import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Toaster, toast } from "react-hot-toast";
import {
  CustomPopover as Popover,
  PopoverTrigger,
  PopoverContent,
} from "./ui/popover";
import { Icon } from "@iconify/react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomConfirmationDialog from "./ui/confirmationDialog";
import NonMovableMap from "./ui/nonMovableMap";

export default function ItineraryModel({
  itinerary,
  isOpen,
  setIsOpen,
  children,
}) {
  const [reviews, setReviews] = useState([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [creator, setCreator] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItinerary, setEditedItinerary] = useState({
    name: itinerary.name,
    description: itinerary.description,
    price: itinerary.price,
    TimeLine: itinerary.TimeLine,
    Activities: itinerary.Activities,
    LocationsToVisit: itinerary.LocationsToVisit,
  });
  const [allActivities, setAllActivities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const navigate = useNavigate();

  const handleCreatorClick = (e) => {
    e.preventDefault();
    if (creator) {
      const creatorData = encodeURIComponent(JSON.stringify(creator));
      navigate(`/itineraryTourGuide?creator=${creatorData}`);
    }
  };

  useEffect(() => {
    const fetchCreatorInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/getCreatorById/${itinerary.Creator._id}`
        );
        setCreator(response.data);
      } catch (error) {
        console.error("Error fetching creator information:", error);
      }
    };

    const fetchActivitiesAndLocations = async () => {
      try {
        const activitiesResponse = await axios.get(
          "http://localhost:8000/viewActivities"
        );
        setAllActivities(activitiesResponse.data);

        const locationsResponse = await axios.get(
          "http://localhost:8000/readPlaces"
        );
        setAllLocations(locationsResponse.data);
      } catch (error) {
        console.error("Error fetching activities and locations:", error);
      }
    };

    if (itinerary.Creator) {
      fetchCreatorInfo();
    }
    fetchActivitiesAndLocations();
  }, [itinerary.Creator]);

  const getInitials = (name) => {
    if (!name) return "TG";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getImageSrc = (picture) => {
    if (picture && picture.data && picture.contentType) {
      const base64String =
        typeof picture.data === "string"
          ? picture.data
          : btoa(String.fromCharCode.apply(null, new Uint8Array(picture.data)));
      return `data:${picture.contentType};base64,${base64String}`;
    }
    return null;
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      const url = new URL(window.location.href);
      if (window.location.search.includes("open")) {
        url.searchParams.delete("open");
        url.searchParams.delete("itinerary");
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
    if (
      urlParams.get("open") === "true" &&
      urlParams.get("itinerary") === itinerary.itineraryId
    ) {
      setIsOpen(true);
    }
  }, [isOpen, itinerary.Ratings]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/updateItinerary/${itinerary.itineraryId}`,
        editedItinerary
      );

      if (response.status === 200) {
        setIsEditing(false);
        toast.success("Itinerary details updated successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to update itinerary details");
      }
    } catch (error) {
      console.error("Error updating itinerary details:", error);
      toast.error("Failed to update itinerary details");
    }
  };

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleDelete = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/deleteMyItinerary/${itinerary.itineraryId}`
      );
      if (response.status === 200) {
        toast.success("Itinerary deleted successfully!");
        window.location.reload();
      } else {
        toast.error("Can't delete event with existing bookings!");
      }
    } catch {
      toast.error("Can't delete event with existing bookings!");
    }
    setIsConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItinerary((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, item) => {
    setEditedItinerary((prev) => {
      const currentItems = prev[name];
      if (currentItems.includes(item)) {
        return { ...prev, [name]: currentItems.filter((i) => i !== item) };
      } else {
        return { ...prev, [name]: [...currentItems, item] };
      }
    });
  };

  const handleShare = (method) => {
    const currentUrl = window.location.href.split("?")[0];
    const shareUrl = `${currentUrl}?open=true&itinerary=${itinerary.itineraryId}`;
    const shareText = `Check out this amazing itinerary: ${editedItinerary.name}`;

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

  const openInMaps = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, "_blank");
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
          <div className="space-y-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Itinerary Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={itinerary.image || "/placeholder.svg"}
                  alt={editedItinerary.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Itinerary Info */}
              <div className="flex flex-col justify-between">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedItinerary.name}
                        onChange={handleInputChange}
                        placeholder="Itinerary Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editedItinerary.description}
                        onChange={handleInputChange}
                        placeholder="Itinerary Description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={editedItinerary.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="TimeLine">Timeline</Label>
                      <Input
                        id="TimeLine"
                        name="TimeLine"
                        value={editedItinerary.TimeLine}
                        onChange={handleInputChange}
                        placeholder="Timeline"
                      />
                    </div>
                    <div>
                      <Label>Activities</Label>
                      <div className="space-y-2">
                        {allActivities.map((activity) => (
                          <div
                            key={activity._id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`activity-${activity._id}`}
                              checked={editedItinerary.Activities.includes(
                                activity.Name
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Activities",
                                  activity.Name
                                )
                              }
                            />
                            <label htmlFor={`activity-${activity._id}`}>
                              {activity.Name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Locations to Visit</Label>
                      <div className="space-y-2">
                        {allLocations.map((location) => (
                          <div
                            key={location._id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`location-${location._id}`}
                              checked={editedItinerary.LocationsToVisit.includes(
                                location.Name
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "LocationsToVisit",
                                  location.Name
                                )
                              }
                            />
                            <label htmlFor={`location-${location._id}`}>
                              {location.Name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Button
                        onClick={handleSave}
                        style={{ marginRight: "8px" }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        style={{ marginRight: "8px" }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleDelete} variant="destructive">
                        Delete Itinerary
                      </Button>

                      <CustomConfirmationDialog
                        isOpen={isConfirmationOpen}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        message="Are you sure you want to delete this itinerary?"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {editedItinerary.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          icon="ph:star-fill"
                          className={`w-5 h-5 ${
                            i < Math.floor(itinerary.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({itinerary.rating})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">
                        ${editedItinerary.price}
                      </span>
                    </div>

                    {/* Itinerary Details */}
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Timeline:</span>{" "}
                        {editedItinerary.TimeLine}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Activities:</span>{" "}
                        {editedItinerary.Activities.join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">
                          Locations to Visit:
                        </span>{" "}
                        {editedItinerary.LocationsToVisit.join(", ")}
                      </p>
                    </div>

                    <p className="text-gray-600 mb-6">
                      {editedItinerary.description}
                    </p>

                    {/* Edit and Share Buttons */}
                    <div className="flex space-x-4 mb-6">
                      <Button className="flex-1" onClick={handleEdit}>
                        <Icon
                          icon="heroicons:pencil"
                          className="w-4 h-4 mr-2"
                        />
                        Edit Itinerary
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
                )}
              </div>
            </div>

            {/* Itinerary Description Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="info">Itinerary Information</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="map">Pickup Location</TabsTrigger>
                <TabsTrigger value="map1">Dropoff Location</TabsTrigger>
                <TabsTrigger value="tourGuide">Tour Guide Details</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      Activities:{" "}
                      {itinerary.Activities
                        ? itinerary.Activities.map(
                            (activity) => activity.$oid || activity
                          ).join(",  ")
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
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                      <Button
                        variant="outline"
                        className="ml-4"
                        onClick={() =>
                          openInMaps(
                            itinerary.PickUpLocation.coordinates[1],
                            itinerary.PickUpLocation.coordinates[0]
                          )
                        }
                      >
                        <Icon
                          icon="heroicons:location-marker"
                          className="w-4 h-4 mr-2"
                        />
                        Open in Maps
                      </Button>
                      <NonMovableMap
                        initialLocation={itinerary.PickUpLocation?.coordinates}
                        onLocationSelect={() => {}}
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
                        onClick={() =>
                          openInMaps(
                            itinerary.DropOffLocation.coordinates[1],
                            itinerary.DropOffLocation.coordinates[0]
                          )
                        }
                      >
                        <Icon
                          icon="heroicons:location-marker"
                          className="w-4 h-4 mr-2"
                        />
                        Open in Maps
                      </Button>
                      <NonMovableMap
                        initialLocation={itinerary.DropOffLocation?.coordinates}
                        onLocationSelect={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tourGuide" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                      <div className="space-y-4 mt-4">
                        <div>
                          <strong>Email: </strong>
                          <span>{creator?.Email || "N/A"}</span>
                        </div>
                        <div>
                          <strong>Username: </strong>
                          <span
                            className="cursor-pointer text-blue-500"
                            onClick={handleCreatorClick}
                          >
                            {creator?.Username || "N/A"}
                          </span>
                        </div>
                        <div>
                          <strong>Average Rating: </strong>
                          <div className="flex items-center">
                            {creator?.averageRating
                              ? [...Array(5)].map((_, i) => (
                                  <Icon
                                    key={i}
                                    icon="ph:star-fill"
                                    className={`w-5 h-5 ${
                                      i < Math.floor(creator.averageRating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))
                              : "N/A"}
                          </div>
                        </div>
                      </div>
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
