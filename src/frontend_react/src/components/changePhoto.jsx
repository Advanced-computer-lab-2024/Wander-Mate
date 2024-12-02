"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";
import axios from "axios";
import UserPhoto from "./userPhoto";
import { useNavigate } from "react-router-dom";

const ChangePhoto = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userID, setUserID] = useState(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    console.log("Username from session storage:", username); // Debugging line
    if (username) {
      fetchUserID(username);
    } else {
      toast({
        title: "User not found",
        description: "No user data found in session storage.",
        variant: "destructive",
      });
    }
  }, []);

  const fetchUserID = async (username) => {
    try {
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");
      const data = await reply.json();
      const {userID} = data;
      
      console.log("Fetched user data:", userID); // Debugging line
      setUserID(userID); // Assuming the response contains the user ID in the 'id' field
      setUserType(sessionStorage.getItem("Type")); // Assuming the response contains the user type in the 'type' field
    } catch (error) {
      console.error("Error fetching user ID:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImageSelect = (file) => {
    console.log("Selected file:", file);
    setProfileImage(file);
  };

  const sendProfileImage = async (userId) => {
    let URL = "";
    console.log(userType)
  
    switch (userType) {
      case "Advertiser":
        URL = `http://localhost:8000/uploadPictureadvertiser/${userId}`;
        break;
      case "Seller":
        URL = `http://localhost:8000/uploadPictureseller/${userId}`;
        break;
      case "TourGuide":
        URL = `http://localhost:8000/uploadPicturetourguide/${userId}`;
        break;
      default:
        toast({
          title: "Error",
          description: "Invalid user type for image upload.",
          variant: "destructive",
        });
        return;
    }
  
    console.log("Upload URL:", URL);  // Debugging URL
  
    if (!profileImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", profileImage);
  
      const response = await axios.put(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        toast({
          title: "Image uploaded successfully",
          description: "Your profile picture has been updated.",
        });
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Upload error:", error.response ? error.response.data : error.message);
      toast({
        title: "Upload failed",
        description: error.response?.data?.error || "Couldn't upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <Label className="text-center">Change your profile photo</Label>
      <UserPhoto onImageSelect={handleImageSelect} />
      <Button 
        onClick={() => {
          console.log("User ID before upload:", userID); // Debugging line
          if (userID) {
            sendProfileImage(userID); // Call sendProfileImage with userID
          } else {
            console.error("User ID is not set.");
          }
        }} 
        disabled={!profileImage || isUploading}
      >
        {isUploading ? "Uploading..." : "Upload New Photo"}
      </Button>
    </div>
  );
};

export default ChangePhoto;

