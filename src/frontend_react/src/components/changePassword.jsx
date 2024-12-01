"use client";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { cn } from "../lib/utils";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = ({ URL }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [requirementsMet, setRequirementsMet] = useState({
    length: false,
    number: false,
    specialChar: false,
    uppercase: false,
  });

  const validatePassword = (password) => {
    const updatedRequirements = {
      length: password.length >= 8,
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
    };
    setRequirementsMet(updatedRequirements);
    return Object.values(updatedRequirements).every(Boolean);
  };

  const handleChangePassword = async () => {
    if (!validatePassword(newPassword)) {
      setError("Password does not meet the requirements.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      // Fetch the username from sessionStorage
      const username = sessionStorage.getItem("username");
      if (!username) {
        setError("Username not found in session.");
        return;
      }
  
      // Fetch the user ID from the backend using the username
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");
  
      // Destructure userID from the response
      const { userID } = await reply.json();
  
      // Call API to change the password (backend method)
      const response = await fetch('http://localhost:8000/changePasswordTourist', {  // Adjust URL as necessary
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userID,          // Use the userID received from the backend
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });
  
      const data = await response.json();
      if (data.message === "Password updated successfully") {
        setError("");
        alert("Password changed successfully.");
      } else {
        setError(data.message || "Error changing password.");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "An unexpected error occurred.");
    }
  };
  

  return (
    <div className="space-y-6">
      <Card className="rounded-lg p-6 w-full">
        <CardContent>
          <div className="grid grid-cols-12 gap-y-5">
            <div className="col-span-12">
              <Label htmlFor="currentPassword" className="mb-2">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="col-span-12">
              <Label htmlFor="newPassword" className="mb-2">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              <div className="col-span-12 mt-5">
                <Label htmlFor="confirmPassword" className="mb-2">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Password Requirements:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li
                    className={`${
                      requirementsMet.length ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    At least 8 characters
                  </li>
                  <li
                    className={`${
                      requirementsMet.number ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    At least 1 number
                  </li>
                  <li
                    className={`${
                      requirementsMet.specialChar
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    At least 1 special character (!@#$%^&*)
                  </li>
                  <li
                    className={`${
                      requirementsMet.uppercase
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    At least 1 uppercase letter
                  </li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="col-span-12 text-red-500 text-sm">{error}</div>
            )}
          </div>
          <div className="mt-6 flex gap-5 justify-end">
            <Button color="secondary">Cancel</Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
