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

const PaymentForm = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner 
      amount={props.amount} 
      Onsuccess={props.onPaymentSuccess}
      Onerror={props.onPaymentError}
      />
    </Elements>
  );
};
const PaymentFormInner = ({amount,Onsuccess,Onerror}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!stripe || !elements) {
      return;
    }

    // Step 1: Get card details from CardElement
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card details are missing.");
      setLoading(false);
      return;
    }

    try {
      // Step 2: Create payment intent on your server (this step requires backend)
      const response = await fetch("http://localhost:8000/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }), // Example amount in cents
      });
      const paymentIntentData = await response.json();

      // Step 3: Confirm the payment with Stripe
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
        Onerror();
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        setSuccessMessage("Payment successful!");
        Onsuccess();
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("Payment failed. Please try again.");
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Card>
      <CardHeader>
        <CardTitle>Payment Form</CardTitle>
        <CardDescription>Enter your card details to make a payment.</CardDescription>
        <CardDescription>Amount: {amount}</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="card-details">Card Details</Label>
        <CardElement id="card-details" />
        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handlePayment}
          disabled={loading || !stripe || !elements}
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </CardFooter>
    </Card>
    </React.Fragment>
  );
};

export default PaymentForm;
