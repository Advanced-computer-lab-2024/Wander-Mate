import React from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
const FlightForm = (props) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
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
            <input
              onChange={handleChange}
              type="text"
              className="form-control m-2"
              placeholder="Origin"
              name="origin"
              value={props.flightData.origin}
              required
            />
          </div>
          <div className="col">
            <input
              onChange={handleChange}
              type="text"
              className="form-control m-2"
              placeholder="Destination"
              name="destination"
              value={props.flightData.destination}
              required
            />
          </div>
          <div className="w-full max-w-[270px] ">
            <div className="col">
              <label className="form-control m-2" htmlFor="departureDate">
                Departure:
                <input
                  onChange={handleChange}
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={props.flightData.departureDate}
                  required
                />
              </label>
            </div>
          </div>
          <div className="w-full max-w-[250px] ">
            <div className="col">
              <label className="form-control m-2" htmlFor="departureDate">
                Arrival:
                <input
                  onChange={handleChange}
                  type="date"
                  id="departureDate"
                  name="arrivalDate"
                  value={props.flightData.arrivalDate}
                  required
                />
              </label>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FlightForm;
