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
import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import NationalitySelect from "./nationsSelect";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "../lib/utils";
import CreditCard from "../public/images/CreditCard.png";
const CheckOut = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalSlide, setTotalSlide] = useState(3); // Default step count

  const [selected, setSelected] = useState("rwb_1");

  const handleValueChange = (value) => {
    setSelected(value);
    setPaymentMethod(value === "rwb_2" ? "cash" : "credit");
  };

  useEffect(() => {
    setTotalSlide(paymentMethod === "cash" ? 2 : 3);
  }, [paymentMethod]);

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
          <Button className="w-full text-white py-2 rounded mt-4">
            Checkout
          </Button>
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
                            Cash on Delivery
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

                  {/* Credit Card Section */}
                  <div className="flex items-center gap-4">
                    {/* Credit Card Image */}
                    <div className="w-1/2">
                      <img
                        src={CreditCard}
                        alt="Credit Card"
                        className="w-full h-auto"
                      />
                    </div>

                    {/* Credit Card Information */}
                    <div className="flex flex-col gap-2 w-3/4">
                      <div className="flex flex-col gap-2">
                        <Label>Card Holder Name</Label>
                        <Input type="text" placeholder="Card Holder Name" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Card Number</Label>
                        <Input type="text" placeholder="Card Number" />
                      </div>

                      {/* Expiration Date and CVV side by side */}
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-2 w-1/2">
                          <Label>Expiration Date</Label>
                          <Input type="text" placeholder="MM/YY" />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                          <Label>CVV</Label>
                          <Input type="text" placeholder="CVV" />
                        </div>
                      </div>
                    </div>
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
              disabled={activeIndex === 1 || activeIndex === totalSlide}
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

export default CheckOut;
