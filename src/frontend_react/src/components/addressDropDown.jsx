'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, AlertCircle } from 'lucide-react';
import { Button } from "../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import AddNewAddressCard from '../components/addNewDeliveryAddress';

const AddressDropDown = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [username, setUsername] = useState('');
  const [countryMapping, setCountryMapping] = useState({});
  const [error, setError] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usernameFromSession = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${usernameFromSession}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");
        const { userID } = await reply.json();

        let touristId = userID || localStorage.getItem("touristId");
        if (!touristId) {
          setError("Tourist ID not found in storage.");
          return;
        }

        const userResponse = await axios.get(`http://localhost:8000/getUsername/${touristId}`);
        setUsername(userResponse.data);

        const addressResponse = await axios.get(`http://localhost:8000/getDeliveryAddresses/${touristId}`);
        setAddresses(addressResponse.data.addresses);

        const nationsResponse = await axios.get(`http://localhost:8000/getNations`);
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
      const reply = await fetch(`http://localhost:8000/getID/${usernameFromSession}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");
      const { userID } = await reply.json();

      let touristId = userID || localStorage.getItem("touristId");
      if (!touristId) {
        setError("Tourist ID not found in storage.");
        return;
      }

      const addressResponse = await axios.get(`http://localhost:8000/getDeliveryAddresses/${touristId}`);
      setAddresses(addressResponse.data.addresses);
    } catch (error) {
      console.error("Error refreshing addresses:", error);
      setError("Failed to refresh addresses.");
    }
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "add-new") {
      setIsPopoverOpen(true);
    } else {
      setSelectedAddress(selectedValue);
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
         {/* <Card className="w-full max-w-2xl mx-auto"> */}
                
                <div className="flex justify-between items-center">
                
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        style={{ opacity: 0, pointerEvents: 'auto' }}
                        >
                        </Button>

                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <AddNewAddressCard onAddressAdded={() => {
                        setIsPopoverOpen(false);
                        refreshAddresses();
                        }} />
                    </PopoverContent>
                    </Popover>
                </div>
                <div className="mt-2">
                </div>
                
                <CardContent>
                <select
                    className="w- p-2 border rounded"
                    value={selectedAddress || ""}
                    onChange={handleSelectChange}
                >
                    <option value="" disabled>Select an address</option>
                    {addresses.map((address, index) => (
                    <option key={index} value={address.street}>
                        {`${address.street}, ${address.city}, ${countryMapping[address.country] || address.country}`}
                    </option>
                    ))}
                    <option value="add-new">+ Add New Delivery Address</option>
                </select>
                </CardContent>
            {/* </Card> */}
            </div>
        );
        };

export default AddressDropDown;
