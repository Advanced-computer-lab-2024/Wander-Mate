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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import CreditCard from "../public/images/CreditCard.png";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../forms/PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51QNbspEozkMz2Yq3CeUlvq37Ptboa8zRKVDaiVjjzrwP8tZPcKmo4QKsCQzCFVn4d0GnDBm2O3p2zS5v3pA7BUKg00xjpsuhcW"
);

const PayNow = ({ touristID, amount, disabled, itinerary, bookedDate }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalSlide, setTotalSlide] = useState(3);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selected, setSelected] = useState("rwb_1");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [userPoints, setUserPoints] = useState(0);

  const handleValueChange = (value) => {
    setSelected(value);
    setPaymentMethod(value === "rwb_3" ? "wallet" : "credit");
  };

  useEffect(() => {
    setTotalSlide(paymentMethod === "wallet" ? 2 : 3);
  }, [paymentMethod]);

  const validateFields = () => {
    const newErrors = {};
    if (!cardHolderName.trim())
      newErrors.cardHolderName = "Card Holder Name is required.";
    if (!cardNumber.trim()) {
      newErrors.cardNumber = "Card Number is required.";
    } else if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = "Card Number must be 16 digits.";
    }
    if (!expirationDate.trim()) {
      newErrors.expirationDate = "Expiration Date is required.";
    } else if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      newErrors.expirationDate = "Expiration Date must be in MM/YY format.";
    }
    if (!cvv.trim()) {
      newErrors.cvv = "CVV is required.";
    } else if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = "CVV must be 3 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWallet = async () => {
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
    if (activeIndex === 2 && selected === "rwb_1" && !validateFields()) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      console.log("Payment Successful");
    } else {
      console.log("Validation Failed");
    }
  };
  const handlePaymentSuccess = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();
      console.log(itinerary);

      const repl = await axios.post(`http://localhost:8000/bookItinerary`, {
        userId: userID,
        itineraryId: itinerary.itineraryId,
        bookedDate: bookedDate,
      });

      const tourist = await axios.get(
        `http://localhost:8000/gettourist/${userID}`
      );
      const emailParams = {
        service_id: "service_phn5uyk", // Your EmailJS service ID
        template_id: "template_nckkmu7", // Your EmailJS template ID
        user_id: "PnYRvwMBy2-3PJ0JY", // Your EmailJS user ID
        template_params: {
          to_email: tourist.data.Email, // Recipient's email address
          customer_name: tourist.data.FullName || tourist.data.Username, // Customer name (full name or username)
          receipt_date: new Date().toLocaleDateString(), // Date of the receipt (formatted)
          event_name: itinerary.name, // Name of the event or itinerary
          booking_date: bookedDate, // Date when the booking was made
          event_date: bookedDate, // Scheduled date for the event
          event_location: itinerary.PickUpLocation, // Location of the event or itinerary
          payment_description: `Payment for ${itinerary.Name}`, // Payment description
          payment_amount: amount, // Payment amount (formatted as currency)
          support_email: "Wandermate4@outlook.com", // Support email
        },
      };

      const response = await emailjs.send(
        emailParams.service_id,
        emailParams.template_id,
        emailParams.template_params,
        emailParams.user_id,
        emailParams.to_email
      );
      console.log(response);
      toast.success("Booking successful!");
      setActiveIndex(totalSlide);

      // window.location.href = "http://localhost:3000/viewItineraries";
    } catch (error) {
      console.error("Error booking itinerary:", error);
      toast.error("Failed to book itinerary");
      setIsBooked(false);
    }
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
          <DialogHeader className="p-6 pb-2">
            {alertMessage && (
              <Alert color="destructive" variant="soft" className="mb-4">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  className="h-4 w-4"
                />
                <AlertDescription>
                  {typeof alertMessage === "object"
                    ? JSON.stringify(alertMessage)
                    : alertMessage}
                </AlertDescription>
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
                <div className="sm:grid sm:grid-cols-1 sm:gap-5 space-y-4 sm:space-y-0">
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
                // <form onSubmit={handleSubmit} className="space-y-4">
                //   <h3 className="text-lg font-medium">Credit Card Details</h3>
                //   <div className="flex items-center gap-4">
                //     {/* Credit Card Image */}
                //     <div className="w-1/2">
                //       <img
                //         src={CreditCard}
                //         alt="Credit Card"
                //         className="w-full h-auto"
                //       />
                //     </div>
                //     {/* Credit Card Information */}
                //     <div className="flex flex-col gap-2 w-3/4">
                //       <div className="flex flex-col gap-2">
                //         <Label>Card Holder Name</Label>
                //         <Input
                //           type="text"
                //           placeholder="Card Holder Name"
                //           value={cardHolderName}
                //           onChange={(e) => setCardHolderName(e.target.value)}
                //         />
                //         {errors.cardHolderName && (
                //           <p className="text-red-500 text-sm">
                //             {errors.cardHolderName}
                //           </p>
                //         )}
                //       </div>
                //       <div className="flex flex-col gap-2">
                //         <Label>Card Number</Label>
                //         <Input
                //           type="text"
                //           placeholder="Card Number"
                //           value={cardNumber}
                //           onChange={(e) => setCardNumber(e.target.value)}
                //         />
                //         {errors.cardNumber && (
                //           <p className="text-red-500 text-sm">
                //             {errors.cardNumber}
                //           </p>
                //         )}
                //       </div>
                //       <div className="flex gap-4">
                //         <div className="flex flex-col gap-2 w-1/2">
                //           <Label>Expiration Date</Label>
                //           <Input
                //             type="text"
                //             placeholder="MM/YY"
                //             value={expirationDate}
                //             onChange={(e) => setExpirationDate(e.target.value)}
                //           />
                //           {errors.expirationDate && (
                //             <p className="text-red-500 text-sm">
                //               {errors.expirationDate}
                //             </p>
                //           )}
                //         </div>
                //         <div className="flex flex-col gap-2 w-1/2">
                //           <Label>CVV</Label>
                //           <Input
                //             type="text"
                //             placeholder="CVV"
                //             value={cvv}
                //             onChange={(e) => setCvv(e.target.value)}
                //           />
                //           {errors.cvv && (
                //             <p className="text-red-500 text-sm">{errors.cvv}</p>
                //           )}
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                //   <button type="submit" className="btn btn-primary">
                //     Submit
                //   </button>
                // </form>
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
            ) : selected === "rwb_1" && activeIndex === 2 ? null : (
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
