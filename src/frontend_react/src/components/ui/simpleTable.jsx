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

const ItineraryReportTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: "itineraryName", label: "Itinerary Name" },
    { key: "totalTourists", label: "Number of Tourists" },
    { key: "totalRevenue", label: "Total Revenue" },
    { key: "action", label: "Action" },
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
      setReports(report);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching itinerary report:", error);
      setError("Could not load itinerary report.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourGuideID();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report, index) => (
          <TableRow key={index}>
            <TableCell>{report.itineraryName}</TableCell>
            <TableCell>{report.totalTourists}</TableCell>
            <TableCell>${(report.totalTourists * (report.price || 0)).toFixed(2)}</TableCell>
            <TableCell>
              <Button className="p-0 h-auto hover:bg-transparent bg-transparent text-primary hover:text-primary/80 hover:underline">
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ItineraryReportTable;

