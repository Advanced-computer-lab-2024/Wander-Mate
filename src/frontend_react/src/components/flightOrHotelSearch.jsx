import { ArrowDown, ArrowRight, Calendar } from "lucide-react";
import React, { useState, useEffect } from "react";
import FlightForm from "../forms/flightForm";
import Flight from "../components/flight";
import axios from "axios";
import Select from "react-select";

const FlightOrHotelSearch = () => {
  const [selected, setSelected] = useState(0);
  const [buttonText, setButtonText] = useState("Search Hotels");
  const [flightData, setFlightData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get("https://countriesnow.space/api/v0.1/countries");
      const countryOptions = response.data.data.map((country) => ({
        value: country.country,
        label: country.country,
      }));
      setCountries(countryOptions);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          country: country.value,
        }
      );
      console.log(response);
      const stateOptions = response.data.data.states.map((state) => ({
        value: state.name || state.state ,
        label: state.name || state.state,
      }));
      setStates(stateOptions);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null); // Reset selected state
    fetchStates(selectedOption);
  };

  const handleFlightDataChange = (newFlightData) => {
    setFlightData(newFlightData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8000/search-flights", {
        params: {
          origin: flightData.origin,
          destination: flightData.destination,
          departureDate: flightData.departureDate,
          returnDate: flightData.arrivalDate,
        },
      });
      const fetchedFlights = res.data.data;
      setFlights(fetchedFlights);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setError("Failed to fetch flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div
        className="bg-[#EAF0F0] rounded-t-3xl"
        style={{ width: "fit-content" }}
      >
        <div className="flex items-center p-7 gap-5">
          <button
            className={
              selected === 0
                ? "flex items-center px-8 py-3 gap-4 bg-[#826AF9] rounded-lg text-white"
                : "flex items-center px-8 py-3 gap-4 text-[#283841]"
            }
            onClick={() => {
              setSelected(0);
              setButtonText("Search Hotels");
            }}
          >
            <span className="font-bold text-base tracking-wider">Hotels</span>
          </button>
          <button
            className={
              selected === 1
                ? "flex items-center px-8 py-3 gap-4 bg-[#826AF9] rounded-lg text-white"
                : "flex items-center px-8 py-3 gap-4 text-[#283841]"
            }
            onClick={() => {
              setSelected(1);
              setButtonText("Search Flights");
            }}
          >
            <span className="font-bold text-base tracking-wider">Flights</span>
          </button>
        </div>
      </div>
      {selected === 0 ? (
        <div className="bg-[#EAF0F0] rounded-b-3xl rounded-tr-3xl p-7">
          <div className="flex flex-wrap justify-between items-end gap-6">
            {/* Country Selection */}
            <div className="flex-1 min-w-[280px]">
              <div className="mb-2">
                <span className="font-bold text-base tracking-wider text-[#283841]">
                  Country
                </span>
              </div>
              <Select
                options={countries}
                value={selectedCountry}
                onChange={handleCountryChange}
                placeholder="Select Country"
                className="text-base text-[#283841]"
              />
            </div>

            {/* State Selection */}
            {selectedCountry && (
              <div className="flex-1 min-w-[280px]">
                <div className="mb-2">
                  <span className="font-bold text-base tracking-wider text-[#283841]">
                    State
                  </span>
                </div>
                <Select
                  options={states}
                  value={selectedState}
                  onChange={setSelectedState}
                  placeholder="Select State"
                  className="text-base text-[#283841]"
                />
              </div>
            )}

            {/* Check-In Field */}
            <div className="flex-1 min-w-[280px]">
              <div className="mb-2">
                <span className="font-bold text-base tracking-wider text-[#283841]">
                  Check-In
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
                <input
                  type="text"
                  placeholder="Choose Dates"
                  className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
                />
                <Calendar className="w-6 h-6 text-[#826AF9]" />
              </div>
            </div>

            {/* Check-Out Field */}
            <div className="flex-1 min-w-[280px]">
              <div className="mb-2">
                <span className="font-bold text-base tracking-wider text-[#283841]">
                  Check-Out
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
                <input
                  type="text"
                  placeholder="Choose Dates"
                  className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
                />
                <Calendar className="w-6 h-6 text-[#826AF9]" />
              </div>
            </div>

            <button className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px]">
              <span className="font-semibold text-base tracking-wider">
                {buttonText}
              </span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <FlightForm
            flightData={flightData}
            onFlightDataChange={handleFlightDataChange}
            onSubmit={handleSubmit}
          />
          {loading && <p className="text-center mt-4">Loading flights...</p>}
          {error && <p className="text-center mt-4 text-danger">{error}</p>}
          {!loading && !error && flights.length > 0 && (
            <div className="mt-4">
              <ul>
                {flights.map((f, index) => (
                  <li key={index}>
                    <Flight flight={f} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default FlightOrHotelSearch;
  