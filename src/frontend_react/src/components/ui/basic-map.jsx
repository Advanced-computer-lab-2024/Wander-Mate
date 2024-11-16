import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";

const BasicMap = ({ latitude, longitude, height = 500 }) => {
  const defaultProps = {
    center: {
      lat: latitude || 10.99835602,
      lng: longitude || 77.01502627,
    },
    zoom: 11,
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCEJgmpAlPbyvW8m5d_EYUXBR5YTxzV4TQ&libraries=places&v=weekly&loading=async`;
    script.async = true;
    document.head.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <div style={{ height: height, width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "YOUR_API_KEY" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      />
    </div>
  );
};

export default BasicMap;
