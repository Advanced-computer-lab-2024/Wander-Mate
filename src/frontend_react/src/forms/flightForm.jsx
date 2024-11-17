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
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="row g-3">
          <div className="col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {props.flightData.origin || "Select Origin"}
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
                      handleChange("origin", airport.airport_code)
                    }
                  >
                    {`${airport.airport_name} (${airport.airport_code})`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
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
          <div className="w-full max-w-[270px]">
            <div className="col">
              <label className="form-control m-2" htmlFor="departureDate">
                Departure:
                <input
                  onChange={(e) =>
                    handleChange("departureDate", e.target.value)
                  }
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={props.flightData.departureDate}
                  required
                />
              </label>
            </div>
          </div>
          <div className="w-full max-w-[250px]">
            <div className="col">
              <label className="form-control m-2" htmlFor="arrivalDate">
                Arrival:
                <input
                  onChange={(e) => handleChange("arrivalDate", e.target.value)}
                  type="date"
                  id="arrivalDate"
                  name="arrivalDate"
                  value={props.flightData.arrivalDate}
                  required
                />
              </label>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <Button type="submit" className="btn btn-primary">
            Search
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FlightForm;
