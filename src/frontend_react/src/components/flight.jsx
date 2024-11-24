import React from "react";
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";

const Flight = (props) => {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  if (!props.flight) {
    return <div>No flight data available</div>;
  }

  const departureSegment = props.flight.itineraries?.[0]?.segments?.[0];
  const arrivalSegment = props.flight.itineraries?.[0]?.segments?.slice(-1)[0];

  const handleBooking = async () => {
    setIsBooking(true);
    setBookingError(null);

    // const username = sessionStorage.getItem("username");
    // if (!username) {
    //   alert("Username is required to book a flight.");
    //   setIsBooking(false);
    //   return;
    // }
    const username = "Tourist";
    try {
      const response = await axios.get(
        `http://localhost:8000/getID/${username}`
      );
      const userID = response.data.userID;
      console.log("Retrieved ID", userID);

      const bookingData = {
        userID,
        flightID: props.flight.id,
        price: props.flight.price.total,
        departureDate: departureSegment?.departure?.at,
        arrivalDate: arrivalSegment?.arrival?.at,
      };
      const response2 = await axios.post(
        `http://localhost:8000/book-flight/${userID}`,
        bookingData
      );
      alert(
        "Flight booked successfully! Confirmation Number: " +
          response2.data.bookingDetails.confirmationNumber
      );
    } catch (error) {
      console.error("Error booking flight:", error);
      setBookingError("Failed to book the flight. Please try again later.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-[#EAF0F0] rounded-b-3xl rounded-tr-3xl p-7">
      <h3 className="mb-3">Flight Details</h3>
      <p>
        Flight: {departureSegment?.carrierCode ?? "N/A"}
        {departureSegment?.number ?? "N/A"}
      </p>
      <p>Departure: {departureSegment?.departure?.at ?? "N/A"}</p>
      <p>Arrival: {arrivalSegment?.arrival?.at ?? "N/A"}</p>
      <p>
        From: {departureSegment?.departure?.iataCode ?? "N/A"}
        <br />
        To: {arrivalSegment?.arrival?.iataCode ?? "N/A"}
      </p>
      <p>
        Price: {props.flight.price?.total ?? "N/A"}
        {props.flight.price?.currency ?? ""}
      </p>
      <Button
        className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px] mt-3"
        onClick={handleBooking}
        disabled={isBooking}
      >
        {isBooking ? "Booking..." : "Book"}
      </Button>
      {bookingError && <p className="text-danger mt-2">{bookingError}</p>}
    </div>
  );
};

export default Flight;
