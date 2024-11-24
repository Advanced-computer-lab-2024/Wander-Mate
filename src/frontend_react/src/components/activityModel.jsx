import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import NonMovableMap from "./ui/nonMovableMap";
import { StarIcon } from 'lucide-react';

export default function ActivityModal({ activity, isOpen, setIsOpen, children }) {
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setIsBookingConfirmed(false);
    }
  };

  const handleBooking = () => {
    // Here you would typically make an API call to book the activity
    // For now, we'll just simulate a successful booking
    setIsBookingConfirmed(true);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" size="full">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{activity.name}</h1>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(activity.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({activity.rating.toFixed(1)})</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Date:</span> {new Date(activity.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Time:</span> {activity.time}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Category:</span> {activity.category || "Not specified"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Price:</span> ${activity.price}
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
                    icon={activity.isAvailable ? "ph:check-circle" : "ph:x-circle"}
                    className={`w-5 h-5 ${
                      activity.isAvailable ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span className="ml-2 text-sm">
                    {activity.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
                {activity.isAvailable && !isBookingConfirmed && (
                  <Button onClick={handleBooking} className="w-full mb-4">
                    Book Now
                  </Button>
                )}
                {isBookingConfirmed && (
                  <div className="text-green-500 font-semibold mt-4 mb-4">
                    Booking confirmed! Thank you for your reservation.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

