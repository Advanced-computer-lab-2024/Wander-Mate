import { Card, CardContent } from "../components/ui/card";
import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Link ,useNavigate} from "react-router-dom";
import { cn } from "../lib/utils";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import coverImage from "../public/images/files/userprofile.jpg"; // Background image import
import { Badge } from "../components/ui/badge";
import { Star, Gem, Crown, Wallet } from "lucide-react";
const HeaderT = () => {
  const location = useLocation();
  const [touristBadge, setTouristBadge] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const type = sessionStorage.getItem("Type");
    if (!storedUsername || !type || type !== "Tourist") {
      navigate("/loginPage");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  useEffect(() => {
    // Get the profile picture URL from sessionStorage
    const fetchTouristBadge = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();

        const levelReply = await fetch(
          `http://localhost:8000/getTouristLevel/${userID}`
        );
        if (!levelReply.ok) throw new Error("Failed to get tourist level");

        const { Badge } = await levelReply.json();
        setTouristBadge(Badge);

        

        const pointsReply = await fetch(
          `http://localhost:8000/getTouristPoints/${userID}`
        );
        if (!pointsReply.ok) throw new Error("Failed to get tourist points");
        const { Points } = await pointsReply.json();
       
      } catch (error) {
        console.error("Error fetching tourist data:", error);
      }
    };

    fetchTouristBadge();
  }, []); 
  let badgeContent = {
    icon: <Star className="mr-1 h-3 w-3" />,
    text: "Loading...",
    color: "bg-gray-500 text-white",
  };

  if (touristBadge === "level 1") {
    badgeContent = {
      icon: <Star className="mr-1 h-3 w-3" />,
      text: ` ${touristBadge}`,
      color: "bg-gray-300 text-gray-800",
    };
  } else if (touristBadge === "level 2") {
    badgeContent = {
      icon: <Gem className="mr-1 h-3 w-3" />,
      text: ` ${touristBadge}`,
      color: "bg-purple-500 text-white",
    };
  } else if (touristBadge === "level 3") {
    badgeContent = {
      icon: <Crown className="mr-1 h-3 w-3" />,
      text: ` ${touristBadge}`,
      color: "bg-yellow-400 text-black",
    };
  } else if (touristBadge !== null) {
    badgeContent = {
      icon: <Star className="mr-1 h-3 w-3" />,
      text: ` ${touristBadge}`,
      color: "bg-blue-500 text-white",
    };
  }
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
                <AvatarFallback className="text-4xl">
  {username.slice(0, 2).toUpperCase() || "TO"}
</AvatarFallback>

              </Avatar>
              
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">
                  {sessionStorage.getItem("username") || "Tourist"}
                  <br/>
                  
                  <Badge className={`flex items-center ${badgeContent.color}`}>
            {badgeContent.icon}
            {badgeContent.text}
          </Badge>
                </h2>
              </div>
              
            </div>
            

            {/* Navigation links */}
            <div className="absolute bottom-4 right-6 flex gap-6 z-10">
              {[
                { title: "Complaints", link: "/viewmycomplaints" },
                { title: "Settings", link: "/UserProfilePage" },
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

export default HeaderT;
