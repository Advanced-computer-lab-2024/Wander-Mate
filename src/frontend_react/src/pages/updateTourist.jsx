"use client";
import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function UpdateTouristProfile() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    dob: '',
    nationality: '',
    role: '',
    walletBalance: '',
    badge: '',
    points: ''
  });
  const [nationalities, setNationalities] = useState([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setFormData(prevData => ({ ...prevData, username: storedUsername }));
      loadNationalities(storedUsername);
    } else {
      alert("User not logged in. Please log in first.");
    }
  }, []);

  const fetchTouristDetails = async (username) => {
    try {
      const idResponse = await fetch(`http://localhost:8000/getID/${username}`);
      if (!idResponse.ok) throw new Error("Failed to get user ID");
      const { userID } = await idResponse.json();

      const response = await fetch(`http://localhost:8000/handleTourist/${userID}`);
      const tourist = await response.json();
      const formattedDOB = tourist.DOB.split("T")[0];

      setFormData({
        username: tourist.Username,
        fullName: tourist.FullName,
        email: tourist.Email,
        mobileNumber: tourist.MobileNumber,
        role: tourist.Role,
        dob: formattedDOB,
        walletBalance: tourist.Wallet,
        badge: tourist.Badge,
        points: tourist.Points,
        nationality: tourist.Nationality
      });
    } catch (error) {
      console.error("Error fetching tourist details:", error);
    }
  };

  const loadNationalities = async (username) => {
    try {
      const idResponse = await fetch(`http://localhost:8000/getID/${username}`);
      if (!idResponse.ok) throw new Error("Failed to get user ID");
      const { userID } = await idResponse.json();

      const response = await fetch("http://localhost:8000/getNations");
      const nationalitiesData = await response.json();
      setNationalities(nationalitiesData);

      fetchTouristDetails(username);
    } catch (error) {
      console.error("Error loading nationalities:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({ ...prevData, [name]: value }));
  };

  const updateTourist = async (e) => {
    e.preventDefault();
    try {
      const idResponse = await fetch(`http://localhost:8000/getID/${formData.username}`);
      if (!idResponse.ok) throw new Error("Failed to get user ID");
      const { userID } = await idResponse.json();
      if (!userID) {
        alert("Tourist ID not found. Please log in.");
        return;
      }

      const updatedProfile = {
        FullName: formData.fullName,
        Email: formData.email,
        MobileNumber: formData.mobileNumber,
        Nationality: formData.nationality,
        Role: formData.role,
        WalletBalance: formData.walletBalance,
        Badge: formData.badge,
        Points: formData.points,
      };

      const response = await fetch(`http://localhost:8000/handleTourist/${userID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();
      if (data.message === "Tourist updated successfully") {
        alert("Profile updated successfully.");
      } else {
        alert(`Error updating profile: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile. Please try again.");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/changePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (data.message === "Password updated successfully") {
        alert("Password updated successfully.");
        setPasswordData({ currentPassword: '', newPassword: '' });
      } else {
        alert(`Error updating password: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("There was an error updating your password. Please try again.");
    }
  };

  return (
    <Tabs defaultValue="account" className="md:w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="additional">Additional Info</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={updateTourist}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="additional">
        <Card>
          <CardHeader>
            <CardTitle>Additional Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="nationality">Nationality</Label>
              <select
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
              >
                {nationalities.map((nation) => (
                  <option key={nation.code} value={nation.name}>
                    {nation.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleInputChange} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="walletBalance">Wallet Balance</Label>
              <Input id="walletBalance" name="walletBalance" value={formData.walletBalance} onChange={handleInputChange} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="badge">Badge</Label>
              <Input id="badge" name="badge" value={formData.badge} onChange={handleInputChange} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="points">Points</Label>
              <Input id="points" name="points" value={formData.points} onChange={handleInputChange} readOnly />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={updatePassword}>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

