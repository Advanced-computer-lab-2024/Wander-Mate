import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "../lib/utils";
import CreditCard from "../public/images/CreditCard.png";
import axios from "axios";
import { Alert, AlertDescription } from "./ui/alert";

const BookTransport = ({ touristID, amount, disabled, onSuccess }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalSlide, setTotalSlide] = useState(2);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selected, setSelected] = useState("rwb_1");
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    cardHolderName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const handleValueChange = (value) => {
    setSelected(value);
    setPaymentMethod(value === "rwb_2" ? "cash" : "credit");
  };

  useEffect(() => {
    setTotalSlide(paymentMethod === "cash" ? 1 : 2);
  }, [paymentMethod]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    if (paymentMethod === "credit") {
      return Object.values(formData).every((value) => value.trim() !== "");
    }
    return formData.country.trim() !== "" && formData.city.trim() !== "";
  };

  const handleNextSlide = () => {
    if (isFormValid()) {
      setActiveIndex(activeIndex + 1);
      setAlertMessage(null);
    } else {
      setAlertMessage("Please fill in all fields before proceeding.");
    }
  };

  const handleCompletePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/completePayment",
        {
          touristID,
          amount,
          paymentMethod,
          ...formData,
        }
      );

      if (response.status === 200) {
        onSuccess();
      } else {
        setAlertMessage("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error completing payment:", error);
      setAlertMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <DialogHeader className="p-6 pb-2">
        {alertMessage && (
          <Alert color="destructive" variant="soft" className="mb-4">
            <Icon icon="heroicons:exclamation-triangle" className="h-4 w-4" />
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
        <DialogTitle className="text-base font-medium">Book now</DialogTitle>
      </DialogHeader>
      <div className="max-h-[400px]">
        <ScrollArea className="h-full px-6">
          {activeIndex === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Country</Label>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
              </div>
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
                  <Label
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
                  </Label>
                </RadioGroup>
              </div>
            </div>
          )}

          {activeIndex === 2 && selected === "rwb_1" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Credit Card Details</h3>
              <div className="flex items-center gap-4">
                <div className="w-1/2">
                  <img
                    src={CreditCard}
                    alt="Credit Card"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex flex-col gap-2 w-3/4">
                  <div className="flex flex-col gap-2">
                    <Label>Card Holder Name</Label>
                    <Input
                      type="text"
                      name="cardHolderName"
                      value={formData.cardHolderName}
                      onChange={handleInputChange}
                      placeholder="Card Holder Name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Card Number</Label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Card Number"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2 w-1/2">
                      <Label>Expiration Date</Label>
                      <Input
                        type="text"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-1/2">
                      <Label>CVV</Label>
                      <Input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
      <DialogFooter className="p-6 pt-4">
        {activeIndex === 1 ? (
          <Button
            type="button"
            onClick={handleNextSlide}
            disabled={
              !isFormValid() ||
              (selected === "rwb_2" && paymentMethod === "cash")
            }
          >
            {selected === "rwb_2" && paymentMethod === "cash"
              ? "Complete Booking"
              : "Next"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleCompletePayment}
            disabled={!isFormValid() || disabled}
          >
            Complete Payment
          </Button>
        )}
      </DialogFooter>
    </>
  );
};

export default BookTransport;
