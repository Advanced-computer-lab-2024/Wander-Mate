"use client";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { cn } from "../lib/utils";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [requirementsMet, setRequirementsMet] = useState({
    length: false,
    lowercase: false,
    numberOrSymbol: false,
  });

  // Validate password requirements
  const validatePassword = (password) => {
    const lengthRequirement = password.length >= 8;
    const lowercaseRequirement = /[a-z]/.test(password);
    const numberOrSymbolRequirement = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

    setRequirementsMet({
      length: lengthRequirement,
      lowercase: lowercaseRequirement,
      numberOrSymbol: numberOrSymbolRequirement,
    });

    return lengthRequirement && lowercaseRequirement && numberOrSymbolRequirement;
  };

  const handleChangePassword = () => {
    // Validate new password against requirements
    if (!validatePassword(newPassword)) {
      setError("New password does not meet the requirements");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
      alert("Password changed successfully!");
      // Proceed with password change logic
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="rounded-t-none pt-6 w-full max-w-md">
        <CardContent>
          <div className="grid grid-cols-12 gap-y-5">
            <div className="col-span-12">
              <Label htmlFor="currentPassword" className="mb-2 text-default-800">Current Password</Label>
              <div className="relative">
                <Input id="currentPassword" type={currentPasswordType} />
                <Eye
                  className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer", currentPasswordType === "text" && "hidden")}
                  onClick={() => setCurrentPasswordType("text")}
                />
                <EyeOff
                  className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer", currentPasswordType === "password" && "hidden")}
                  onClick={() => setCurrentPasswordType("password")}
                />
              </div>
            </div>
            <div className="col-span-12">
              <Label htmlFor="newPassword" className="mb-2 text-default-800">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={newPasswordType}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                />
                <Eye
                  className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer", newPasswordType === "text" && "hidden")}
                  onClick={() => setNewPasswordType("text")}
                />
                <EyeOff
                  className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer", newPasswordType === "password" && "hidden")}
                  onClick={() => setNewPasswordType("password")}
                />
              </div>
            </div>
            <div className="col-span-12">
              <Label htmlFor="confirmPassword" className="mb-2 text-default-800">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={confirmPasswordType}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Eye
                  className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer", confirmPasswordType === "text" && "hidden")}
                  onClick={() => setConfirmPasswordType("text")}
                />
                <EyeOff
                  className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer", confirmPasswordType === "password" && "hidden")}
                  onClick={() => setConfirmPasswordType("password")}
                />
              </div>
            </div>
            {error && (
              <div className="col-span-12 text-red-500 text-xs">{error}</div>
            )}
          </div>
          <div className="mt-5 text-sm font-medium text-default-800">Password Requirements:</div>
          <div className="mt-3 space-y-1.5">
            {[
              { text: "Minimum 8 characters long", met: requirementsMet.length },
              { text: "At least one lowercase character", met: requirementsMet.lowercase },
              { text: "At least one number, symbol, or whitespace character", met: requirementsMet.numberOrSymbol },
            ].map((item, index) => (
              <div
                className="flex items-center gap-1.5"
                key={`requirement-${index}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.met ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <div className="text-xs text-default-600">{item.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-5 justify-end">
            <Button color="secondary">Cancel</Button>
            <Button onClick={handleChangePassword}>
              <Icon icon="heroicons:lock-closed" className="w-5 h-5 text-primary-foreground me-1" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
