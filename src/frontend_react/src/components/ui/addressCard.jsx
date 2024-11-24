import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { MapPin, AlertCircle } from 'lucide-react';
import NonMovableMap from './nonmovableMapAddress'; // Import the NonMovableMap component
import { Button } from "../../components/ui/button"; // Import the Button component
import { Icon } from '@iconify/react'; // Import the Icon component

const AddressCard = () => {
  const [addresses, setAddresses] = useState([]);
  const [username, setUsername] = useState('');
  const [countryMapping, setCountryMapping] = useState({});
  const [error, setError] = useState(null);

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

        // Fetch the addresses
        const addressResponse = await axios.get(`http://localhost:8000/getDeliveryAddresses/${touristId}`);
        setAddresses(addressResponse.data.addresses);

        // Fetch the country mapping
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
        <CardTitle className="text-2xl font-bold">Delivery Addresses</CardTitle>
        <div className="mt-2">
          <Badge variant="secondary" className="inline-block px-3 py-1 rounded-full text-sm">
            {username}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p className="text-gray-500 italic">No addresses found.</p>
        ) : (
          <ul className="space-y-4">
            {addresses.map((address, index) => (
              <li key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-start p-4 bg-white rounded-lg shadow-md border border-gray-200 space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="text-blue-500 mt-1 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-md text-gray-700">
                      <span className="font-bold text-blue-500">Street:</span> <span className="font-bold">{address.street}</span>
                    </p>
                    <p className="text-md text-gray-700">
                      <span className="font-bold text-blue-500">City:</span> <span className="font-bold">{address.city}</span>
                    </p>
                    <p className="text-md text-gray-700">
                      <span className="font-bold text-blue-500">State:</span> <span className="font-bold">{address.state}</span>
                    </p>
                    <p className="text-md text-gray-700">
                      <span className="font-bold text-blue-500">Zip Code:</span> <span className="font-bold">{address.zipCode}</span>
                    </p>
                    <p className="text-md text-gray-700">
                      <span className="font-bold text-blue-500">Country:</span> <span className="font-bold">{countryMapping[address.country] || address.country}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <Button
                        variant="outline"
                        className="mt-2 ml-0"
                        onClick={() => {
                          const mapUrl = `https://www.google.com/maps?q=${address.location.coordinates[1]},${address.location.coordinates[0]}`;
                          window.open(mapUrl, "_blank");
                        }}
                      >
                        <Icon
                          icon="heroicons:location-marker"
                          className="w-4 h-4 mr-2"
                        />
                        Open in Maps
                      </Button>
                    </p>
                  </div>
                </div>
                <NonMovableMap
                  initialLocation={address.location.coordinates} // Use the coordinates from the location object
                  onLocationSelect={() => {}}
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressCard;
