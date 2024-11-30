import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { ScrollArea } from "../components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import axios from "axios";

const HotelCheckout = ({ hotel, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [roomType, setRoomType] = useState("single");
  const [roomCount, setRoomCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [additionalServices, setAdditionalServices] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleValueChange = (value) => {
    setPaymentMethod(value === "wallet" ? "wallet" : "credit");
  };

  const calculateTotalPrice = () => {
    const numericPrice = parseFloat(hotel.price.replace(/[^0-9.]/g, ""));
    let roomTypeIncrement = 0;
    if (roomType === "double") {
      roomTypeIncrement = 50;
    } else if (roomType === "suite") {
      roomTypeIncrement = 150;
    }
    const basePrice = (numericPrice + roomTypeIncrement) * roomCount;
    const additionalCost = additionalServices.length * 10;
    return basePrice + additionalCost;
  };

  const handleNextSlide = () => {
    if (activeIndex === 1) {
      if (!checkInDate || !checkOutDate) {
        setAlertMessage("Please select check-in and check-out dates.");
        return;
      }
    }
    setActiveIndex((prevIndex) => prevIndex + 1);
    setAlertMessage(null);
  };

  const handlePrevSlide = () => {
    if (activeIndex > 1) {
      setActiveIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleBooking = async () => {
    try {
      const response = await axios.post("http://localhost:8000/bookHotel", {
        userId,
        hotelId: hotel.id,
        title: hotel.title,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        price: calculateTotalPrice(),
        provider: hotel.provider,
      });

      if (response.status === 201) {
        setActiveIndex(3); // Move to success screen
        toast({
          title: "Booking Successful",
          description: "Your hotel has been booked successfully!",
        });
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setAlertMessage("Failed to book the hotel. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Book Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Book Your Stay at {hotel.title}</DialogTitle>
        </DialogHeader>
        {alertMessage && (
          <Alert variant="destructive">
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="mt-4 max-h-[60vh]">
          {activeIndex === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="checkInDate">Check-in Date</Label>
                <Input
                  id="checkInDate"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="checkOutDate">Check-out Date</Label>
                <Input
                  id="checkOutDate"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="double">Double Room</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roomCount">Number of Rooms</Label>
                <Input
                  id="roomCount"
                  type="number"
                  value={roomCount}
                  onChange={(e) => setRoomCount(parseInt(e.target.value, 10))}
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <Label>Additional Services</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["wifi", "breakfast", "parking", "gym"].map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={service}
                        checked={additionalServices.includes(service)}
                        onChange={(e) => {
                          setAdditionalServices(prev =>
                            e.target.checked
                              ? [...prev, service]
                              : prev.filter(s => s !== service)
                          );
                        }}
                        className="form-checkbox h-4 w-4"
                      />
                      <Label htmlFor={service}>{service.charAt(0).toUpperCase() + service.slice(1)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeIndex === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Method</h3>
              <RadioGroup defaultValue="credit" onValueChange={handleValueChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet">Wallet</Label>
                </div>
              </RadioGroup>
              <Separator />
              <div>
                <h4 className="font-medium">Booking Summary</h4>
                <p>Check-in: {checkInDate}</p>
                <p>Check-out: {checkOutDate}</p>
                <p>Room Type: {roomType}</p>
                <p>Number of Rooms: {roomCount}</p>
                <p>Additional Services: {additionalServices.join(", ")}</p>
                <p className="font-bold">Total Price: ${calculateTotalPrice()}</p>
              </div>
            </div>
          )}
          {activeIndex === 3 && (
            <div className="flex flex-col items-center">
              <Icon icon="mdi:check-circle" className="text-6xl text-green-500" />
              <h3 className="mt-4 text-xl font-semibold">Booking Successful!</h3>
              <p className="mt-2 text-center">
                Thank you for booking with us. We hope you enjoy your stay!
              </p>
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          {activeIndex > 1 && activeIndex < 3 && (
            <Button variant="outline" onClick={handlePrevSlide}>
              Back
            </Button>
          )}
          {activeIndex < 2 && (
            <Button onClick={handleNextSlide}>Next</Button>
          )}
          {activeIndex === 2 && (
            <Button onClick={handleBooking}>Confirm Booking</Button>
          )}
          {activeIndex === 3 && (
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HotelCheckout;

