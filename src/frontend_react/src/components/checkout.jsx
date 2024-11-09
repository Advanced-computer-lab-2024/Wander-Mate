"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import NationalitySelect from "./nationsSelect";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "../lib/utils";

const CheckOut = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const totalSlide = 3;

  const [selected, setSelected] = useState("rwb_1");
  const handleValueChange = (value) => {
    setSelected(value);
  };
  const handleNextSlide = () => {
    setActiveIndex(activeIndex + 1);
  };

  const handlePrevSlide = () => {
    if (activeIndex > 1) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Basic Modal</Button>
        </DialogTrigger>
        <DialogContent size="2xl" className="p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-base font-medium">
              Checkout
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px]">
            <ScrollArea className="h-full px-6">
              {activeIndex === 1 && (
                <div className="sm:grid sm:grid-cols-2 sm:gap-5 space-y-4 sm:space-y-0">
                  {/* <div className="flex flex-col gap-2">
                    <Label>First Name</Label>
                    <Input type="text" placeholder="Enter first name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Last Name</Label>
                    <Input type="text" placeholder="Enter last name" />
                  </div> */}
                  <div className="flex flex-col gap-2">
                    <Label>Country</Label>
                    <NationalitySelect />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>City</Label>
                    <Input type="text" placeholder="City" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Billing Address</Label>
                    <Textarea
                      type="text"
                      placeholder="Billing address"
                      rows="3"
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
                          "flex justify-between items-center gap-1 bg-default-100 px-3 py-2.5 w-full rounded-md cursor-pointer",
                          { "bg-primary": selected === "rwb_1" }
                        )}
                      >
                        <span
                          className={cn("font-base text-default-800", {
                            "text-primary-foreground": selected === "rwb_1",
                          })}
                        >
                          Credit/Debit Card.
                        </span>
                        <RadioGroupItem
                          value="rwb_1"
                          id="rwb_1"
                          className="data-[state=checked]:text-primary-foreground data-[state=checked]:border-white"
                        ></RadioGroupItem>
                      </Label>
                      <Label
                        htmlFor="rwb_2"
                        className={cn(
                          "flex justify-between items-center gap-1 bg-default-100 px-3 py-2.5 w-full rounded-md cursor-pointer",
                          { "bg-primary": selected === "rwb_2" }
                        )}
                      >
                        <span
                          className={cn("font-base text-default-800", {
                            "text-primary-foreground": selected === "rwb_2",
                          })}
                        >
                          Cash on Delivery.
                        </span>
                        <RadioGroupItem
                          value="rwb_2"
                          id="rwb_2"
                          className="data-[state=checked]:text-primary-foreground data-[state=checked]:border-white"
                        ></RadioGroupItem>
                      </Label>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {activeIndex === 2 && paymentMethod === "credit" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Credit Card Details</h3>
                  <div className="flex flex-col gap-2">
                    <Label>Card Number</Label>
                    <Input type="text" placeholder="Card Number" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Expiration Date</Label>
                    <Input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>CVV</Label>
                    <Input type="text" placeholder="CVV" />
                  </div>
                </div>
              )}

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
          <div className="p-6 pt-4 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevSlide}
              disabled={activeIndex === 1}
            >
              Previous
            </Button>
            {activeIndex === totalSlide ? (
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            ) : (
              <Button
                type="button"
                onClick={handleNextSlide}
                disabled={activeIndex === 2 && paymentMethod !== "credit"}
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

export default CheckOut;
