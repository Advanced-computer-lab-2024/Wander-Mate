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
import axios from "axios";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { toast } from "./ui/use-toast";

const CheckOut = ({ touristID, amount, disabled, voucherCode }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalSlide, setTotalSlide] = useState(3);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selected, setSelected] = useState("rwb_1");
  const [cardDetails, setCardDetails] = useState({
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
    setTotalSlide(paymentMethod === "cash" ? 2 : 3);
  }, [paymentMethod]);

  
  const applyPromoCode = async () => {
    if (voucherCode) {
      try {
        await axios.post(`http://localhost:8000/applyPromoCode/${touristID}`, {
          promoCode: voucherCode.code,
          purchaseAmount: amount
        });
        toast({
          title: "Promo Code Applied",
          description: "Your promo code has been successfully applied.",
        });
      } catch (error) {
        console.error('Error applying promo code:', error);
        toast({
          title: "Error",
          description: "Failed to apply promo code. Please try again.",
          variant: "destructive",
        });
        throw error; // Rethrow the error to be caught in handlePayment
      }
    }
  };

  
  const handlePayment = async () => {
    try {

      console.log("jiji");
      await applyPromoCode();
      // Proceed with payment logic here
      // For now, we'll just show a success message
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully.",
      });
      setActiveIndex(totalSlide);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNextSlide = () => {
    if (activeIndex === 2 && selected === "rwb_1") {
      if (Object.values(cardDetails).every((field) => field.trim() !== "")) {
        handlePayment();
      } else {
        setAlertMessage("Please fill in all credit card details.");
      }
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
        touristID,
        amount,
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

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full text-white py-2 rounded mt-4"
            disabled={disabled}
          >
            Checkout
          </Button>
        </DialogTrigger>
        <DialogContent size="2xl" className="p-0">
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
                      rows="6.5"
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
                        <Label htmlFor="cardHolderName">Card Holder Name</Label>
                        <Input
                          type="text"
                          id="cardHolderName"
                          name="cardHolderName"
                          placeholder="Card Holder Name"
                          value={cardDetails.cardHolderName}
                          onChange={handleCardInputChange}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="Card Number"
                          value={cardDetails.cardNumber}
                          onChange={handleCardInputChange}
                          required
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="flex flex-col gap-2 w-1/2">
                          <Label htmlFor="expirationDate">Expiration Date</Label>
                          <Input
                            type="text"
                            id="expirationDate"
                            name="expirationDate"
                            placeholder="MM/YY"
                            value={cardDetails.expirationDate}
                            onChange={handleCardInputChange}
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            type="text"
                            id="cvv"
                            name="cvv"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={handleCardInputChange}
                            required
                          />
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

