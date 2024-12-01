import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Icon } from "@iconify/react";
import NonMovableMap from "./ui/nonMovableMap";

const TourGuideItineraryModel = ({ itinerary, isOpen, setIsOpen, children }) => {
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      const url = new URL(window.location.href);
      if (window.location.search.includes("open")) {
        url.searchParams.delete("open");
        url.searchParams.delete("place");
        window.history.replaceState({}, "", url);
        window.location.reload();
      }
    }
  };

  const openInMaps = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, "_blank");
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
          <div className="space-y-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Itinerary Images */}
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={itinerary.image || "/placeholder.svg"}
                  alt={itinerary.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Itinerary Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {itinerary.name}
                  </h1>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Timeline:</span> {itinerary.TimeLine}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Price:</span> {itinerary.currrn} {itinerary.price || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Ratings:</span> {itinerary.rating}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Available Dates:</span>
                    </p>
                    <div className="flex space-x-4">
                      {itinerary.AvailableDates ? (
                        itinerary.AvailableDates.map((date, index) => {
                          const formattedDate = new Date(date.$date || date).toLocaleDateString();
                          return (
                            <span key={index} className="px-4 py-2 rounded bg-gray-200 text-gray-700">
                              {formattedDate}
                            </span>
                          );
                        })
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary Description Tabs */}
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Itinerary Information</TabsTrigger>
                <TabsTrigger value="map">Pickup Location</TabsTrigger>
                <TabsTrigger value="map1">Dropoff Location</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      Activities:{" "}
                      {itinerary.Activities
                        ? itinerary.Activities.map(
                            (activity) => activity.$oid || activity
                          ).join(",  ")
                        : "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Locations to Visit:{" "}
                      {itinerary.LocationsToVisit
                        ? itinerary.LocationsToVisit.map(
                            (location) => location.$oid || location
                          ).join(", ")
                        : "N/A"}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="map" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                      <Button
                        variant="outline"
                        className="ml-4"
                        onClick={() =>
                          openInMaps(
                            itinerary.PickUpLocation.coordinates[1],
                            itinerary.PickUpLocation.coordinates[0]
                          )
                        }
                      >
                        <Icon
                          icon="heroicons:location-marker"
                          className="w-4 h-4 mr-2"
                        />
                        Open in Maps
                      </Button>
                      <NonMovableMap
                        initialLocation={itinerary.PickUpLocation?.coordinates}
                        onLocationSelect={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="map1" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                      <Button
                        variant="outline"
                        className="ml-4"
                        onClick={() =>
                          openInMaps(
                            itinerary.DropOffLocation.coordinates[1],
                            itinerary.DropOffLocation.coordinates[0]
                          )
                        }
                      >
                        <Icon
                          icon="heroicons:location-marker"
                          className="w-4 h-4 mr-2"
                        />
                        Open in Maps
                      </Button>
                      <NonMovableMap
                        initialLocation={itinerary.DropOffLocation?.coordinates}
                        onLocationSelect={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TourGuideItineraryModel;

