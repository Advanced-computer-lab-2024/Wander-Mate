import React, { useState, useEffect } from "react";
import { Star, Plane, Shield, Calendar } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import PayForFlight from "./payForFlight";
import toast from "react-hot-toast";

const Flight = ({ flight }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
  const [userAge, setUserAge] = useState(null);
  const combo = sessionStorage.getItem("curr");

  useEffect(() => {
    fetchUserAge();
    fetchExchangeRates();
  }, []);

  if (!flight) {
    return <div>No flight data available</div>;
  }

  const departureSegment = flight.itineraries?.[0]?.segments?.[0];
  const arrivalSegment = flight.itineraries?.[0]?.segments?.slice(-1)[0];

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

  const handlePaymentSuccess = () => {
    setIsBooking(false);
    setBookingError(null);
    console.log("Booking successful!");
  };

  const handlePaymentError = (error) => {
    setBookingError(error.message || "Payment failed. Please try again.");
    setIsBooking(false);
  };

  return (
    <Card className="p-4 rounded-md cursor-pointer h-full flex flex-col w-full max-w-md">
      <div className="relative h-[191px] mb-3 rounded-md overflow-hidden w-full">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem className="w-full">
              <div className="flex items-center justify-center h-[191px] w-full bg-sky-100">
                <Plane className="w-24 h-24 text-sky-500" />
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <Badge className="absolute top-2 left-2 bg-sky-400 text-sky-900">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(departureSegment?.departure?.at).toLocaleDateString()}
        </Badge>
      </div>
      <CardContent className="flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2">
          {departureSegment?.carrierCode || "N/A"}
          {departureSegment?.number || "N/A"}
        </h3>
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                {(flight.price?.total / (exchangeRates[currency] || 1)).toFixed(
                  2
                )}{" "}
                {flight.price?.currency || ""}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                per person
              </span>
            </div>
            <div className="flex items-center mt-1">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="text-sm font-semibold">
                {flight.itineraries?.[0]?.duration || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          <Shield className="w-4 h-4 mr-1 inline" />
          <span className="ml-1">
            From: {departureSegment?.departure?.iataCode || "N/A"} To:{" "}
            {arrivalSegment?.arrival?.iataCode || "N/A"}
          </span>
        </div>
        <div className="mt-auto">
          {!isBooking ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={handleBook}
              disabled={userAge < 18}
            >
              {userAge < 18 ? "Must be 18+ to Book" : "Book Flight"}
            </Button>
          ) : (
            <PayForFlight
              amount={flight.price.total}
              flight={flight}
              departureSegment={departureSegment}
              arrivalSegment={arrivalSegment}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </div>
        {bookingError && <p className="text-red-500 mt-2">{bookingError}</p>}
      </CardContent>
    </Card>
  );
};

export default Flight;
