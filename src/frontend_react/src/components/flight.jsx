import React, { useState } from "react";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import PayForFlight from "./payForFlight";

const Flight = ({ flight }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
  const combo = sessionStorage.getItem("curr");

  if (!flight) {
    return <div>No flight data available</div>;
  }

  const departureSegment = flight.itineraries?.[0]?.segments?.[0];
  const arrivalSegment = flight.itineraries?.[0]?.segments?.slice(-1)[0];

  const handleBook = () => {
    setIsBooking(true);
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
        <Button
          className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white w-full"
          onClick={handleBook}
        >
          <Icon icon="heroicons:shopping-bag" className="w-4 h-4 mr-2" />
          Book Flight
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
      {bookingError && <p className="text-red-500 mt-2">{bookingError}</p>}
    </div>
  );
};

export default Flight;
