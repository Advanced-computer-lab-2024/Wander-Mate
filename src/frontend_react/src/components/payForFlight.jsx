import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import axios from "axios";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../forms/PaymentForm";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51QNbspEozkMz2Yq3CeUlvq37Ptboa8zRKVDaiVjjzrwP8tZPcKmo4QKsCQzCFVn4d0GnDBm2O3p2zS5v3pA7BUKg00xjpsuhcW"
);

const PayNow = ({
  amount,
  disabled,
  flight,
  departureSegment,
  arrivalSegment,
}) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalSlide, setTotalSlide] = useState(3);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selected, setSelected] = useState("rwb_1");
  const [userPoints, setUserPoints] = useState(0);
  const navigate = useNavigate();
  const [bookingError, setBookingError] = useState(null);

  const handleValueChange = (value) => {
    setSelected(value);
    setPaymentMethod(value === "rwb_3" ? "wallet" : "credit");
  };

  useEffect(() => {
    setTotalSlide(paymentMethod === "wallet" ? 2 : 3);
  }, [paymentMethod]);

  const handleWallet = async () => {
    // if (userPoints < amount) {
    //   setAlertMessage("Insufficient points to complete the transaction.");
    //   return;
    // }

    // try {
    //   const response = await axios.put("http://localhost:8000/payWithWallet", {
    //     touristID,
    //     amount,
    //   });
    const username = sessionStorage.getItem("username");
    const reply = await fetch(`http://localhost:8000/getID/${username}`);
    if (!reply.ok) throw new Error("Failed to get tourist ID");

    const { userID } = await reply.json();

    try {
      const response = await axios.put("http://localhost:8000/payWithWallet", {
        touristID: userID,
        amount,
      });
      if (response.status === 200) {
        setAlertMessage(null);
        handlePaymentSuccess();
        handleNextSlide();
      } else {
        setAlertMessage(response.data || "Payment failed.");
      }
    } catch (error) {
      setAlertMessage("An error occurred during the transaction.");
    }
  };

  const handleNextSlide = () => {
    if (activeIndex === 2 && selected === "rwb_1") {
      setAlertMessage("Please fill in all required credit card details.");
      return;
    }
    setActiveIndex((prevIndex) => prevIndex + 1);
    setAlertMessage(null);
  };

  const handlePrevSlide = () => {
    if (activeIndex > 1) {
      setActiveIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();

      const bookingData = {
        userID,
        flightID: flight.id,
        price: flight.price.total,
        departureDate: departureSegment?.departure?.at,
        arrivalDate: arrivalSegment?.arrival?.at,
      };

      const response2 = await axios.post(
        `http://localhost:8000/book-flight/${userID}`,
        bookingData
      );
    } catch (error) {
      console.error("Error booking flight:", error);
      setBookingError("Failed to book the flight. Please try again later.");
    }
    setActiveIndex(totalSlide);
  };

  const handlePaymentError = (error) => {
    setAlertMessage(error);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="py-2 px-5" disabled={disabled}>
            Confirm Booking
          </Button>
        </DialogTrigger>
        <DialogContent size="2xl" className="p-0">
          <Toaster />
          <DialogHeader className="p-6 pb-2">
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
              Checkout
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px]">
            <ScrollArea className="h-full px-6">
              {/* Step 1: Payment Method */}
              {activeIndex === 1 && (
                <div className="sm:grid sm:grid-cols-2 sm:gap-5 space-y-4 sm:space-y-0">
                  <div className="flex flex-col gap-2">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      defaultValue="rwb_1"
                      onValueChange={handleValueChange}
                    >
                      <Label
                        htmlFor="rwb_1"
                        className={`flex justify-between items-center gap-2 bg-default-100 px-3 py-2.5 w-full rounded-md cursor-pointer ${
                          selected === "rwb_1" ? "bg-primary" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon
                            icon="mdi:credit-card-outline"
                            className="text-lg"
                          />
                          <span
                            className={`font-base text-default-800 ${
                              selected === "rwb_1"
                                ? "text-primary-foreground"
                                : ""
                            }`}
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
                      <Label
                        htmlFor="rwb_3"
                        className={`flex justify-between items-center gap-2 bg-default-100 px-3 py-2.5 w-full rounded-md cursor-pointer ${
                          selected === "rwb_3" ? "bg-primary" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon icon="mdi:wallet" className="text-lg" />
                          <span
                            className={`font-base text-default-800 ${
                              selected === "rwb_3"
                                ? "text-primary-foreground"
                                : ""
                            }`}
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
                </div>
              )}

              {/* Step 2: Credit Card Details */}
              {activeIndex === 2 && selected === "rwb_1" && (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    amount={amount}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </Elements>
              )}

              {/* Step 3: Payment Success */}
              {activeIndex === totalSlide && (
                <div className="flex flex-col items-center">
                  <span className="text-7xl text-success">
                    <Icon icon="material-symbols:check-circle-outline" />
                  </span>
                  <h3 className="mt-3 text-success text-2xl font-semibold">
                    Payment Successful
                  </h3>
                  <p className="mt-4 text-lg font-semibold text-default-600">
                    Thank you for your purchase!
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Footer with Buttons */}
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
                <Button type="button">Close</Button>
              </DialogClose>
            ) : (
              <Button
                type="button"
                onClick={selected === "rwb_3" ? handleWallet : handleNextSlide}
                disabled={activeIndex === 2 && selected !== "rwb_1"}
              >
                Next
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayNow;
