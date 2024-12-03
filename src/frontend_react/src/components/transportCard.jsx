import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomPopover as Popover } from "./ui/popover";
import { toast, Toaster } from "react-hot-toast";
import Car from "../public/images/car.png";
import Bus from "../public/images/bus.png";
import Boat from "../public/images/boat.png";
import Helicopter from "../public/images/helicopter.png";
import Transportation from "../pages/transportations";
import PayForTransportation from "./payForTransportation";

const TransportationCard = ({
  transportationId,
  destination,
  startPlace,
  price,
  vehicleType,
  availability,
  discount,
  ratings = 0,
  date,
  advertiserId,
  quantity = 3,
  currrn,
}) => {
  const [isBooked, setIsBooked] = useState(false);
  const [count, setCount] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advertiser, setAdvertiser] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [userAge, setUserAge] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
  const isAvailable = () => {
    if (availability) {
      return true;
    } else {
      return false;
    }
  };

  const goToBookings = () => {
    navigate("/bookings");
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const openParam = searchParams.get("open");
    const transportationParam = searchParams.get("transportation");
    const fetchExchangeRates = async () => {
      try {
        const c = sessionStorage.getItem("curr");
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${c}`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();

    if (openParam === "true" && transportationParam === transportationId) {
      setIsModalOpen(true);
      fetchAdvertiserInfo();
    }
  }, [location, transportationId]);

  // const handleBook = () => {
  //   if (!availability) return;
  //   setIsBooked(true);
  // };

  // const finishBooking = async () => {
  //   try {
  //     const username = sessionStorage.getItem("username");
  //     const reply = await fetch(`http://localhost:8000/getID/${username}`);
  //     if (!reply.ok) throw new Error("Failed to get tourist ID");

  //     const { userID } = await reply.json();
  //     const response = await axios.post(
  //       `http://localhost:8000/bookTransportation`,
  //       {
  //         userId: userID,
  //         itemId: transportationId,
  //         bookedDate: date,
  //       }
  //     );
  //     toast.success("Booking successful!");
  //   } catch (error) {
  //     console.error("Error booking transportation:", error);
  //     toast.error("Failed to book transportation");
  //     setIsBooked(false);
  //   }
  // };
  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    } else {
      setCount(1);
      setIsBooked(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case "Car":
        return "mdi:car";
      case "Bus":
        return "mdi:bus";
      case "Boat":
        return "mdi:boat";
      case "Helicopter":
        return "mdi:helicopter";
      default:
        return "mdi:car";
    }
  };

  const fetchAdvertiserInfo = async () => {
    try {
      console.log(advertiserId);
      const response = await axios.get(
        `http://localhost:8000/getAdvertiserById/${advertiserId}`
      );
      setAdvertiser(response.data.advertiser);
    } catch (error) {
      console.error("Error fetching advertiser information:", error);
    }
  };

  const handleOpenChange = (open) => {
    setIsModalOpen(open);
    if (open) {
      fetchAdvertiserInfo();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("open");
      url.searchParams.delete("transportation");
      window.history.replaceState({}, "", url);
    }
  };

  const handleShare = (method) => {
    const currentUrl = window.location;
    const shareUrl = `${currentUrl}?open=true&transportation=${transportationId}`;
    const shareText = `Check out this amazing Transportation!`;

    if (method === "link") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast("Link copied to Clipboard!", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
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
  const handleBook = () => {
    

    if (userAge < 18) {
      toast.error("You must be 18 or older to book this itinerary.");
      return;
    }

    if (!isBooking) {
      setIsBooking(true);
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

  const handlePaymentSuccess = () => {
    setIsBooking(false);
    setBookingError(null);
    // Additional logic for successful booking
    console.log("Booking successful!");
  };

  const handlePaymentError = (error) => {
    setBookingError(error.message || "Payment failed. Please try again.");
    setIsBooking(false);
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Card className="p-4 rounded-md cursor-pointer">
            <div className="relative h-[191px] flex flex-col justify-center items-center mb-3 rounded-md">
              <div
                className="w-full overflow-hidden rounded-md relative z-10 bg-default-100 dark:bg-default-200 h-full group"
                style={{ left: "0%", top: "0%" }}
              >
                <img
                  src={
                    vehicleType === "Car"
                      ? Car
                      : vehicleType === "Bus"
                        ? Bus
                        : vehicleType === "Boat"
                          ? Boat
                          : Helicopter
                  }
                  alt={`${vehicleType} to ${destination}`}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                {discount > 0 && (
                  <Badge
                    color="destructive"
                    className="absolute top-3 ltr:left-3 rtl:right-3"
                  >
                    -{discount}%
                  </Badge>
                )}
                <div className="hover-box flex flex-col invisible absolute top-3 right-2 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 space-y-[6px]">
                  <button
                    className="rounded-full bg-background p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                  >
                    <Icon
                      icon={isLiked ? "ph:heart-fill" : "ph:heart"}
                      className={`h-4 w-4 ${
                        isLiked ? "text-red-500" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-base mb-2">{destination}</p>
                <span className="flex items-center text-secondary-foreground font-normal text-xs gap-x-1">
                  <Icon icon="ph:star-fill" className="text-yellow-400" />
                  <span>{ratings}</span>
                </span>
              </div>

              <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
                From: {startPlace}
              </p>

              <div className="flex items-center justify-between mb-4">
                <p className="space-x-4">
                  <span className="text-secondary-foreground text-base font-medium">
                    {currrn} {discount > 0 ? price - (price * discount) / 100 : (price/ (exchangeRates[currency] || 1)).toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <del className="text-default-500 dark:text-default-500 font-normal text-base">
                      {price}
                    </del>
                  )}
                </p>
                <p
                  className={`text-sm ${
                    availability ? "text-green-500" : "text-red-500"
                  } font-semibold`}
                >
                  {availability ? "Available" : "Not Available"}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center text-secondary-foreground font-normal text-sm gap-x-1">
                  <Icon
                    icon={getVehicleIcon(vehicleType)}
                    className="w-5 h-5"
                  />
                  <span>{vehicleType}</span>
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(date).toLocaleDateString()}
                </span>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <Icon icon="ph:info" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                Show More Details
              </Button>
            </div>
          </Card>
        </DialogTrigger>

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
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={
                      vehicleType === "Car"
                        ? Car
                        : vehicleType === "Bus"
                          ? Bus
                          : vehicleType === "Boat"
                            ? Boat
                            : Helicopter
                    }
                    alt={`${vehicleType} to ${destination}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {vehicleType} to {destination}
                    </h1>

                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          icon="ph:star-fill"
                          className={`w-5 h-5 ${
                            i < Math.floor(ratings)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({ratings})
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">
                        {currrn}{" "}{(price/ (exchangeRates[currency] || 1)).toFixed(2)}
                      </span>
                      {discount > 0 && (
                        <>
                          <span className="ml-2 text-lg line-through text-gray-500">
                            {((price/ (exchangeRates[currency] || 1)) + ((price/ (exchangeRates[currency] || 1)) * discount) / 100).toFixed(2)}
                          </span>
                          <span className="ml-2 text-lg font-semibold text-green-600">
                            {discount}% Off
                          </span>
                        </>
                      )}
                    </div>

                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Availability:</span>{" "}
                        <span
                          className={`text-sm ${
                            availability
                              ? "text-green-500"
                              : "text-red-500 font-semibold"
                          }`}
                        >
                          {availability ? "Available" : "Not Available"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">From:</span>{" "}
                        {startPlace}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-4 mb-6">
                      {/* {!isBooked ? (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAvailable()) {
                              handleBook();
                            } else {
                              // Implement notify me functionality here
                              console.log("Notify me when available");
                              // You can add a function to handle the notification sign-up
                            }
                          }}
                        >
                          <Icon
                            icon={
                              isAvailable()
                                ? "heroicons:shopping-bag"
                                : "heroicons:bell"
                            }
                            className="w-4 h-4 ltr:mr-2 rtl:ml-2"
                          />
                          {isAvailable()
                            ? "Book a ticket"
                            : "Notify Me When Available"}
                        </Button>
                      ) : (
                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 h-10 flex border border-1 border-primary delay-150 ease-in-out divide-x-[1px] text-sm font-normal divide-primary rounded">
                            <button
                              type="button"
                              className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                decrementCount();
                              }}
                            >
                              <Icon icon="eva:minus-fill" />
                            </button>

                            <div className="flex-1 text-base py-2 flex items-center min-w-[45px] justify-center text-primary font-medium">
                              {count}
                            </div>
                            <button
                              type="button"
                              className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                incrementCount();
                              }}
                              disabled={count >= quantity}
                            >
                              <Icon icon="eva:plus-fill" />
                            </button>
                          </div>
                          <Button
                            variant="outline"
                            className="py-2 px-5 flex-none"
                          >
                            <Icon
                              icon="heroicons:shopping-bag"
                              className="w-4 h-4"
                            />
                            Pay now
                          </Button>
                        </div>
                      )} */}
                     {!isBooking ? (
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
                        <PayForTransportation
                          amount={(price/ (exchangeRates[currency] || 1))}
                          transportationId={transportationId}
                          date={date}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                        />
                      )}
                      {bookingError && (
                        <p className="text-red-500 mt-2">{bookingError}</p>
                      )}
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

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="info">
                    Transportation Information
                  </TabsTrigger>
                  <TabsTrigger value="advertiser">Advertiser</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">
                        Travel from {startPlace} to {destination} via{" "}
                        {vehicleType}. Enjoy a comfortable and safe journey on{" "}
                        {new Date(date).toLocaleDateString()}.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="advertiser" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      {advertiser ? (
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={getImageSrc(advertiser.picture)}
                              alt={advertiser.FullName}
                            />
                            <AvatarFallback>
                              {advertiser.FullName
                                ? advertiser.FullName.charAt(0)
                                : advertiser.Username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {advertiser.FullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Email: {advertiser.Email}
                            </p>
                            {advertiser.Website && (
                              <p className="text-sm text-gray-600">
                                Website: {advertiser.Website}
                              </p>
                            )}
                            {advertiser.Hotline && (
                              <p className="text-sm text-gray-600">
                                Hotline: {advertiser.Hotline}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          Loading advertiser information...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransportationCard;
