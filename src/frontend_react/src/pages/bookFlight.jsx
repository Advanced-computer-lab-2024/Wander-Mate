import React, { useState } from "react";
import FlightForm from "../forms/flightForm";
import Flight from "../components/flight";
import axios from "axios";

const BookFlight = (props) => {
  const [flightData, setFlightData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      console.log(fetchedFlights);
      setFlights(fetchedFlights);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setError("Failed to fetch flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="container mt-4">
        <FlightForm
          flightData={flightData}
          onFlightDataChange={handleFlightDataChange}
          onSubmit={handleSubmit}
        />
        {loading && <p className="text-center mt-4">Loading flights...</p>}
        {error && <p className="text-center mt-4 text-danger">{error}</p>}
        {!loading && !error && flights.length > 0 && (
          <div className="mt-4">
            <h2 className="mb-3">Available Flights</h2>
            <ul className="list-unstyled">
              {flights.map((f, index) => (
                <li key={index} className="mb-3">
                  <Flight flight={f} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default BookFlight;
