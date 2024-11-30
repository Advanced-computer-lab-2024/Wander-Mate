import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";
import axios from "axios";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../forms/PaymentForm";
import { Bed, Users, Wifi, Coffee, Tv, Calendar } from 'lucide-react';

const stripePromise = loadStripe(
  "pk_test_51QNbspEozkMz2Yq3CeUlvq37Ptboa8zRKVDaiVjjzrwP8tZPcKmo4QKsCQzCFVn4d0GnDBm2O3p2zS5v3pA7BUKg00xjpsuhcW"
);

const HotelCheckOut = ({ hotel, userId, voucherCode }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalSlide, setTotalSlide] = useState(3);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selected, setSelected] = useState("rwb_1");
  const [roomType, setRoomType] = useState("single");
  const [roomCount, setRoomCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [additionalServices, setAdditionalServices] = useState([]);

  const navigate = useNavigate();

  const handleValueChange = (value) => {
    setSelected(value);
    setPaymentMethod(value === "rwb_2" ? "cash" : "credit");
  };

  useEffect(() => {
    setTotalSlide(paymentMethod === "cash" ? 2 : 3);
  }, [paymentMethod]);

  const calculateTotalPrice = () => {
    if (!hotel || !hotel.price) return 0;
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

  const applyPromoCode = async () => {
    if (voucherCode) {
      try {
        await axios.post(`http://localhost:8000/applyPromoCode/${userId}`, {
          promoCode: voucherCode.code,
          purchaseAmount: calculateTotalPrice(),
        });
        toast({
          title: "Promo Code Applied",
          description: "Your promo code has been successfully applied.",
        });
      } catch (error) {
        console.error("Error applying promo code:", error);
        toast({
          title: "Error",
          description: "Failed to apply promo code. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    }
  };

  const handlePayment = async () => {
    if (!hotel) {
      setAlertMessage("Hotel information is missing. Please try again.");
      return;
    }

    try {
      await applyPromoCode();

      const response = await axios.post("http://localhost:8000/bookHotel", {
        userId,
        hotelId: hotel.id,
        title: hotel.title,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        price: calculateTotalPrice(),
        provider: hotel.provider,
        roomType,
        roomCount,
        additionalServices,
      });

      if (response.status === 201) {
        toast({
          title: "Booking Successful",
          description: "Your hotel has been booked successfully.",
        });
        setActiveIndex(totalSlide);
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNextSlide = () => {
    if (activeIndex === 2 && selected === "rwb_1") {
      handlePayment();
    } else if (activeIndex === totalSlide - 1) {
      handlePayment();
    } else {
      setActiveIndex(activeIndex + 1);
      setAlertMessage(null);
    }
  };

  const handleWallet = async () => {
    try {
      const response = await axios.put("http://localhost:8000/payWithWallet", {
        userId,
        amount: calculateTotalPrice(),
      });
      if (response.status !== 200) {
        setAlertMessage(response.data || "Payment failed.");
      } else {
        await handlePayment();
      }
    } catch (error) {
      setAlertMessage("Insufficient balance");
    }
  };

  const handlePrevSlide = () => {
    if (activeIndex > 1) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handlePaymentSuccess = () => {
    setActiveIndex(totalSlide);
  };

  const handlePaymentError = (error) => {
    setAlertMessage(error);
  };

  if (!hotel) {
    return <div>Loading hotel information...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full text-white py-2 rounded mt-1">
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent size="2xl" className="p-0">
        <DialogHeader className="p-2 pb-0">
          {alertMessage && (
            <Alert color="destructive" variant="soft" className="mb-4">
              <Icon
                icon="heroicons:exclamation-triangle"
                className="h-4 w-4"
              />
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          <DialogTitle className="text-base font-medium">
            Book Hotel
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh]">
          <ScrollArea className="h-full px-6">
            {activeIndex === 1 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    defaultValue="rwb_1"
                    onValueChange={handleValueChange}
                  >
                    <Label
                      htmlFor="rwb_1"
                      className={cn(
                        "flex justify-between items-center gap-2 bg-default-100 px-3 py-2.5 w-full rounded-md cursor-pointer",
                        { "bg-primary": selected === "rwb_1" }
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon
                          icon="mdi:credit-card-outline"
                          className="text-lg"
                        />
                        <span
                          className={cn("font-base text-default-800", {
                            "text-primary-foreground": selected === "rwb_1",
                          })}
                        >
                          Credit/Debit Card
                        </span>
                      </span>
                      <RadioGroupItem
                        value="rwb_1"
                        id="rwb_1"
                        className="data-[state=checked]:text-primary-foreground data-[state=checked]:border-white"
                      />
                    </Label>

                    {/* <Label
                      htmlFor="rwb_2"
                      className={cn(
                        "flex justify-between items-center gap-2 bg-default-100 px-3 py-2.5 w-full rounded-md cursor-pointer",
                        { "bg-primary": selected === "rwb_2" }
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon icon="mdi:cash-multiple" className="text-lg" />
                        <span
                          className={cn("font-base text-default-800", {
                            "text-primary-foreground": selected === "rwb_2",
                          })}
                        >
                          Cash on Arrival
                        </span>
                      </span>
                      <RadioGroupItem
                        value="rwb_2"
                        id="rwb_2"
                        className="data-[state=checked]:text-primary-foreground data-[state=checked]:border-white"
                      />
                    </Label> */}

                    <Label
                      htmlFor="rwb_3"
                      className={cn(
                        "flex justify-between items-center gap-2 bg-default-100 px-3 py-2.5 w-full rounded-md cursor-pointer",
                        { "bg-primary": selected === "rwb_3" }
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon icon="mdi:wallet" className="text-lg" />
                        <span
                          className={cn("font-base text-default-800", {
                            "text-primary-foreground": selected === "rwb_3",
                          })}
                        >
                          Using Wallet
                        </span>
                      </span>
                      <RadioGroupItem
                        value="rwb_3"
                        id="rwb_3"
                        className="data-[state=checked]:text-primary-foreground data-[state=checked]:border-white"
                      />
                    </Label>
                  </RadioGroup>
                </div>
               
                <div className="bg-default-100 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Booking Summary</h3>
                  <p><strong>Hotel:</strong> {hotel.title}</p>
                  <p><strong>Room Type:</strong> {roomType}</p>
                  <p><strong>Number of Rooms:</strong> {roomCount}</p>
                  <p><strong>Check-in:</strong> {checkInDate || 'Not set'}</p>
                  <p><strong>Check-out:</strong> {checkOutDate || 'Not set'}</p>
                  <p><strong>Additional Services:</strong> {additionalServices.join(', ') || 'None'}</p>
                  <p><strong>Total Price:</strong> ${calculateTotalPrice()}</p>
                </div>
              </div>
            )}

            {activeIndex === 2 && selected === "rwb_1" && (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={calculateTotalPrice()}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </Elements>
            )}

            {activeIndex === totalSlide && (
              <div className="flex flex-col items-center">
                <span className="text-7xl text-success">
                  <Icon icon="material-symbols:check-circle-outline" />
                </span>
                <h3 className="mt-3 text-success text-2xl font-semibold">
                  Booking Successful
                </h3>
                <p className="mt-4 text-lg font-semibold text-default-600">
                  Thank you for your reservation!
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
        <div className="p-6 pt-4 flex justify-between">
          {activeIndex !== 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevSlide}
              disabled={activeIndex === 1 || activeIndex === totalSlide}
            >
              Previous
            </Button>
          ) : (
            <DialogClose asChild variant="outline">
              <Button type="button">Close</Button>
            </DialogClose>
          )}
          {activeIndex === totalSlide ? (
            <DialogClose asChild>
              <Button type="button" onClick={() => navigate("/hotels")}>
                Close
              </Button>
            </DialogClose>
          ) : (
            <Button
              type="button"
              onClick={selected === "rwb_3" ? handleWallet : handleNextSlide}
            >
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelCheckOut;

