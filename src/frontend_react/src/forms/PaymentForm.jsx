import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QNbspEozkMz2Yq3CeUlvq37Ptboa8zRKVDaiVjjzrwP8tZPcKmo4QKsCQzCFVn4d0GnDBm2O3p2zS5v3pA7BUKg00xjpsuhcW"
);

const PaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner />
    </Elements>
  );
};
const PaymentFormInner = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Step 1: Get card details
      if (!stripe || !elements) {
        setErrorMessage("Stripe has not loaded yet. Please try again later.");
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);

      // Step 2: Call backend to create PaymentIntent
      const response = await fetch("/PayByCard/67325d260b78167e4249db6c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 120, // $50.00 in cents
          currency: "usd",
          eventId: "672fcc3576d2804bd9ab0bc8", // Example: replace with actual event ID
        }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Step 3: Confirm payment using client secret
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "John Doe", // Replace with user's name
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        alert("Payment successful!");
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Card className="w-full max-w-md mx-auto mt-5">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Enter your card information to complete your payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="card-element">Card Information</Label>{" "}
                <Input type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Expiration Date</Label>
                <Input placeholder="MM/YY" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cvc">CVC</Label>
                <Input placeholder="123" />
              </div>
            </div>
            <Button
              onClick={handlePayment}
              type="submit"
              className="mt-4 w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default PaymentForm;
