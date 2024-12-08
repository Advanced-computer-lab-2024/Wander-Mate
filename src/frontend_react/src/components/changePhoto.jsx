import React, { useState, useEffect } from "react";
import { toast } from "./ui/use-toast";
import axios from "axios";
import UserPhoto from "./userPhoto";
import { useNavigate } from "react-router-dom";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const ChangePhoto = ({ user = "seller" }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userID, setUserID] = useState(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (username) {
      fetchUserID(username);
    } else {
      toast({
        title: "User not found",
        description: "No user data found in session storage.",
        variant: "destructive",
      });
    }

    const fetchPicture = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get seller ID");

        const { userID } = await reply.json();
        const imageUrl = `http://localhost:8000/${user}/${userID}/image`;
        setProfileImage(imageUrl);
      } catch (error) {
        console.log("Error fetching profile picture:", error);
      }
    };

    fetchPicture();
  }, []);

  const fetchUserID = async (username) => {
    try {
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");
      const data = await reply.json();
      setUserID(data.userID);
      setUserType(sessionStorage.getItem("Type"));
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
    setProfileImage(URL.createObjectURL(file));
    if (userID) {
      sendProfileImage(userID, file);
    } else {
      console.error("User ID is not set.");
    }
  };

  const sendProfileImage = async (userId, file) => {
    let URL = "";

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

    if (!file) {
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
      formData.append("image", file);

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
      toast({
        title: "Upload failed",
        description:
          error.response?.data?.error ||
          "Couldn't upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-col items-center space-y-4 mt-[-40px]">
        <UserPhoto
          onImageSelect={handleImageSelect}
          isUploading={isUploading}
          initialImage={profileImage}
        />
      </div>
      <TourismGovernerFooter />
    </React.Fragment>
  );
};

export default ChangePhoto;
