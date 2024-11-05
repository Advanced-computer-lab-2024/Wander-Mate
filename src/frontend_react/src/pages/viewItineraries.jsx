import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../../src/components/ui/table"; // Adjust import path as needed

const ViewItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/itineraries"); // Update the endpoint URL
        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <Table wrapperClass="my-4">
        <TableCaption>List of Available Itineraries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Activities</TableHead>
            <TableHead>Locations To Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itineraries.map((itinerary) => (
            <TableRow key={itinerary._id}>
              <TableCell>{itinerary._id}</TableCell>
              <TableCell>
                {itinerary.Activities.map((activity, index) => (
                  <span key={index}>{activity.name} </span>
                ))}
              </TableCell>
              <TableCell>
                {itinerary.LocationsToVisit.map((location, index) => (
                  <span key={index}>{location.name} </span>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Showing {itineraries.length} itineraries
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ViewItineraries;
