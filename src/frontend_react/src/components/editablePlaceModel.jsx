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
import NonMovableMap from "./ui/nonMovableMap";
import { toast, Toaster } from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import CustomConfirmationDialog from "./ui/confirmationDialog";

export default function EditablePlaceModal({
  place,
  isOpen,
  setIsOpen,
  children,
  favorite,
  setFavorite,
}) {
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [editedPlace, setEditedPlace] = useState({
    name: place.name,
    description: place.description,
    category: place.category,
    ticketPrices: place.ticketPrices || [],
    currency: place.currency,
    location: place.location,
  });
  const [newTicketType, setNewTicketType] = useState("");
  const [newTicketPrice, setNewTicketPrice] = useState("");

  const handleOpenChange = (open) => {
    console.log(place);
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

  const doNothing = () => {};

  const images = place.images || [];

  useEffect(() => {
    setIsFavorite(favorite);
    const fetchReviews = async () => {
      if (place.reviews && place.reviews.length > 0) {
        try {
          const response = await axios.post(
            "http://localhost:8000/getReviews",
            {
              reviewIds: place.reviews,
            }
          );
          setReviews(response.data.reviews || []);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setReviews([]);
        }
      }
    };

    if (isOpen) {
      fetchReviews();
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("open") === "true" &&
      urlParams.get("place") === place.placeId
    ) {
      setIsOpen(true);
    }
  }, [isOpen, place.reviews, favorite]);

  const handleToggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    setFavorite(!favorite);
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();

      const requestData = {
        userId: userID,
        eventId: place.placeId,
        type: "Attraction",
      };
      console.log("Request Data:", requestData);

      if (isFavorite) {
        await axios.delete("http://localhost:8000/unbookmarkEvent", {
          data: requestData,
        });
        toast.success("Removed from Favorites");
      } else {
        await axios.post("http://localhost:8000/Bookmarkevent", requestData);
        toast.success("Added to Favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite Place:", error);
      if (error.response) {
        console.error("Server Error:", error.response.data);
      }
      toast.error(
        "Failed to update favorite status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleShare = (method) => {
    const currentUrl = window.location.href.split("?")[0];
    const shareUrl = `${currentUrl}?open=true&place=${place.placeId}`;
    const shareText = `Check out this amazing place: ${place.name}`;

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/updatePlace/${place.placeId}`,
        {
          Name: editedPlace.name,
          Description: editedPlace.description,
          TicketPrices: editedPlace.ticketPrices,
          OpeningHours: editedPlace.OpeningHours,
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        toast.success("Place details updated successfully!");
        // Update the place state or refetch data here
      } else {
        toast.error("Failed to update place details");
      }
    } catch (error) {
      console.error("Error updating place details:", error);
      toast.error("Failed to update place details");
    }
  };

  const handleDelete = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/deleteplace/${place.placeId}`
      );
      if (response.status === 200) {
        toast.success("Place deleted successfully!");
        handleOpenChange(false);
        window.location.reload();
        // Implement any necessary state updates or navigation here
      } else {
        toast.error("Failed to delete place");
      }
    } catch (error) {
      console.error("Error deleting place:", error);
      toast.error("Failed to delete place");
    }
    setIsConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPlace({
      name: place.name,
      description: place.description,
      category: place.category,
      ticketPrices: place.ticketPrices || [],
      currency: place.currency,
      location: place.location,
    });
  };

  const handleAddTicketPrice = () => {
    if (newTicketType && newTicketPrice) {
      setEditedPlace((prev) => ({
        ...prev,
        ticketPrices: [
          ...prev.ticketPrices,
          { type: newTicketType, price: parseFloat(newTicketPrice) },
        ],
      }));
      setNewTicketType("");
      setNewTicketPrice("");
    }
  };

  const handleRemoveTicketPrice = (index) => {
    setEditedPlace((prev) => ({
      ...prev,
      ticketPrices: prev.ticketPrices.filter((_, i) => i !== index),
    }));
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
              {/* Place Image */}
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
                              alt={`${place.name} image ${index + 1}`}
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

              {/* Place Info */}
              <div className="flex flex-col justify-between">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedPlace.name}
                        onChange={handleInputChange}
                        placeholder="Place Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editedPlace.description}
                        onChange={handleInputChange}
                        placeholder="Place Description"
                      />
                    </div>

                    <div>
                      <Label>Ticket Prices</Label>
                      {editedPlace.ticketPrices.map((ticket, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mt-2"
                        >
                          <Input
                            value={ticket.type}
                            onChange={(e) => {
                              const newTicketPrices = [
                                ...editedPlace.ticketPrices,
                              ];
                              newTicketPrices[index].type = e.target.value;
                              setEditedPlace((prev) => ({
                                ...prev,
                                ticketPrices: newTicketPrices,
                              }));
                            }}
                            placeholder="Ticket Type"
                          />
                          <Input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => {
                              const newTicketPrices = [
                                ...editedPlace.ticketPrices,
                              ];
                              newTicketPrices[index].price = parseFloat(
                                e.target.value
                              );
                              setEditedPlace((prev) => ({
                                ...prev,
                                ticketPrices: newTicketPrices,
                              }));
                            }}
                            placeholder="Price"
                          />
                          <Button
                            onClick={() => handleRemoveTicketPrice(index)}
                            variant="destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          value={newTicketType}
                          onChange={(e) => setNewTicketType(e.target.value)}
                          placeholder="New Ticket Type"
                        />
                        <Input
                          type="number"
                          value={newTicketPrice}
                          onChange={(e) => setNewTicketPrice(e.target.value)}
                          placeholder="New Price"
                        />
                        <Button onClick={handleAddTicketPrice}>Add</Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        name="currency"
                        value={editedPlace.currency}
                        onChange={handleInputChange}
                        placeholder="Currency"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button onClick={handleCancel} variant="outline">
                        Cancel
                      </Button>
                      <Button onClick={handleDelete} color="destructive">
                        Delete Place
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {editedPlace.name}
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
                        {place.ratings}
                      </span>
                    </div>
                    {/* Place Details */}
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Category:</span>{" "}
                        {editedPlace.category}
                      </p>
                      <div>
                        <span className="font-semibold">Ticket Prices:</span>
                        <ul className="text-sm text-gray-600">
                          {editedPlace.ticketPrices.map((ticket, index) => (
                            <li key={index}>
                              {ticket.type}: {editedPlace.currency}{" "}
                              {ticket.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/* Favorite Button and Share Button */}
                    <div className="flex space-x-4 mb-6">
                      <Button className="flex-1" onClick={handleEdit}>
                        <Icon
                          icon="heroicons:pencil"
                          className="w-4 h-4 mr-2"
                        />
                        Edit Place
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

            {/* Place Description Tabs */}
            <Tabs defaultValue="info" className="w-full mt-8">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="info">Place Information</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="Location">Location</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">{editedPlace.description}</p>
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
              <TabsContent value="Location" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-semibold">Location:</span>{" "}
                      {editedPlace.location}
                      <Button
                        variant="outline"
                        className="ml-4"
                        onClick={() => {
                          const mapUrl = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
                          window.open(mapUrl, "_blank");
                        }}
                      >
                        <Icon
                          icon="heroicons:location-marker"
                          className="w-4 h-4 mr-2"
                        />
                        Open in Maps
                      </Button>
                    </p>
                    <div className="w-full h-64 rounded-lg">
                      <NonMovableMap
                        initialLocation={[place.longitude, place.latitude]}
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
      <CustomConfirmationDialog
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this place?"
      />
    </Dialog>
  );
}
