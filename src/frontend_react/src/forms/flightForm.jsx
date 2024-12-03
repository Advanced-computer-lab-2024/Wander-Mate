import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Select from "react-select";

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
        const formattedAirports = airportsData.map((airport) => ({
          value: airport.airport_code,
          label: `${airport.city} (${airport.airport_code})`,
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
      <div
        className="absolute mt-[52vh] ml-[2vw] rounded-b-3xl rounded-tr-3xl p-7"
        style={{ backgroundColor: "rgba(234, 240, 240, 0.8)" }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap justify-between items-end gap-6"
        >
          {/* Origin Field */}
          <div className="flex-1 min-w-[280px]">
            <div className="mb-2">
              <span className="font-bold text-base tracking-wider text-[#283841]">
                Origin
              </span>
            </div>
            <Select
              options={airports}
              value={
                airports.find(
                  (airport) => airport.value === props.flightData.origin
                ) || null
              }
              onChange={(selectedOption) =>
                handleChange("origin", selectedOption.value)
              }
              placeholder="Select Origin"
              className="text-base text-[#283841]"
            />
          </div>

          {/* Destination Field */}
          <div className="flex-1 min-w-[280px]">
            <div className="mb-2">
              <span className="font-bold text-base tracking-wider text-[#283841]">
                Destination
              </span>
            </div>
            <Select
              options={airports}
              value={
                airports.find(
                  (airport) => airport.value === props.flightData.destination
                ) || null
              }
              onChange={(selectedOption) =>
                handleChange("destination", selectedOption.value)
              }
              placeholder="Select Destination"
              className="text-base text-[#283841]"
            />
          </div>

          {/* Departure Date Field */}
          <div className="flex-1 min-w-[280px]">
            <div className="mb-2">
              <span className="font-bold text-base tracking-wider text-[#283841]">
                Departure
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
              <input
                onChange={(e) => handleChange("departureDate", e.target.value)}
                type="date"
                id="departureDate"
                name="departureDate"
                value={props.flightData.departureDate}
                className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
              />
            </div>
          </div>

          {/* Arrival Date Field */}
          <div className="flex-1 min-w-[280px]">
            <div className="mb-2">
              <span className="font-bold text-base tracking-wider text-[#283841]">
                Arrival
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
              <input
                onChange={(e) => handleChange("arrivalDate", e.target.value)}
                type="date"
                id="arrivalDate"
                name="arrivalDate"
                value={props.flightData.arrivalDate}
                className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px]"
          >
            <span className="font-semibold text-base tracking-wider">
              Search Flights
            </span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default FlightForm;
