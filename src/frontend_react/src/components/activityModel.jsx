import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import NonMovableMap from "./ui/nonMovableMap";
import { StarIcon } from "lucide-react";
import PayForActivity from "./PayForActivity";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import {
  CustomPopover as Popover,
  PopoverTrigger,
  PopoverContent,
} from "./ui/popover";
import axios from "axios";

export default function ActivityModal({
  activity,
  isOpen,
  setIsOpen,
  children,
}) {
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      // setIsBookingConfirmed(false);
    }
  };
  const handleBook = () => {
    setIsBooking(true);
  };
  const handlePaymentSuccess = () => {
    // setIsBooking(false);
    setBookingError(null);
    // Additional logic for successful booking
    console.log("Booking successful!");
  };

  const handlePaymentError = (error) => {
    setBookingError(error.message || "Payment failed. Please try again.");
    setIsBooking(false);
  };

  const handleShare = (method) => {
    const currentUrl = window.location.href.split("?")[0];
    const shareUrl = `${currentUrl}?open=true&activity=${activity.activityId}`;
    const shareText = `Check out this amazing activity: ${activity.name}`;

    if (method === "link") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success("Link copied to clipboard!");
        setIsShareOpen(false);
      });
    } else if (method === "email") {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(
        shareText
      )}&body=${encodeURIComponent(shareUrl)}`;
      window.location.href = mailtoLink;
      setIsShareOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        size="full"
      >
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={() => handleOpenChange(false)}
          >
            <Icon icon="ph:x" className="h-4 w-4" />
          </Button>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Map Section */}
              <div>
                <Tabs defaultValue="location" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  <TabsContent value="location" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="w-full h-64 rounded-lg overflow-hidden">
                          <NonMovableMap
                            initialLocation={activity.location.coordinates.slice()}
                            onLocationSelect={() => {}}
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            const [lat, lng] = activity.location.coordinates;
                            const mapUrl = `https://www.google.com/maps?q=${lng},${lat}`;
                            window.open(mapUrl, "_blank");
                          }}
                        >
                          <Icon
                            icon="heroicons:location-marker"
                            className="w-4 h-4 mr-2"
                          />
                          Open in Maps
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Activity Details Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {activity.name}
                </h1>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(activity.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({activity.rating.toFixed(1)})
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(activity.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Time:</span> {activity.time}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Category:</span>{" "}
                  {activity.category || "Not specified"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Price: </span> 
                  {activity.currency} {activity.price}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {activity.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center mb-4">
                  <Icon
                    icon={
                      activity.isAvailable ? "ph:check-circle" : "ph:x-circle"
                    }
                    className={`w-5 h-5 ${
                      activity.isAvailable ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span className="ml-2 text-sm">
                    {activity.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
                <div className="flex space-x-4 mb-6">
                  {/* {activity.isAvailable && !isBookingConfirmed && (
                    <Button onClick={handleBooking} className="w-full mb-4">
                      Book Now
                    </Button>
                  )} */}
                  {!isBooking ? (
                    <Button
                      className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white w-full"
                      onClick={handleBook}
                    >
                      <Icon
                        icon="heroicons:shopping-bag"
                        className="w-4 h-4 mr-2"
                      />
                      Book Activity
                    </Button>
                  ) : (
                    <PayForActivity
                      activity={activity}
                      amount={activity.price}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                  )}
                  {bookingError && (
                    <p className="text-red-500 mt-2">{bookingError}</p>
                  )}
                  <Popover
                    open={isShareOpen}
                    onOpenChange={setIsShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    trigger={
                      <Button
                        variant="outline"
                        onClick={() => setIsShareOpen(true)}
                      >
                        <Icon icon="heroicons:share" className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    }
                  >
                    <div className="w-48 p-2">
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="ghost"
                          onClick={() => handleShare("link")}
                          className="w-full justify-start"
                        >
                          <Icon
                            icon="heroicons:link"
                            className="w-4 h-4 mr-2"
                          />
                          Copy Link
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleShare("email")}
                          className="w-full justify-start"
                        >
                          <Icon
                            icon="heroicons:envelope"
                            className="w-4 h-4 mr-2"
                          />
                          Email
                        </Button>
                      </div>
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
// import { Button } from "./ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { Card, CardContent } from "./ui/card";
// import { Icon } from "@iconify/react";
// import { Badge } from "./ui/badge";
// import NonMovableMap from "./ui/nonMovableMap";
// import { StarIcon } from 'lucide-react';
// import {
//   CustomPopover as Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "./ui/popover";
// import toast from "react-hot-toast";
// import axios from "axios";

// export default function ActivityModal({ activity, isOpen, setIsOpen, children }) {
//   const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
//   const [isShareOpen, setIsShareOpen] = useState(false);

//   const handleOpenChange = (open) => {
//     setIsOpen(open);
//     if (!open) {
//       setIsBookingConfirmed(false);
//     }
//   };

//   const handleBooking = async () => {
//     try {
//       // Step 1: Get the username from sessionStorage
//       const username = sessionStorage.getItem("username");
//       if (!username) {
//         throw new Error("User not logged in.");
//       }

//       // Step 2: Fetch the user ID from the backend using the username
//       const reply = await fetch(`http://localhost:8000/getID/${username}`);
//       if (!reply.ok) throw new Error("Failed to get user ID");

//       const { userID, userModel } = await reply.json();

//       // Step 3: Post the booking request to the backend
//       const bookedDate = new Date().toISOString(); // Use the current date as bookedDate
//       const response = await fetch("http://localhost:8000/bookActivity", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           activityId: activity.activityId,
//           userId: userID,
//           bookedDate,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Error booking activity.");

//       // Step 4: Handle successful booking
//       setIsBookingConfirmed(true);
//       toast.success("Booking successful!");

//       // Step 5: Call the `updateRevenueSales` API to update the user's revenue
//       const salesResponse = await fetch("http://localhost:8000/updateRevenueSales", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userID, // User ID obtained from step 2
//           userModel, // User model (TourGuide, Advertiser, Seller, Admin) you can get it from the backend or frontend
//           amount: activity.price, // The amount to add to the revenue (the price of the activity)
//         }),
//       });

//       const salesData = await salesResponse.json();
//       if (!salesResponse.ok) {
//         throw new Error(salesData.message || "Error updating revenue sales.");
//       }

//       // Optionally, update the UI or provide feedback to the user here
//       toast.success("Revenue updated successfully!");

//     } catch (error) {
//       // Handle any errors
//       console.error("Error booking activity:", error);
//       toast.error("Failed to book activity or update revenue.");
//       setIsBookingConfirmed(false);
//     }
//   };

//   const handleShare = (method) => {
//     const currentUrl = window.location.href.split("?")[0];
//     const shareUrl = `${currentUrl}?open=true&activity=${activity.activityId}`;
//     const shareText = `Check out this amazing activity: ${activity.name}`;

//     if (method === "link") {
//       navigator.clipboard.writeText(shareUrl).then(() => {
//         alert("Link copied to clipboard!");
//         setIsShareOpen(false);
//       });
//     } else if (method === "email") {
//       const mailtoLink = `mailto:?subject=${encodeURIComponent(
//         shareText
//       )}&body=${encodeURIComponent(shareUrl)}`;
//       window.location.href = mailtoLink;
//       setIsShareOpen(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" size="full">
//         <div className="relative">
//           <Button
//             variant="ghost"
//             className="absolute right-0 top-0"
//             onClick={() => handleOpenChange(false)}
//           >
//             <Icon icon="ph:x" className="h-4 w-4" />
//           </Button>
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Map Section */}
//               <div>
//                 <Tabs defaultValue="location" className="w-full">
//                   <TabsList className="w-full justify-start">
//                     <TabsTrigger value="location">Location</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="location" className="mt-4">
//                     <Card>
//                       <CardContent className="p-6">
//                         <div className="w-full h-64 rounded-lg overflow-hidden">
//                           <NonMovableMap
//                             initialLocation={activity.location.coordinates.slice()}
//                             onLocationSelect={() => {}}
//                           />
//                         </div>
//                         <Button
//                           variant="outline"
//                           className="mt-4"
//                           onClick={() => {
//                             const [lat, lng] = activity.location.coordinates;
//                             const mapUrl = `https://www.google.com/maps?q=${lng},${lat}`;
//                             window.open(mapUrl, "_blank");
//                           }}
//                         >
//                           <Icon
//                             icon="heroicons:location-marker"
//                             className="w-4 h-4 mr-2"
//                           />
//                           Open in Maps
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   </TabsContent>
//                 </Tabs>
//               </div>

//               {/* Activity Details Section */}
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">{activity.name}</h1>
//                 <div className="flex items-center mb-4">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <StarIcon
//                       key={star}
//                       className={`w-6 h-6 ${
//                         star <= Math.round(activity.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                   <span className="ml-2 text-sm text-gray-600">({activity.rating.toFixed(1)})</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-2">
//                   <span className="font-semibold">Date:</span> {new Date(activity.date).toLocaleDateString()}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2">
//                   <span className="font-semibold">Time:</span> {activity.time}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2">
//                   <span className="font-semibold">Category:</span> {activity.category || "Not specified"}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2">
//                   <span className="font-semibold">Price:</span> ${activity.price}
//                 </p>
//                 <div className="flex flex-wrap gap-1 mb-2">
//                   {activity.tags.map((tag, index) => (
//                     <Badge key={index} variant="secondary" className="text-xs">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//                 <div className="flex items-center mb-4">
//                   <Icon
//                     icon={activity.isAvailable ? "ph:check-circle" : "ph:x-circle"}
//                     className={`w-5 h-5 ${
//                       activity.isAvailable ? "text-green-500" : "text-red-500"
//                     }`}
//                   />
//                   <span className="ml-2 text-sm">
//                     {activity.isAvailable ? "Available" : "Not Available"}
//                   </span>
//                 </div>
//                 <div className="flex space-x-4 mb-6">
//                   {activity.isAvailable && !isBookingConfirmed && (
//                     <Button onClick={handleBooking} className="w-full mb-4">
//                       Book Now
//                     </Button>
//                   )}
//                   <Popover
//                     open={isShareOpen}
//                     onOpenChange={setIsShareOpen}
//                     onClose={() => setIsShareOpen(false)}
//                     trigger={
//                       <Button
//                         variant="outline"
//                         onClick={() => setIsShareOpen(true)}
//                       >
//                         <Icon
//                           icon="heroicons:share"
//                           className="w-4 h-4 mr-2"
//                         />
//                         Share
//                       </Button>
//                     }
//                   >
//                     <div className="w-48 p-2">
//                       <div className="flex flex-col space-y-2">
//                         <Button
//                           variant="ghost"
//                           onClick={() => handleShare("link")}
//                           className="w-full justify-start"
//                         >
//                           <Icon
//                             icon="heroicons:link"
//                             className="w-4 h-4 mr-2"
//                           />
//                           Copy Link
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           onClick={() => handleShare("email")}
//                           className="w-full justify-start"
//                         >
//                           <Icon
//                             icon="heroicons:envelope"
//                             className="w-4 h-4 mr-2"
//                           />
//                           Email
//                         </Button>
//                       </div>
//                     </div>
//                   </Popover>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
