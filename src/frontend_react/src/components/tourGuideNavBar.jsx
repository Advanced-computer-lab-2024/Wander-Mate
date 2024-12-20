import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Heart,
  History,
  LogOut,
  Settings,
  ShoppingCart,
  User,
  Plane,
  Hotel,
  Ticket,
  MapPin,
  Info,
  Users,
  Briefcase,
  Plus,
  Minus,
  Trash2,
  Bell,
  FileText,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const SiteLogo = () => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 97.11 72.85"
    className="h-12 w-12 2xl:w-16 2xl:h-16"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <style>{".cls-1{fill:#826af9;}"}</style>
    </defs>
    <ellipse className="cls-1" cx="50.42" cy="40.81" rx="35.36" ry="32.04" />
    <path
      d="M132.59,72.05a13,13,0,0,0-2.47-1.25.6.6,0,0,1-.16-.08c-.66,1.2-1.31,2.4-2,3.59-1.26,2.24-2.55,4.46-3.78,6.71-.91,1.66-1.74,3.37-2.63,5-1.36,2.58-2.75,5.16-4.12,7.75-.32.6-.63,1.22-.94,1.83l-.27-.09c.19-1.22.41-2.44.57-3.66s.22-2.34.35-3.51c.37-3.25.78-6.5,1.13-9.76.42-3.87.77-7.74,1.18-11.61.21-2,.51-3.94.73-5.91a.85.85,0,0,0-.3-.7,29,29,0,0,0-3-1,1,1,0,0,0-.84.3c-1.61,2.09-3.18,4.21-4.77,6.31l-2.88,3.84c-1.69,2.25-3.37,4.52-5.06,6.77-1,1.38-2.06,2.74-3.08,4.11l-5.71,7.73c-.62.83-1.22,1.67-1.85,2.5-1.4,1.85-2.81,3.69-4.21,5.53-.65.87-1.29,1.75-1.93,2.62a3,3,0,0,1-.37.23c.62-1.84,1.19-3.47,1.74-5.11.6-1.82,1.18-3.65,1.77-5.48l1.51-4.63q1.62-4.92,3.23-9.84.75-2.28,1.48-4.56c.61-1.87,1.23-3.74,1.83-5.61.75-2.34,1.47-4.69,2.23-7,1-3.18,2.07-6.35,3.1-9.52.21-.67.32-1.37.52-2,.3-1,.64-1.92,1-2.87.14-.38,0-.53-.35-.65-.94-.32-1.87-.67-2.82-1a.67.67,0,0,0-.55.19,15,15,0,0,0-.89,1.35c-.81,1.3-1.55,2.64-2.42,3.9-1.22,1.75-2.52,3.45-3.81,5.15-1.52,2-3,4-4.64,5.89-1.8,2.17-3.63,4.31-5.56,6.36s-4,3.92-6,5.87c-.85.84-1.65,1.73-2.56,2.5-1.78,1.51-3.6,3-5.45,4.41s-3.79,2.84-5.74,4.19c-1.78,1.22-3.63,2.35-5.46,3.51-.38.24-.44.46-.18.81a23.52,23.52,0,0,1,1.44,2c.29.48.59.5,1,.24,2.25-1.46,4.51-2.9,6.73-4.41,1.49-1,2.94-2.09,4.37-3.19,2-1.54,4-3.1,5.93-4.71,1.19-1,2.33-2.06,3.45-3.14,2-1.88,4-3.75,5.82-5.73C89,64,91,61.66,93,59.33c.82-1,1.54-2,2.31-3a5.13,5.13,0,0,1,.53-.51,3,3,0,0,1-.24.81c-.6,1.8-1.17,3.6-1.76,5.41q-1.55,4.68-3.08,9.38-.84,2.53-1.65,5.09c-.69,2.14-1.37,4.29-2.07,6.44-.94,2.92-1.93,5.82-2.86,8.74-.71,2.21-1.35,4.44-2,6.66-.58,1.85-1.19,3.7-1.77,5.54-.19.61-.36,1.22-.55,1.82-.48,1.48-1,3-1.43,4.44a.65.65,0,0,0,.24.57c.88.43,1.78.8,2.66,1.2.38.17.6.07.84-.27.84-1.14,1.71-2.25,2.58-3.38,1.63-2.12,3.28-4.23,4.9-6.36,1.05-1.37,2.08-2.77,3.12-4.16l5-6.6c1.58-2.11,3.17-4.21,4.74-6.33,1.42-1.92,2.82-3.86,4.23-5.79.59-.8,1.19-1.59,1.79-2.38,1.28-1.68,2.58-3.36,3.85-5.05.83-1.1,1.62-2.22,2.43-3.33a2.77,2.77,0,0,1,.43-.32c-.12.54-.22.88-.26,1.24-.57,5.14-1.12,10.28-1.69,15.42-.52,4.77-1.07,9.52-1.59,14.28-.28,2.61-.53,5.22-.82,7.83a.75.75,0,0,0,.69,1c.82.17,1.63.36,2.44.6a1,1,0,0,0,1.31-.61c1-1.92,2.1-3.84,3.17-5.74s2.18-3.89,3.29-5.83,2.17-3.79,3.26-5.68,2.09-3.59,3.15-5.37,2.13-3.55,3.2-5.33q2-3.24,3.89-6.5A12.75,12.75,0,0,1,132.59,72.05Z"
      transform="translate(-58 -39.15)"
    />
    <path
      d="M155.11,39.15a8.05,8.05,0,0,0-1,.27c-.9.36-1.79.74-2.68,1.14a13.4,13.4,0,0,0-5.23,4.16c-1.22,1.61-2.2,3.4-3.27,5.12-.69,1.11-1.35,2.24-2.06,3.34a1.1,1.1,0,0,1-.7.43c-2.77.4-5.55.77-8.32,1.17-2.27.33-4.52.68-6.78,1.06a1.5,1.5,0,0,0-.84.47c-.71.9-1.36,1.85-2,2.79-.2.29,0,.47.28.49s.54,0,.81,0l12.5,0h.91a7.9,7.9,0,0,1-.35.8c-1.29,2.25-2.58,4.5-3.9,6.73a1.18,1.18,0,0,1-.71.44,43.5,43.5,0,0,1-4.33.84,3.38,3.38,0,0,0-3,2.14c-.28.64-.24.81.47.83l3.74.09c.37,0,.75.05,1.17.09a.15.15,0,0,0,0,.07s0,0,.05,0a11.82,11.82,0,0,1,2.56,1.29l1.32.66a4.81,4.81,0,0,0,1.35.51.34.34,0,0,1,.22.13c.12,0,.25.12.43.38.51.73,1,1.46,1.56,2.2.2.29.39.36.62,0,.37-.54.77-1.06,1.1-1.61a1.18,1.18,0,0,0,.17-.77,7.45,7.45,0,0,0-.56-1.73c-.69-1.42-1.29-2.79.19-4.09,0,0,0-.08.07-.12.89-1.51,1.77-3,2.68-4.53a14.86,14.86,0,0,1,1-1.33l6.27,7.9,2.62-3a.42.42,0,0,0,0-.31c-.62-1.5-1.26-3-1.86-4.48-.84-2.1-1.65-4.2-2.43-6.32a1.38,1.38,0,0,1,.11-1.05c.74-1.22,1.54-2.39,2.34-3.57.55-.83,1.11-1.64,1.68-2.45a30.05,30.05,0,0,0,2.16-3.17,15.57,15.57,0,0,0,1.71-6.29C155.12,39.7,155.11,39.47,155.11,39.15ZM136.55,64.69l-.2-.16a102.23,102.23,0,0,1,9.47-15.71l.17.09Z"
      transform="translate(-58 -39.15)"
    />
  </svg>
);

const TourGuideNavBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [guideID, setGuideId] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const type = sessionStorage.getItem("Type");
    const status = sessionStorage.getItem("status");
    if (!storedUsername || !type || type !== "TourGuide" || !status) {
      navigate("/loginPage");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleMouseEnter = (dropdown) => {
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const logout = () => {
    sessionStorage.removeItem("username");
    navigate("/loginPage");
  };
  const goToProfile = async () => {
    navigate("/TourGuidePage");
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("Username not found in session storage");

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get Tour Guide ID");

        const { userID } = await reply.json();
        setGuideId(userID);

        const response = await axios.get(
          `http://localhost:8000/viewMyNotificationsTG/${userID}`
        );
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchNotifications();
  }, []);
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        const response = await axios.delete(
          `http://localhost:8000/removeNotificationTG/${guideID}/${notificationId}`
        );

        if (response.status === 200) {
          setNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification._id !== notificationId
            )
          );

          toast({
            title: "Success",
            description: "Notification deleted successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete notification. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting notification:", error);

        toast({
          title: "Error",
          description: "Failed to delete notification. Please try again.",
          variant: "destructive",
        });
      }
    },
    [guideID]
  );
  const markNotificationAsRead = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/markNotificationAsRead/${guideID}/${id}`
      );

      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        variant: "destructive",
      });
    }
  };
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    // Get the profile picture URL from sessionStorage
    const fetchPicture = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        const response = await fetch(
          `http://localhost:8000/GUIDE/${userID}/image`
        );
        setProfilePicture(`http://localhost:8000/GUIDE/${userID}/image`);
      } catch {
        console.log("error");
      }
    };

    fetchPicture();
  }, []);
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <nav className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/TourGuideDash" className="flex items-center space-x-2">
            <SiteLogo />
            <span className="text-xl font-bold">WanderMate</span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:flex space-x-6">
            <Button variant="ghost" asChild>
              <Link to="/TourGuideDash" className="flex items-center">
                <span>Home Page</span>
              </Link>
            </Button>
            <DropdownMenu open={openDropdown === "about"}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  onMouseEnter={() => handleMouseEnter("about")}
                  onMouseLeave={handleMouseLeave}
                >
                  About Us
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                onMouseEnter={() => handleMouseEnter("about")}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuItem>
                  <Link to="/AboutUsTG" className="flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    <span>Our Story</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/MeetPageTG" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Meet the Team</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" asChild>
              <Link to="/TourGuideItinerary" className="flex items-center">
                <span>Itineraries</span>
              </Link>
            </Button>
          </div>

          {/* Profile and Notifications */}
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {notifications.some((n) => !n.isRead) && (
                    <span className="relative right-1 bottom-2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No new notifications
                    </p>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 ${
                            notification.isRead ? "bg-gray-50" : "bg-blue-50"
                          } mb-2 rounded-md cursor-pointer flex justify-between items-center`}
                        >
                          <p
                            className="text-sm"
                            onClick={() =>
                              markNotificationAsRead(notification._id)
                            }
                          >
                            {notification.message}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete notification</span>
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={profilePicture} alt={"Profile"} />
                    <AvatarFallback>
                      {sessionStorage
                        .getItem("username")
                        ?.slice(0, 2)
                        .toUpperCase() || "TG"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span onClick={goToProfile}>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={logout}>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default TourGuideNavBar;
