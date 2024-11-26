import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AlertCircle } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import BasicMap from './ui/basic-map';

const AddNewAddressCard = () => {
    const [username, setUsername] = useState('');
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState(null);
    const [newAddress, setNewAddress] = useState({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      location: {
        type: "Point",
        coordinates: [-122.420679, 37.774929]
      }
    });
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const usernameFromSession = sessionStorage.getItem("username");
          const reply = await fetch(`http://localhost:8000/getID/${usernameFromSession}`);
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
          const userResponse = await axios.get(`http://localhost:8000/getUsername/${touristId}`);
          setUsername(userResponse.data);
  
          // Fetch the countries
          const nationsResponse = await axios.get(`http://localhost:8000/getNations`);
          setCountries(nationsResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data.");
        }
      };
  
      fetchUserData();
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewAddress(prev => ({ ...prev, [name]: value }));
    };
  
    const handleCountryChange = (value) => {
      setNewAddress(prev => ({ ...prev, country: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const usernameFromSession = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${usernameFromSession}`);
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
  
        await axios.post(`http://localhost:8000/addDeliveryAddress/${touristId}`, newAddress);
        // Reset form or show success message
        setNewAddress({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          location: {
            type: "Point",
            coordinates: [-122.420679, 37.774929]
          }
        });
        alert('Address added successfully!');
      } catch (error) {
        console.error("Error adding address:", error);
        setError("Failed to add address.");
      }
    };
  
    const handleLocationSelect = (lng, lat) => {
      setNewAddress(prev => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [lng, lat]
        }
      }));
    };
  
    if (error) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      );
    }
  
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Address</CardTitle>
          <div className="mt-2">
            <Badge variant="secondary" className="inline-block px-3 py-1 rounded-full text-sm">
              {username}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={newAddress.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={newAddress.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select onValueChange={handleCountryChange} value={newAddress.country}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto" portal={false}>
                  {countries.map((country) => (
                    <SelectItem key={country._id} value={country._id}>
                      {country.country_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <BasicMap
              initialLocation={newAddress.location.coordinates}
              onLocationSelect={handleLocationSelect}
            />
            <Button type="submit" className="w-full">
              Add Address
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };
  
  export default AddNewAddressCard;
  
