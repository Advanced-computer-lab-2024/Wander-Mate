import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import TouristDetailsModal from "./touristDetailsModal"; // Import the modal

const ItineraryReportTable = () => {
  const [reports, setReports] = useState([]); // All reports (unfiltered)
  const [filteredReports, setFilteredReports] = useState([]); // Filtered reports based on month and year
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null); // State to store the selected itinerary
  const [tourists, setTourists] = useState([]); // State to store tourists
  const [month, setMonth] = useState(""); // Selected month for filter
  const [year, setYear] = useState(""); // Selected year for filter

  const columns = [
    { key: "itineraryName", label: "Itinerary Name" },
    { key: "totalTourists", label: "Number of Tourists" },
    { key: "price", label: "Price" },
    { key: "totalRevenue", label: "Total Revenue" },
    { key: "isFlagged", label: "Is Flagged" },
  ];

  const fetchTourGuideID = async () => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      setError("No username found in session storage.");
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
      const response = await fetch(
        `http://localhost:8000/viewItineraryReport/${guideID}`
      );
      if (!response.ok) throw new Error("Failed to fetch itinerary report");
      const { report } = await response.json();
      setReports(report); // Store all the reports
      setFilteredReports(report); // Initially, no filter applied
      setLoading(false);
    } catch (error) {
      console.error("Error fetching itinerary report:", error);
      setError("Could not load itinerary report.");
      setLoading(false);
    }
  };

  const handleViewDetails = async (itineraryName) => {
    const selected = filteredReports.find(
      (report) => report.itineraryName === itineraryName
    );
    if (selected) {
      setTourists(selected.tourists);
      setSelectedItinerary(selected.itineraryName); // Set the selected itinerary
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === "month") {
      setMonth(value); // Update the month state
    } else if (name === "year") {
      setYear(value); // Update the year state
    }
  };

  // Filter the itineraries by month and year
  const filterReportsByMonthAndYear = () => {
    if (!month || !year) {
      // If no filter, show all itineraries
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter((report) => {
      const bookingsInMonth = report.bookedDates.filter((bookedDate) => {
        const date = new Date(bookedDate);
        const bookingMonth = date.getMonth() + 1; // getMonth() returns 0 for January, so we add 1
        const bookingYear = date.getFullYear();
        return (
          bookingMonth === parseInt(month) && bookingYear === parseInt(year)
        );
      });
      return bookingsInMonth.length > 0;
    });

    setFilteredReports(filtered);
  };

  // Clear filter button handler
  const handleClearFilter = () => {
    setMonth(""); // Reset month filter
    setYear(""); // Reset year filter
    setFilteredReports(reports); // Show all reports again
  };

  useEffect(() => {
    fetchTourGuideID();
  }, []);

  useEffect(() => {
    filterReportsByMonthAndYear(); // Re-filter the reports every time month or year changes
  }, [month, year, reports]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* Filter inputs */}
      <div className="filter-section mb-4">
        {/* Month filter */}
        <select
          name="month"
          value={month}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded mr-4"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, index) => {
            const monthName = new Date(0, index).toLocaleString("default", {
              month: "long",
            });
            return (
              <option key={index} value={index + 1}>
                {monthName}
              </option>
            );
          })}
        </select>

        {/* Year filter */}
        <select
          name="year"
          value={year}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded mr-4"
        >
          <option value="">Select Year</option>
          {/* You can customize the range of years based on your requirements */}
          {Array.from({ length: 10 }, (_, index) => 2020 + index).map(
            (yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            )
          )}
        </select>

        {/* Clear Filter Button */}
        <Button onClick={handleClearFilter}>Clear Filter</Button>
      </div>

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="px-4 py-2 text-left">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="px-4 py-2">
                  {report.itineraryName}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {report.totalTourists}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {report.itineraryPrice !== undefined &&
                  !isNaN(report.itineraryPrice)
                    ? `$${report.itineraryPrice.toFixed(2)}`
                    : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {report.itineraryPrice !== undefined &&
                  report.totalTourists !== undefined
                    ? `$${(report.totalTourists * report.itineraryPrice).toFixed(2)}`
                    : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {report.itineraryActive !== undefined
                    ? report.itineraryActive
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Button
                    onClick={() => handleViewDetails(report.itineraryName)} // Pass the itinerary name here
                    className="p-0 px-15 h-auto hover:bg-transparent bg-transparent text-primary hover:text-primary/80 hover:underline"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* TouristDetailsModal will be shown when a specific itinerary is selected */}
      <TouristDetailsModal
        isOpen={!!selectedItinerary}
        onClose={() => setSelectedItinerary(null)}
        tourists={tourists}
        itineraryName={selectedItinerary}
      />
    </>
  );
};

export default ItineraryReportTable;
