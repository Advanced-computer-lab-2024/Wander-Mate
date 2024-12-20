import { ArrowDown, ArrowRight, Calendar } from "lucide-react";
import React, { useState, useEffect } from "react";
import FlightForm from "../forms/flightForm";
import Flight from "../components/flight";
import axios from "axios";
import Select from "react-select";
import HotelCard from "./hotelCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import beach from "../public/images/onTheBeach.jpeg";
import NavigationMenuBar from "./NavigationMenuBar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const FlightOrHotelSearch = () => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
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
  const [selectedPlace, setSelectedPlace] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutdate, setCheckOutDate] = useState("");
  const [hotels, setHotels] = useState([]);
  const combo = sessionStorage.getItem("curr");

  // Fetch countries on component mount
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const c = sessionStorage.getItem("curr");
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${c}`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries"
      );
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
        value: state.name,
        label: state.name,
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

    if (buttonText === "Search Hotels") {
      if (!selectedCountry || !selectedState) {
        setError("Please select both country and state.");
        setLoading(false);
        return;
      }

      setSelectedPlace(`${selectedCountry.value},${selectedState.value}`);

      if (!checkInDate || !checkOutdate) {
        setError("Please select both check-in and check-out dates.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.put("http://localhost:8000/searchHotel", {
          place: `${selectedCountry.value},${selectedState.value}`,
          checkInDate: checkInDate,
          checkOutdate: checkOutdate,
        });
        console.log(response);
        setHotels(response.data);
        // Handle the response data here
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch results. Please try again.");
      }
    } else {
      // Flight search logic
      if (
        !flightData.origin ||
        !flightData.destination ||
        !flightData.departureDate ||
        !flightData.arrivalDate
      ) {
        setError("Please fill in all flight search fields.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/search-flights", {
          params: flightData,
        });
        const fetchedFlights = res.data.data;
        setFlights(fetchedFlights);
      } catch (error) {
        console.error("Error fetching flights:", error);
        setError("Failed to fetch flights. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <NavigationMenuBar />
      <div className="w-full mx-auto relative">
        <div
          className="w-full h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${beach})`,
            backgroundSize: "cover", // or "contain"
            backgroundPosition: "center",
            height: "100%", // Adjust height as necessary
          }}
        >
          <div
            className="absolute mt-[32vh] ml-[2vw] rounded-t-3xl"
            style={{
              width: "fit-content",
              backgroundColor: "rgba(234, 240, 240, 0.8)",
            }}
          >
            <div className="flex items-center p-7 gap-5 ">
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
                <span className="font-bold text-base tracking-wider">
                  Hotels
                </span>
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
                <span className="font-bold text-base tracking-wider">
                  Flights
                </span>
              </button>
            </div>
          </div>
          {selected === 0 ? (
            <div
              className="absolute mt-[47vh] ml-[2vw] rounded-b-3xl rounded-tr-3xl p-7"
              style={{ backgroundColor: "rgba(234, 240, 240, 0.8)" }} // 0.5 is 50% transparency
            >
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
                      onChange={(selectedOption) => {
                        // Remove "Governorate" and trim spaces
                        const cleanedLabel = selectedOption.label
                          .replace(/Governorate/gi, "")
                          .trim();
                        setSelectedState({
                          ...selectedOption,
                          label: cleanedLabel,
                          value: cleanedLabel,
                        });
                      }}
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
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
                    />
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
                      type="date"
                      value={checkOutdate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px]"
                >
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
            </React.Fragment>
          )}{" "}
        </div>
        {selected === 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <ECommerceDefaultSkeleton key={index} />
              ))
            ) : hotels.length > 0 ? (
              hotels.map((hotel) => (
                <HotelCard
                  currency={combo}
                  key={hotel.id}
                  id={hotel.id}
                  title={hotel.title.replace(/^\d+\.\s*/, "")}
                  checkInDate={checkInDate}
                  checkOutdate={checkOutdate}
                  price={
                    parseFloat(hotel.price.replace(/[^0-9.]/g, "")) /
                    (exchangeRates[currency] || 1)
                  }
                  rating={hotel.rating}
                  provider={hotel.provider}
                  cardPhotos={hotel.cardPhotos}
                  cancellationPolicy={hotel.cancellationPolicy}
                  sponsor={hotel.sponsor}
                />
              ))
            ) : (
              <p className="col-span-full text-center">No hotels found</p>
            )}
          </div>
        )}
        {selected === 1 && loading && (
          <p className="text-center mt-4">Loading flights...</p>
        )}
        {selected === 1 && error && (
          <p className="text-center mt-4 text-danger">{error}</p>
        )}
        {selected === 1 && !loading && !error && flights.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-[2.5vw]">
            {flights.map((f, index) => (
              <Flight flight={f} />
            ))}
          </div>
        )}
      </div>
      <TourismGovernerFooter />
    </>
  );
};

export default FlightOrHotelSearch;
