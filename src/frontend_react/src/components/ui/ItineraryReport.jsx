import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import TouristDetailsModal from './touristDetailsModal'; // Import the modal

const ItineraryReportTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedItinerary, setSelectedItinerary] = useState(null); // Selected itinerary

  const columns = [
    { key: "itineraryName", label: "Itinerary Name" },
    { key: "totalTourists", label: "Number of Tourists" },
    { key: "price", label: "Price" },
    { key: "totalRevenue", label: "Total Revenue" },
    { key: "isFlagged", label: "Is Flagged" },
  ];

  const fetchTourGuideID = async () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      setError('No username found in session storage.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/getID/${username}`);
      if (!response.ok) throw new Error("Failed to fetch tour guide ID");

      const { userID } = await response.json();
      fetchItineraryReport(userID);
    } catch (error) {
      console.error("Error fetching tour guide ID:", error);
      setError("Could not load tour guide information.");
      setLoading(false);
    }
  };

  const fetchItineraryReport = async (guideID) => {
    try {
      const response = await fetch(`http://localhost:8000/viewItineraryReport/${guideID}`);
      if (!response.ok) throw new Error("Failed to fetch itinerary report");

      const { report } = await response.json();
      console.log("Fetched Report:", report); // Debug: Log the fetched report
      setReports(report);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching itinerary report:", error);
      setError("Could not load itinerary report.");
      setLoading(false);
    }
  };

  const handleViewDetails = (itinerary) => {
    setSelectedItinerary(itinerary); // Set the selected itinerary
    setIsModalOpen(true); // Open the modal
  };

  useEffect(() => {
    fetchTourGuideID();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="px-4 py-2 text-left">{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => {
            console.log("Report in Table Row:", report); // Log each row for debugging
            return (
              <TableRow key={index}>
                <TableCell className="px-4 py-2">{report.itineraryName}</TableCell>
                <TableCell className="px-4 py-2">{report.totalTourists}</TableCell>
                <TableCell className="px-4 py-2">
                  {report.itineraryPrice !== undefined && !isNaN(report.itineraryPrice)
                    ? `$${report.itineraryPrice.toFixed(2)}`
                    : 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {report.itineraryPrice !== undefined && report.totalTourists !== undefined
                    ? `$${(report.totalTourists * report.itineraryPrice).toFixed(2)}`
                    : 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {report.itineraryActive !== undefined
                    ? (report.itineraryActive ? 'Yes' : 'No')
                    : 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Button
                    className="p-0 px-15 h-auto hover:bg-transparent bg-transparent text-primary hover:text-primary/80 hover:underline"
                    onClick={() => handleViewDetails(report)} // Trigger modal on click
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Tourist Details Modal */}
      {selectedItinerary && (
        <TouristDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close modal
          tourists={selectedItinerary.tourists || []} // Pass tourists
          itineraryName={selectedItinerary.itineraryName}
        />
      )}
    </>
  );
};

export default ItineraryReportTable;
