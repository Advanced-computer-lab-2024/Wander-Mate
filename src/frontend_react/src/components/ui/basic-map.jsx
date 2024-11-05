"use client";
import GoogleMapReact from "google-map-react";
const GoogleMapApiKey = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCUGuPbWdSWysqduevM3zHurxQAf8cFyTY&libraries=places&callback=initMap";
const BasicMap = ({ latitude, longitude, height = 500 }) => {
  const defaultProps = {
    center: {
      lat: latitude || 10.99835602, // Default lat if none provided
      lng: longitude || 77.01502627, // Default lng if none provided
    },
    zoom: 11,
  };

  return (
    <div style={{ height: height, width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GoogleMapApiKey }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      />
    </div>
  );
};

export default BasicMap;
