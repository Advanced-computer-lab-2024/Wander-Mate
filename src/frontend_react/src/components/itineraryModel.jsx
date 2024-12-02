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
import { Navigate, useNavigate } from "react-router-dom";
import PayNow from "./payNow";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Import the star icons
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselContent,
} from "./ui/carousel";

export default function ItineraryModel({
  itinerary,
  isOpen,
  setIsOpen,
  children,
}) {
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [count, setCount] = useState(1);
  const [userAge, setUserAge] = useState(null);
  const maxQuantity = itinerary.maxQuantity || 10000000000000000; // Assuming a max quantity limit
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const navigateToTourGuide = () => {
    const creatorData = encodeURIComponent(JSON.stringify(itinerary.Creator)); // Serialize creator data
    navigate(`/itineraryTourGuide?creator=${creatorData}`);
  };
  const images = itinerary.images;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Full stars (integer part of the rating)
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star if the remainder is >= 0.5
    const emptyStars = 5 - fullStars - halfStars; // Remaining empty stars

    // Create an array of JSX elements for the stars
    return [
      ...Array(fullStars).fill(<FaStar className="text-yellow-500" />), // Full stars
      ...Array(halfStars).fill(<FaStarHalfAlt className="text-yellow-500" />), // Half star
      ...Array(emptyStars).fill(<FaRegStar className="text-yellow-500" />), // Empty stars
    ];
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

  const handleBook = () => {
    if (!selectedDate) {
      toast.error("Please select a date before booking!");
      return;
    }

    if (userAge < 18) {
      toast.error("You must be 18 or older to book this itinerary.");
      return;
    }

    if (!isBooked) {
      setIsBooked(true);
    }
  };

  const incrementCount = () => {
    if (count < maxQuantity) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    } else {
      setIsBooked(false);
    }
  };

  const finishBooking = async () => {
    try {
      navigate("/payNow");
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();
      await axios.post(`http://localhost:8000/bookItinerary`, {
        userId: userID,
        itineraryId: itinerary._id,
        bookedCount: count,
      });

      toast.success("Booking successful!");
    } catch (error) {
      console.error("Error booking itinerary:", error);
      toast.error("Failed to book itinerary");
      setIsBooked(false);
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

  const doNothing = () => {};

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
  const fetchUserAge = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");
      const { userID } = await reply.json();
      const userResponse = await fetch(`http://localhost:8000/gettourist/${userID}`);
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
  fetchUserAge();
  const handleShare = (method) => {
    // Get the current URL without query parameters
    const currentUrl = window.location.href.split("?")[0];

    // Construct the share URL with the itinerary ID
    const shareUrl = `${currentUrl}?open=true&itinerary=${itinerary.itineraryId}`;

    // Construct the share text using the itinerary name
    const shareText = `Check out this amazing itinerary: ${itinerary.name}`;

    // Handle different sharing methods
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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
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
              {/* Itinerary Images */}
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

              {/* Itinerary Details */}
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
                      <span className="font-semibold">Price:</span>{" "}
                      {itinerary.currrn} {itinerary.price || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Ratings:</span>{" "}
                      {itinerary.rating}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Available Dates:</span>
                    </p>
                    <div className="flex space-x-4">
                      {itinerary.AvailableDates ? (
                        itinerary.AvailableDates.map((date, index) => {
                          const formattedDate = new Date(
                            date.$date || date
                          ).toLocaleDateString();
                          return (
                            <button
                              key={index}
                              className={`px-4 py-2 rounded transition-colors duration-200 ${
                                selectedDate === formattedDate
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-white"
                              }`}
                              onClick={() => handleDateSelect(formattedDate)}
                            >
                              {formattedDate}
                            </button>
                          );
                        })
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>

                    {/* Display selected date */}
                    {selectedDate && (
                      <p className="text-sm text-gray-600 mt-4">
                        <span className="font-semibold">Selected Date:</span>{" "}
                        {selectedDate}
                      </p>
                    )}
                  </div>

                  {/* Favorite and Share Buttons */}
                  <div className="space-y-4">
  <div className="flex space-x-4">
    <Button
      className={`flex-1 ${isFavorite ? "bg-red-500 hover:bg-red-600" : ""}`}
      onClick={handleToggleFavorite}
    >
      <Icon
        icon={isFavorite ? "ph:heart-fill" : "ph:heart"}
        className="w-4 h-4 mr-2"
      />
      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
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

  {/* Add spacing below the buttons */}
  {!isBooked ? (
    <div className="flex flex-col items-center">
      <Button
        className="text-white w-full"
        onClick={handleBook}
        disabled={userAge < 18}
      >
        <Icon
          icon="heroicons:shopping-bag"
          className="w-4 h-4 mr-2"
        />
        Book
      </Button>
      {userAge < 18 && (
        <p className="text-red-500 text-sm mt-2">
          You must be at least 18 years old to book.
        </p>
      )}
    </div>
  ) : (
    <div className="flex items-center space-x-4">
      <div className="flex-2 h-10 flex border border-1 border-primary delay-150 ease-in-out divide-x-[1px] text-sm font-normal divide-primary rounded">
        <button
          type="button"
          className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={decrementCount}
        >
          <Icon icon="eva:minus-fill" />
        </button>
        <span className="px-4 py-2 text-gray-600">
          {count}
        </span>
        <button
          type="button"
          className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={incrementCount}
          disabled={count >= maxQuantity}
        >
          <Icon icon="eva:plus-fill" />
        </button>
      </div>

      {/* <Button
        variant="outline"
        onClick={finishBooking}
        className="py-2 px-5"
      >
        <Icon icon="heroicons:check-circle" className="w-4 h-4" />
        Confirm Booking
      </Button> */}
      <PayNow
        amount={count * itinerary.price}
        itinerary={itinerary}
        count={count}
        bookedDate={selectedDate}
      />
    </div>
  )}
</div>

                </div>
              </div>
            </div>

            {/* Itinerary Description Tabs */}
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Itinerary Information</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="map">Pickup Location</TabsTrigger>
                <TabsTrigger value="map1">Dropoff Location</TabsTrigger>
                <TabsTrigger value="tourGuide">Tour Guide Details:</TabsTrigger>
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
                        onLocationSelect={doNothing}
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
                          <span>{itinerary.Creator.Email || "N/A"}</span>
                        </div>

                        <div>
                          <strong>Username: </strong>
                          <span
                            className="cursor-pointer text-blue-500"
                            onClick={navigateToTourGuide} // This will trigger navigation
                          >
                            {itinerary.Creator.Username || "N/A"}
                          </span>
                        </div>

                        <div>
                          <strong>Average Rating: </strong>
                          <div className="flex items-center">
                            {itinerary.Creator.averageRating
                              ? renderStars(
                                  itinerary.Creator.averageRating
                                ).map((star, index) => (
                                  <span key={index}>{star}</span>
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
