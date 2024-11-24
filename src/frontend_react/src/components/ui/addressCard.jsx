import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { MapPin, AlertCircle } from 'lucide-react';
import NonMovableMap from './nonMovableMap'; // Import the NonMovableMap component
const AddressCard = () => {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");
        const { userID } = await reply.json();

        const touristId = userID;
        // If touristId is not in sessionStorage, check localStorage as a fallback
        if (!touristId) {
          touristId = localStorage.getItem("touristId");
        }

        if (!touristId) {
          setError("Tourist ID not found in storage.");
          return;
        }

        const response = await axios.get(`http://localhost:8000/getDeliveryAddresses/${touristId}`);
        setAddresses(response.data.addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Failed to fetch addresses.");
      }
    };

    fetchAddresses();
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
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p className="text-gray-500 italic">No addresses found.</p>
        ) : (
          <ul className="space-y-4">
            {addresses.map((address) => (
              <li key={address._id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {address.country}
                    </Badge>
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

