import { Card, CardContent } from "../components/ui/card";
import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import coverImage from "../public/images/files/userprofile.jpg"; // Background image import
import ChangePhoto from "./changePhoto";
const HeaderSE = () => {
  const location = useLocation();
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    // Get the profile picture URL from sessionStorage
    const fetchPicture = async () => { 
    try{
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get seller ID");
  
      const { userID } = await reply.json();
      const response = await fetch(`http://localhost:8000/seller/${userID}/image`);
      setProfilePicture(`http://localhost:8000/seller/${userID}/image`);
    }catch{
      console.log("error");
    }
  }

   fetchPicture();
  }, []); 

  return (
    <Fragment>
      <Card className="mt-0 rounded-t-2xl overflow-hidden">
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
            <div className="absolute left-10 bottom-0 transform translate-y-[0px] flex items-center gap-6 z-10"> {/* Move avatar up */}
              <ChangePhoto/>
              
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">
                  {sessionStorage.getItem("username") || "Seller"}
                </h2>
              </div>
            </div>

            {/* Navigation links */}
            <div className="absolute bottom-4 right-6 flex gap-6 z-10">
              {[
                { title: "Documents", link: "/SellerDocs" },
                { title: "Settings", link: "/SellerHomePage" },
              ].map((item, index) => (
                <Link
                  key={`user-profile-link-${index}`}
                  to={item.link}
                  className={cn(
                    "text-sm font-semibold text-white hover:text-primary transition-colors relative pb-2", // Updated to text-white
                    {
                      "text-primary border-b-2 border-primary": location.pathname === item.link
                    }
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default HeaderSE;
