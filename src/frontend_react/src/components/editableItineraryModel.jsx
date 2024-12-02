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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
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
    Language: itinerary.Language || "",
    price: itinerary.price,
    TimeLine: itinerary.TimeLine,
    Activities: itinerary.Activities,
    LocationsToVisit: itinerary.LocationsToVisit,
  });
  const [allActivities, setAllActivities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [isActive, setIsActive] = useState(itinerary.isActive);
  const navigate = useNavigate();
   const images = itinerary.images;

  const handleCreatorClick = (e) => {
    e.preventDefault();
    if (creator) {
      const creatorData = encodeURIComponent(JSON.stringify(creator));
      navigate(`/itineraryTourGuide?creator=${creatorData}`);
    }
  };

  useEffect(() => {
    console.log(editedItinerary);

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
      const updatedItinerary = {
        ...editedItinerary,
        Activities: Array.isArray(editedItinerary.Activities)
          ? editedItinerary.Activities.map((activity) => activity._id)
          : [], // Fallback to empty array if not an array
        LocationsToVisit: Array.isArray(editedItinerary.LocationsToVisit)
          ? editedItinerary.LocationsToVisit.map((location) => location._id)
          : [], // Fallback to empty array if not an array
      };

      console.log(editedItinerary.LocationsToVisit);

      const response = await axios.put(
        `http://localhost:8000/updateItinerary/${itinerary.itineraryId}`,
        updatedItinerary
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
      const currentItems = Array.isArray(prev[name]) ? prev[name] : [];
      console.log("Current items:", currentItems);

      // Check if the item's _id exists in the current items
      const itemExists = currentItems.some(
        (oneItem) => oneItem._id === item._id
      );

      if (itemExists) {
        // Remove the item by filtering out its _id
        return {
          ...prev,
          [name]: currentItems.filter((i) => i._id !== item._id),
        };
      } else {
        // Add the new item to the array
        return {
          ...prev,
          [name]: [...currentItems, item],
        };
      }
    });
  };

  const handleActivation = async () => {
    try {
      console.log(itinerary.itineraryId);
      const response = await axios.put(
        `http://localhost:8000/deactivateItinerary/${itinerary.itineraryId}`
      );
      if (response.status === 200) {
        toast.success("Activation changed successfully!");
        setIsActive(!isActive);
      } else {
        toast.error(
          "Itinerary cannot be deactivated as there are no bookings, You can delete it"
        );
      }
    } catch {
      toast.error(
        "Itinerary cannot be deactivated as there are no bookings, You can delete it"
      );
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
              <div className="aspect-square overflow-hidden rounded-lg ">
                <Carousel>
                  <CarouselContent>
                    {images.length > 0 ? (
                      images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="w-full h-full flex items-center justify-center bg-default-100 dark:bg-default-200">
                            <img
                              className="w-full h-full "
                              src={
                                image.data
                                  ? `data:${image.contentType};base64,${image.data}`
                                  : image
                              }
                              alt={`${itinerary.name} image ${index + 1}`}
                            />
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      <CarouselItem>
                        <div className="flex items-center justify-center h-full">
                          <img
                            src="/placeholder.svg?height=191&width=191"
                            alt="Placeholder"
                            className="max-h-[191px] w-auto"
                          />
                        </div>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  {images.length > 1 && (
                    <>
                      <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-600" />
                      <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-600" />
                    </>
                  )}
                </Carousel>
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
                      <Label htmlFor="Language">Language</Label>
                      <Input
                        id="Language"
                        name="Language"
                        value={editedItinerary.Language}
                        onChange={handleInputChange}
                        placeholder="Itinerary Language"
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
                              checked={editedItinerary.Activities.map(
                                (Activity) => Activity._id
                              ).includes(activity._id)}
                              onChange={() =>
                                handleCheckboxChange("Activities", activity)
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
                              checked={editedItinerary.LocationsToVisit.map(
                                (Location) => Location._id
                              ).includes(location._id)}
                              onChange={() =>
                                handleCheckboxChange(
                                  "LocationsToVisit",
                                  location
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
                      <Button
                        onClick={handleDelete}
                        color="destructive"
                        className="ml-8"
                      >
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
                        <span className="font-semibold">Language:</span>{" "}
                        {editedItinerary.Language}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Activities:</span>{" "}
                        {editedItinerary.Activities.map((activity) =>
                          typeof activity === "string"
                            ? activity
                            : activity.Name
                        ).join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">
                          Locations to Visit:
                        </span>{" "}
                        {editedItinerary.LocationsToVisit.map((location) =>
                          typeof location === "string"
                            ? location
                            : location.Name
                        ).join(", ")}
                      </p>
                    </div>

                    {/* Edit and Share Buttons */}
                    <div className="flex space-x-4 mb-6">
                      <Button className="flex-1" onClick={handleEdit}>
                        <Icon
                          icon="heroicons:pencil"
                          className="w-4 h-4 mr-2"
                        />
                        Edit Itinerary
                      </Button>
                      <Button
                        variant="outline"
                        color="warning"
                        onClick={handleActivation}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerary Description Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="map">Pickup Location</TabsTrigger>
                <TabsTrigger value="map1">Dropoff Location</TabsTrigger>
              </TabsList>

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
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
