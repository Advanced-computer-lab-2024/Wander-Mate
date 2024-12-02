import React, { useState } from "react";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import PayForFlight from "./payForFlight";
import toast from "react-hot-toast";
const Flight = ({ flight }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
  const [userAge, setUserAge] = useState(null);
  const combo = sessionStorage.getItem("curr");

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
  flight.price.currency=[combo];
  fetchExchangeRates();

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
    <div className="bg-[#EAF0F0] rounded-b-3xl rounded-tr-3xl p-7">
      <h3 className="text-2xl font-bold mb-4">Flight Details</h3>
      <p>
        Flight: {departureSegment?.carrierCode || "N/A"}
        {departureSegment?.number || "N/A"}
      </p>
      <p>Departure: {departureSegment?.departure?.at || "N/A"}</p>
      <p>Arrival: {arrivalSegment?.arrival?.at || "N/A"}</p>
      <p>
        From: {departureSegment?.departure?.iataCode || "N/A"}
        <br />
        To: {arrivalSegment?.arrival?.iataCode || "N/A"}
      </p>
      <p className="mb-4">
        Price: {flight.price?.total/ (exchangeRates[currency] || 1).toFixed(2)}{" "}
        {flight.price?.currency || ""}
      </p>
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
        <PayForFlight
          amount={flight.price.total}
          flight={flight}
          departureSegment={departureSegment}
          arrivalSegment={arrivalSegment}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
      {bookingError && <p className="text-red-500 mt-2">{bookingError}</p>}
    </div>
  );
};

export default Flight;
