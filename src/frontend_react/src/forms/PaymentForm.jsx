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
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const PaymentForm = () => {
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
                <Label>Card Number</Label>
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
            <Button className="mt-4 w-full">Pay</Button>
          </form>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default PaymentForm;
