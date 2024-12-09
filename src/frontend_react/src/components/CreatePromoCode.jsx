"use client";

import { useRef, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Plus, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

function SubmitButton({ pending }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Promo Code"}
    </Button>
  );
}

const createPromoCode = async ({ code, expiryDate }) => {
  try {
    const response = await fetch("http://localhost:8000/createPromoCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        expiryDate,
        assignedTo: null,
        isUsed: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create promo code");
    }

    return {
      success: toast.success("Promo code created successfully."),
      message: "Promo code created successfully",
      promoCode: data.promoCode,
    };
  } catch (error) {
    console.error("Error creating promo code:", error);
    return {
      success: toast.error("Can't create the promo code"),
      message: "Can't create the promo code",
    };
  }
};

export default function CreatePromoCode() {
  const [code, setCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [state, setState] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const dialogRef = useRef(null);

  const handleOpenChange = (open) => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPending(true);

    const result = await createPromoCode({ code, expiryDate });
    setState(result);
    setIsPending(false);

    if (result.success) {
      handleOpenChange(false); // Close dialog on success
    }
  };

  return (
    <div>
      <Toaster />
      <Dialog
        open={state?.success ? false : undefined}
        onOpenChange={handleOpenChange}
        ref={dialogRef}
      >
        <DialogTrigger asChild>
          <UserPlus className="mr-2 h-4 w-4">Create Promo Code</UserPlus>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Promo Code</DialogTitle>
            <DialogDescription>
              Enter the details for the new promo code.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  name="code"
                  className="col-span-3"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  className="col-span-3"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
            {state && !state.success && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <SubmitButton pending={isPending} />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
