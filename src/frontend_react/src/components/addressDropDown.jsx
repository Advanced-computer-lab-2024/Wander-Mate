"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import AddNewAddressCard from "../components/addNewDeliveryAddress";
import { Portal } from "@radix-ui/react-portal";
import { useFloating, offset, flip, shift } from "@floating-ui/react";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const AddressDropDown = ({ onAddressSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [username, setUsername] = useState("");
  const [countryMapping, setCountryMapping] = useState({});
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usernameFromSession = sessionStorage.getItem("username");
        const reply = await fetch(
          `http://localhost:8000/getID/${usernameFromSession}`
        );
        if (!reply.ok) throw new Error("Failed to get tourist ID");
        const { userID } = await reply.json();

        let touristId = userID || localStorage.getItem("touristId");
        if (!touristId) {
          setError("Tourist ID not found in storage.");
          return;
        }

        const userResponse = await axios.get(
          `http://localhost:8000/getUsername/${touristId}`
        );
        setUsername(userResponse.data);

        const addressResponse = await axios.get(
          `http://localhost:8000/getDeliveryAddresses/${touristId}`
        );
        setAddresses(addressResponse.data.addresses);

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

      let touristId = userID || localStorage.getItem("touristId");
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

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "add-new") {
      setIsDialogOpen(true);
    } else {
      setSelectedAddress(selectedValue);
      if (onAddressSelect) {
        onAddressSelect(selectedValue);
      }
    }
  };
  const { x, y, strategy, refs, update } = useFloating({
    placement: "right-start",
    middleware: [
      offset(10), // Space between Dialog and trigger
      flip(), // Flip to opposite side if there's no space
      shift({ padding: 10 }), // Shift to fit within the viewport
    ],
  });

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
    <React.Fragment>
      <div className="relative">
        <select
          className="w-full p-2 border rounded text-sm"
          value={selectedAddress || ""}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            Select an address
          </option>
          {addresses.map((address) => (
            <option key={address._id} value={address._id}>
              {`${address.street}, ${address.city}, ${
                countryMapping[address.country] || address.country
              }`}
            </option>
          ))}
          <option value="add-new">+ Add New Delivery Address</option>
        </select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-0 opacity-0 pointer-events-none"
            />
          </DialogTrigger>
          <DialogContent
            className="w-80 p-0"
            side="right"
            align="start"
            sideOffset={100}
            ref={refs.setFloating}
            overlayClass=" bg-gradient-to-b from-background/60 to-primary/30"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: 9999, // Ensure this is higher than the dialog's z-index
            }}
          >
            <AddNewAddressCard
              onAddressAdded={() => {
                setIsDialogOpen(false);
                refreshAddresses();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* <TourismGovernerFooter /> */}
    </React.Fragment>
  );
};

export default AddressDropDown;
