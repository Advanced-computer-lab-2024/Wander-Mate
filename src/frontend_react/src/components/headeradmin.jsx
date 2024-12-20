import { Card, CardContent } from "../components/ui/card";
import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import coverImage from "../public/images/files/userprofile.jpg"; // Background image import

const HeaderAdmin = () => {
  const location = useLocation();
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const type = sessionStorage.getItem("Type");
    if (!storedUsername || !type || type !== "Admin") {
      navigate("/loginPage");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);



  useEffect(() => {
    // Get the profile picture URL from sessionStorage
    const fetchPicture = async () => { 
    try{
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get Tourist ID");
    }catch{
      console.log("error");
    }
  }

   fetchPicture();
  }, []); 

  return (
    <Fragment>
      <Card className="mt-6 rounded-t-2xl overflow-hidden">
        <CardContent className="p-0">
          <div
            className="relative h-[296px] w-[full] bg-cover bg-center"
            style={{
              backgroundImage: `url(${coverImage})`,
              backgroundSize: "contain",  // Adjusted to reduce the width further (50%)
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat", // Ensure the image doesn't repeat
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" /> {/* Background overlay */}
            
            {/* Content container */}

            {/* Avatar and username container */}
            <div className="absolute left-10 bottom-0 transform translate-y-[-40px] flex items-center gap-6 z-10"> {/* Move avatar up */}
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={profilePicture} />
                <AvatarFallback className="text-4xl" >
  {username.slice(0, 2).toUpperCase() || "AD"}
</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">
                  {sessionStorage.getItem("username") || "Tourist"}
                </h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default HeaderAdmin;
