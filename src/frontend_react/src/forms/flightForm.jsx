import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Icon } from "@iconify/react";
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
        setAirports(airportsData);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px]"
            >
              {props.flightData.origin || "Select Origin"}
              <Icon icon="heroicons:chevron-down" className="h-5 w-5 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-[200px] overflow-y-auto">
            {airports.map((airport) => (
              <DropdownMenuItem
                key={airport._id}
                onSelect={() => handleChange("origin", airport.airport_code)}
              >
                {`${airport.airport_name} (${airport.airport_code})`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="col">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px]"
              >
                {props.flightData.destination || "Select Destination"}
                <Icon
                  icon="heroicons:chevron-down"
                  className="h-5 w-5 ml-auto"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[200px] overflow-y-auto">
              {airports.map((airport) => (
                <DropdownMenuItem
                  key={airport._id}
                  onSelect={() =>
                    handleChange("destination", airport.airport_code)
                  }
                >
                  {`${airport.airport_name} (${airport.airport_code})`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
          <input
            onChange={(e) => handleChange("departureDate", e.target.value)}
            type="date"
            id="departureDate"
            name="departureDate"
            value={props.flightData.departureDate}
            placeholder="Departure Date"
            className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
            required
          />
          <Calendar className="w-6 h-6 text-[#826AF9]" />
        </div>
        <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
          <input
            onChange={(e) => handleChange("arrivalDate", e.target.value)}
            type="date"
            id="arrivalDate"
            name="arrivalDate"
            value={props.flightData.arrivalDate}
            placeholder="Arrival Date"
            className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
            required
          />
          <Calendar className="w-6 h-6 text-[#826AF9]" />
        </div>
        <div className="text-center mt-4">
          <button
            type="submit"
            className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px]"
          >
            <span className="font-semibold text-base tracking-wider">
              Search Flights
            </span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FlightForm;
