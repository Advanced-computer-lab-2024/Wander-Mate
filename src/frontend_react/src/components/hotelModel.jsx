import React, { useState } from "react";
import {
  X,
  Bed,
  Users,
  Wifi,
  Coffee,
  Tv,
  Calendar,
  CreditCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import HotelCheckOut from "./hotelCheckout";
import { Icon } from "@iconify/react";
const HotelModal = ({
  children,
  hotel,
  isOpen,
  setIsOpen,
  checkInDate,
  checkOutDate,
}) => {
  const [roomType, setRoomType] = useState("single");
  const [roomCount, setRoomCount] = useState(1);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    console.log("Booking:", {
      hotel,
      roomType,
      roomCount,
      checkInDate,
      checkOutDate,
      additionalServices,
      paymentMethod,
    });
    setIsOpen(false);
  };

  const calculateTotalPrice = () => {
    const numericPrice = parseFloat(hotel.price.replace(/[^0-9.]/g, "")); // Extract numeric value

    // Determine additional cost based on room type
    let roomTypeIncrement = 0;
    if (roomType === "double") {
      roomTypeIncrement = 50;
    } else if (roomType === "suite") {
      roomTypeIncrement = 150;
    }

    const basePrice = (numericPrice + roomTypeIncrement) * roomCount; // Adjust base price
    const additionalCost = additionalServices.length * 10; // Additional service cost
    return basePrice + additionalCost; // Total price
  };
  const handleBook = () => {
    if (!isBooked) {
      setIsBooked(true);
    }
  };

  return (
    <>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]" size="full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {hotel.title}
            </DialogTitle>
            <DialogDescription>
              Book your perfect stay at {hotel.title}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="roomType">Room Type</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger id="roomType">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent portal={false}>
                  <SelectItem value="single">
                    <div className="flex items-center">
                      <Bed className="mr-2 h-4 w-4" />
                      Single Room
                    </div>
                  </SelectItem>
                  <SelectItem value="double">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Double Room
                    </div>
                  </SelectItem>
                  <SelectItem value="suite">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Suite
                    </div>
                  </SelectItem>
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
                {[
                  { id: "wifi", label: "Wi-Fi", icon: Wifi },
                  { id: "breakfast", label: "Breakfast", icon: Coffee },
                  { id: "tv", label: "Smart TV", icon: Tv },
                  {
                    id: "earlyCheckin",
                    label: "Early Check-in",
                    icon: Calendar,
                  },
                ].map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <input
                      id={service.id}
                      type="checkbox"
                      checked={additionalServices.includes(service.id)}
                      onChange={(e) => {
                        setAdditionalServices((prevServices) =>
                          e.target.checked
                            ? [...prevServices, service.id]
                            : prevServices.filter((id) => id !== service.id)
                        );
                      }}
                      className="form-checkbox h-4 w-4"
                    />
                    <Label htmlFor={service.id} className="flex items-center">
                      <service.icon className="w-4 h-4 mr-2" />
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold">Total Price</p>
            <p className="text-2xl font-bold">${calculateTotalPrice()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="mt-5"
            >
              Cancel
            </Button>
            {!isBooked ? (
              <Button
                className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white w-full"
                onClick={handleBook}
              >
                <Icon icon="heroicons:shopping-bag" className="w-4 h-4 mr-2" />
                Book Hotel
              </Button>
            ) : (
              <HotelCheckOut
                hotel={hotel}
                roomType={roomType}
                roomCount={roomCount}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                additionalServices={additionalServices}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HotelModal;
