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

const PaymentForm = (props, { promo = false }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner
        amount={props.amount}
        onSuccess={props.onPaymentSuccess}
        onError={props.onPaymentError}
        promo={promo}
      />
    </Elements>
  );
};

const PaymentFormInner = ({ amount, onSuccess, onError, promo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [promoCode, setPromoCode] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card details are missing.");
      setLoading(false);
      return;
    }

    try {
      // Convert amount to cents and ensure it's an integer
      const amountInCents = Math.round(parseFloat(amount) * 100);

      const response = await fetch(
        "http://localhost:8000/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: amountInCents }),
        }
      );
      const paymentIntentData = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setErrorMessage(error.message);
        onError(error);
      } else if (paymentIntent.status === "succeeded") {
        setSuccessMessage("Payment successful!");
        onSuccess();
      }
    } catch (error) {
      setErrorMessage("Payment failed. Please try again.");
      onError(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePromoCode = () => {
    setPromoCode(!promoCode);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Form</CardTitle>
        <CardDescription>
          Enter your card details to make a payment.
        </CardDescription>
        <CardDescription>Amount: ${amount}</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="card-details">Card Details</Label>
        <CardElement id="card-details" />
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mt-2">{successMessage}</div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between w-full">
          {promo ? (
            <Button onClick={handlePromoCode}>Promo Code</Button>
          ) : (
            <h1 />
          )}
          <Button
            onClick={handlePayment}
            disabled={loading || !stripe || !elements}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </div>
        {promoCode && (
          <Input
            placeholder="Apply Promo Code Here"
            onChange={(e) => setPromoCode(e.target.value)}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
