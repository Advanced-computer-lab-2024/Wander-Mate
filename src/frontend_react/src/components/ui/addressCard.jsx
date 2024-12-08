"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, AlertCircle, Plus } from "lucide-react";
import NonMovableMap from "./nonmovableMapAddress";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import AddNewAddressCard from "../addNewDeliveryAddress";

const AddressCard = () => {
  const [addresses, setAddresses] = useState([]);
  const [username, setUsername] = useState("");
  const [countryMapping, setCountryMapping] = useState({});
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usernameFromSession = sessionStorage.getItem("username");
        const reply = await fetch(
          `http://localhost:8000/getID/${usernameFromSession}`
        );
        if (!reply.ok) throw new Error("Failed to get tourist ID");
        const { userID } = await reply.json();

        let touristId = userID;
        if (!touristId) {
          touristId = localStorage.getItem("touristId");
        }

        if (!touristId) {
          setError("Tourist ID not found in storage.");
          return;
        }

        // Fetch the username using the touristId
        const userResponse = await axios.get(
          `http://localhost:8000/getUsername/${touristId}`
        );
        setUsername(userResponse.data);

        // Fetch the addresses
        const addressResponse = await axios.get(
          `http://localhost:8000/getDeliveryAddresses/${touristId}`
        );
        setAddresses(addressResponse.data.addresses);

        // Fetch the country mapping
        const nationsResponse = await axios.get(
          `http://localhost:8000/getNations`
        );
        const nations = nationsResponse.data;
        const mapping = nations.reduce((acc, nation) => {
          acc[nation._id] = nation.country_name;
          return acc;
        }, {});
        setCountryMapping(mapping);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      }
    };

    fetchUserData();
  }, []);

  const refreshAddresses = async () => {
    try {
      const usernameFromSession = sessionStorage.getItem("username");
      const reply = await fetch(
        `http://localhost:8000/getID/${usernameFromSession}`
      );
      if (!reply.ok) throw new Error("Failed to get tourist ID");
      const { userID } = await reply.json();

      let touristId = userID;
      if (!touristId) {
        touristId = localStorage.getItem("touristId");
      }

      if (!touristId) {
        setError("Tourist ID not found in storage.");
        return;
      }

      const addressResponse = await axios.get(
        `http://localhost:8000/getDeliveryAddresses/${touristId}`
      );
      setAddresses(addressResponse.data.addresses);
    } catch (error) {
      console.error("Error refreshing addresses:", error);
      setError("Failed to refresh addresses.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Delivery Addresses
            </CardTitle>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <AddNewAddressCard
                  onAddressAdded={() => {
                    setIsOpen(false);
                    refreshAddresses();
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-2">
            <Badge
              variant="secondary"
              className="inline-block px-3 py-1 rounded-full text-sm"
            >
              {username}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <p className="text-gray-500 italic">No addresses found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 shadow-lg h-[450px] flex flex-col justify-between"
                >
                  <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 space-y-2 custom-padding">
                    <div className="flex-shrink-0 flex items-center">
                      <MapPin className="text-blue-500 mt-1 w-6 h-6 mr-2" />
                      <p className="text-gray-700 font-semibold">
                        {address.street}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">City:</span> {address.city}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">State:</span> {address.state}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Zip Code:</span>{" "}
                      {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Country:</span>{" "}
                      {countryMapping[address.country] || address.country}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 text-xs"
                      onClick={() => {
                        const mapUrl = `https://www.google.com/maps?q=${address.location.coordinates[1]},${address.location.coordinates[0]}`;
                        window.open(mapUrl, "_blank");
                      }}
                    >
                      <Icon
                        icon="heroicons:location-marker"
                        className="w-3 h-3 mr-1"
                      />
                      Open in Maps
                    </Button>
                  </div>
                  <div className="mt-2 h-64 w-full">
                    <NonMovableMap
                      initialLocation={address.location.coordinates}
                      onLocationSelect={() => {}}
                      className="h-full w-full rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressCard;
