import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
import { toast } from "./ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import ComplaintForm from "./fileComplaintComponent";

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

const NavigationMenuBar = ({ likedItemsCount = 0 }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isComplaintFormOpen, setIsComplaintFormOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [touristID, setTouristId] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTouristIdAndWishlist = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("Username not found in session storage");

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        setTouristId(userID);

        const response = await axios.get(
          `http://localhost:8000/viewMyWishlist/${userID}`
        );
        setWishlistItems(response.data.wishlist || []);
      } catch (error) {
        console.error("Error fetching tourist ID or wishlist:", error);
        toast({
          title: "Error",
          description: "Failed to load your wishlist. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchTouristIdAndWishlist();
  }, [likedItemsCount]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("Username not found in session storage");

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        setTouristId(userID);

        const response = await axios.get(
          `http://localhost:8000/viewMyNotifications/${userID}`
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

  const removeFromWishlist = useCallback(
    async (productId) => {
      try {
        const response = await axios.delete(
          "http://localhost:8000/removeFromWishlist",
          {
            data: { touristId: touristID, productId },
          }
        );

        if (response.status === 200) {
          setWishlistItems((prevItems) =>
            prevItems.filter((item) => item._id !== productId)
          );
          toast({
            title: "Success",
            description: "Item removed from wishlist.",
          });
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast({
          title: "Error",
          description: "Failed to remove item from wishlist. Please try again.",
          variant: "destructive",
        });
      }
    },
    [touristID]
  );

  const addToCart = useCallback(
    async (item) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/addWishlistItemToCart",
          {
            touristID,
            productId: item._id,
            quantity: 1,
          }
        );

        if (response.status === 200) {
          setWishlistItems((prevItems) =>
            prevItems.filter((wishlistItem) => wishlistItem._id !== item._id)
          );
          setCartItems((prev) => ({
            ...prev,
            [item._id]: {
              ...item,
              quantity: (prev[item._id]?.quantity || 0) + 1,
            },
          }));
          toast({
            title: "Added to Cart",
            description: `${item.name} has been added to your cart and removed from your wishlist.`,
          });
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    },
    [touristID]
  );

  const incrementCartItem = async (item) => {
    if ((cartItems[item._id]?.quantity || 0) >= item.quantity) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/addWishlistItemToCart",
        {
          touristID,
          productId: item._id,
          quantity: 1,
        }
      );

      if (response.status === 200) {
        setCartItems((prev) => ({
          ...prev,
          [item._id]: {
            ...item,
            quantity: (prev[item._id]?.quantity || 0) + 1,
          },
        }));
      }
    } catch (error) {
      console.error("Error incrementing cart item:", error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const decrementCartItem = async (item) => {
    if (!cartItems[item._id] || cartItems[item._id].quantity <= 0) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/removeFromCart",
        {
          touristID,
          productId: item._id,
          quantity: 1,
        }
      );

      if (response.status === 200) {
        setCartItems((prev) => {
          const updatedQuantity = Math.max(
            (prev[item._id]?.quantity || 0) - 1,
            0
          );
          if (updatedQuantity === 0) {
            const { [item._id]: _, ...rest } = prev;
            return rest;
          }
          return {
            ...prev,
            [item._id]: { ...item, quantity: updatedQuantity },
          };
        });
      }
    } catch (error) {
      console.error("Error decrementing cart item:", error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const moveAllToCart = async () => {
    try {
      const response = await axios.post("http://localhost:8000/moveAllToCart", {
        touristID,
      });

      if (response.status === 200) {
        const updatedCartItems = { ...cartItems };
        wishlistItems.forEach((item) => {
          updatedCartItems[item._id] = {
            ...item,
            quantity: (updatedCartItems[item._id]?.quantity || 0) + 1,
          };
        });
        setCartItems(updatedCartItems);
        setWishlistItems([]);
        toast({
          title: "Success",
          description: "All items moved to cart.",
        });
      }
    } catch (error) {
      console.error("Error moving all items to cart:", error);
      toast({
        title: "Error",
        description: "Failed to move items to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getImageSrc = (picture) => {
    if (picture && picture.data && picture.contentType) {
      const bufferData = picture.data.data;
      const base64String = btoa(
        new Uint8Array(bufferData).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:${picture.contentType};base64,${base64String}`;
    }
    return null;
  };

  const goToProducts = () => {
    navigate("/products");
  };

  const markNotificationAsRead = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/markNotificationAsRead/${touristID}/${id}`
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

  const goToProfile = async () => {
    navigate("/UserProfilePage");
  };
 
  const goToHistory = async () => {
    navigate("/touristHistory");
  };
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        const response = await axios.delete(
          `http://localhost:8000/removeNotification/${touristID}/${notificationId}`
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
    [touristID]
  );

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <SiteLogo />
            <span className="text-xl font-bold">WanderMate</span>
          </Link>

          <div className="hidden md:flex space-x-6">
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
                  <Link to="/aboutUs" className="flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    <span>Our Story</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/about/team" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Meet the Team</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/about/careers" className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Careers</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={openDropdown === "shop"}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  onMouseEnter={() => handleMouseEnter("shop")}
                  onMouseLeave={handleMouseLeave}
                  onClick={goToProducts}
                >
                  Shop
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>

            <DropdownMenu open={openDropdown === "bookings"}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  onMouseEnter={() => handleMouseEnter("bookings")}
                  onMouseLeave={handleMouseLeave}
                >
                  Travel Bookings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                onMouseEnter={() => handleMouseEnter("bookings")}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuItem>
                  <Link to="/bookings/flights" className="flex items-center">
                    <Plane className="mr-2 h-4 w-4" />
                    <span>Flights</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/bookings/hotels" className="flex items-center">
                    <Hotel className="mr-2 h-4 w-4" />
                    <span>Hotels</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/bookings/packages" className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Vacation Packages</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={openDropdown === "activities"}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  onMouseEnter={() => handleMouseEnter("activities")}
                  onMouseLeave={handleMouseLeave}
                >
                  Activities & Tickets
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                onMouseEnter={() => handleMouseEnter("activities")}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuItem>
                  <Link to="/viewItineraries" className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Tours</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/places" className="flex items-center">
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>Attractions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/activities" className="flex items-center">
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>Events</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4">
            <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    My Wishlist
                  </SheetTitle>
                  <SheetDescription>
                    You have {wishlistItems.length} items in your wishlist
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)] pr-4 mt-4">
                  {wishlistItems.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Your wishlist is empty
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlistItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between space-x-4 border-b pb-4"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-center text-sm font-medium">
                              {item.name}
                            </span>
                            {getImageSrc(item.picture) ? (
                              <img
                                src={getImageSrc(item.picture)}
                                alt={item.name}
                                className="h-16 w-16 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-md">
                                <span>No Image</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {!cartItems[item._id] ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addToCart(item)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => decrementCartItem(item)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="px-2">
                                    {cartItems[item._id].quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => incrementCartItem(item)}
                                    disabled={
                                      cartItems[item._id].quantity >=
                                      item.quantity
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromWishlist(item._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">
                                Remove {item.name} from wishlist
                              </span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <div className="mt-1 mb-2 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsWishlistOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Shopping Cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {notifications.some((n) => !n.isRead) && (
                    <span className="relative right-2 bottom-2 h-2 w-2 rounded-full bg-red-500" />
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
                    <AvatarFallback>
                      {sessionStorage
                        .getItem("username")
                        .slice(0, 2)
                        .toUpperCase() || "WM"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span onClick={goToProfile}>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <History className="mr-2 h-4 w-4" />
                    <span onClick={goToHistory}>History</span>
                    <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={logout}>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  <span onClick={() => setIsComplaintFormOpen(true)}>
                    File Complaint
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
      <Sheet open={isComplaintFormOpen} onOpenChange={setIsComplaintFormOpen}>
        <SheetContent>
          <ComplaintForm />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default NavigationMenuBar;
