import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Icon } from "@iconify/react";
import Select from "react-select";
import { Calendar } from "lucide-react";
import { ArrowRight } from "lucide-react";
const FlightForm = (props) => {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch("http://localhost:8000/getairports");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const airportsData = await response.json();
        console.log(airportsData); // Log the fetched data
        const formattedAirports = airportsData.map((airport) => ({
          value: airport.airport_code, // Ensure `airport_code` exists in your data
          label: `${airport.city} (${airport.airport_code})`, // Combine properties appropriately
        }));
        setAirports(formattedAirports);
      } catch (error) {
        console.error("Error fetching airports:", error);
        alert("Could not load airports. Please try again later.");
      }
    };

    fetchAirports(); // Call the function to fetch airports
  }, []);

  const handleChange = (name, value) => {
    props.onFlightDataChange({ ...props.flightData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <React.Fragment>
      <form
        onSubmit={handleSubmit}
        className="bg-[#EAF0F0] rounded-b-3xl rounded-tr-3xl p-7"
      >
        <div className="row g-3">
          <div className="col">
            <Select
              placeholder="Select Origin"
              value={
                airports.find(
                  (airport) => airport.value === props.flightData.origin
                ) || null
              }
              options={airports} // Pass the list of airports
              onChange={(selectedOption) =>
                handleChange("origin", selectedOption.value)
              } // Update the origin when selected
              getOptionLabel={(option) => `${option.label}`} // Define how to display labels
              getOptionValue={(option) => option.value} // Define the unique value for each option
            />
          </div>
          <div className="col">
            <Select
              placeholder="Select Destination"
              value={
                airports.find(
                  (airport) => airport.value === props.flightData.destination
                ) || null
              }
              options={airports} // Pass the list of airports
              onChange={(selectedOption) =>
                handleChange("destination", selectedOption.value)
              } // Update the origin when selected
              getOptionLabel={(option) => `${option.label}`} // Define how to display labels
              getOptionValue={(option) => option.value} // Define the unique value for each option
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
            <input
              onChange={(e) => handleChange("departureDate", e.target.value)}
              type="date"
              id="departureDate"
              name="departureDate"
              value={props.flightData.departureDate}
              className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
              required
            />
            {/* <Calendar className="w-6 h-6 text-[#826AF9]" /> */}
          </div>

          <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
            <input
              onChange={(e) => handleChange("arrivalDate", e.target.value)}
              type="date"
              id="arrivalDate"
              name="arrivalDate"
              value={props.flightData.arrivalDate}
              className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
              required
            />
            {/* <Calendar className="w-6 h-6 text-[#826AF9]" /> */}
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px] mt-3"
        >
          <span className="font-semibold text-base tracking-wider">
            Search Flights
          </span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </form>
    </React.Fragment>
  );
};

export default FlightForm;
