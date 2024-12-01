"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";
import axios from "axios";
import UserPhoto from "./userPhoto";

const ChangePhoto = ({ userID, userType }) => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageSelect = (file) => {
    setProfileImage(file);
  };

  const sendProfileImage = async () => {
    if (!profileImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    let URL = "http://localhost:8000/";

    switch (userType) {
      case "Advertiser":
        URL += `uploadPictureadvertiser/${userID}`;
        break;
      case "Seller":
        URL += `uploadPictureseller/${userID}`;
        break;
      case "TourGuide":
        URL += `uploadPicturetourguide/${userID}`;
        break;
      default:
        toast({
          title: "Invalid user type",
          description: "Unable to upload image due to invalid user type.",
          variant: "destructive",
        });
        return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append("image", profileImage);
      
      // Log FormData to check if image is added correctly
      console.log("FormData content: ", dataToSend);

      const response = await axios.put(URL, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Axios will handle this automatically, but we can specify it just in case.
        },
      });

      // Check server response (you can log it for debugging)
      console.log("Upload response: ", response);

      toast({
        title: "Image uploaded successfully",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      // Log error details for better debugging
      console.error("Upload error: ", error);

      toast({
        title: "Upload failed",
        description: "Couldn't upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Label className="text-center">Change your profile photo</Label>
      <UserPhoto onImageSelect={handleImageSelect} />
      <Button onClick={sendProfileImage} disabled={!profileImage}>
        Upload New Photo
      </Button>
    </div>
  );
};

export default ChangePhoto;
