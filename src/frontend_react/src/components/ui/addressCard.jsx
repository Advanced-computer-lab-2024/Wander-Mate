import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

const AddressCardWithMap = ({ name, street, city, state, zipCode, country }) => {
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCUGuPbWdSWysqduevM3zHurxQAf8cFyTY&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', initMap);

    return () => {
      googleMapScript.removeEventListener('load', initMap);
    };
  }, []);

  const initMap = () => {
    const defaultLocation = { lat: -34.397, lng: 150.644 };
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 8,
    });

    setMap(newMap);

    const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);

    newMap.addListener("bounds_changed", () => {
      searchBox.setBounds(newMap.getBounds());
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      if (marker) {
        marker.setMap(null);
      }

      const place = places[0];

      if (place.geometry && place.geometry.location) {
        const newMarker = new window.google.maps.Marker({
          map: newMap,
          position: place.geometry.location,
        });

        setMarker(newMarker);

        newMap.setCenter(place.geometry.location);
        newMap.setZoom(15);

        console.log("Location:", place.geometry.location.lat(), place.geometry.location.lng());
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex items-center gap-2 border-b border-gray-200">
        <MapPin className="h-6 w-6 text-blue-500" />
        <h3 className="text-lg leading-6 font-medium text-gray-900">{name}</h3>
      </div>
      <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <address className="not-italic">
            <p className="text-sm text-gray-500 mb-1">{street}</p>
            <p className="text-sm text-gray-500 mb-1">{city}, {state} {zipCode}</p>
            <p className="text-sm text-gray-500">{country}</p>
          </address>
        </div>
        <div className="flex flex-col">
          <input
            ref={searchBoxRef}
            className="mb-2 p-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Search for places"
          />
          <div ref={mapRef} className="h-64 w-full rounded-md overflow-hidden"></div>
        </div>
      </div>
    </div>
  );
};

// Example usage
const App = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <AddressCardWithMap
        name="John Doe"
        street="123 Main St"
        city="Anytown"
        state="CA"
        zipCode="12345"
        country="USA"
      />
    </div>
  );
};

export default App;

