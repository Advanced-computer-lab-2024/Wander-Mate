import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../../assets/css/Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoieW91c3NlZm1lZGhhdGFzbHkiLCJhIjoiY2x3MmpyZzYzMHAxbDJxbXF0dDN1MGY2NSJ9.vrWqL8FrrRzm0yAfUNpu6g';

const BasicMap = ({ onLocationSelect, initialLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(initialLocation ? initialLocation[0] : -122.420679);
  const [lat, setLat] = useState(initialLocation ? initialLocation[1] : 37.774929);
  const [zoom, setZoom] = useState(12);
  const marker = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add geocoder to the map
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false // Disable default marker
    });

    map.current.addControl(geocoder);

    geocoder.on('result', (e) => {
      const { lng, lat } = e.result.geometry.coordinates;
      if (!isNaN(lng) && !isNaN(lat)) { // Check if coordinates are valid numbers
        marker.current.setLngLat([lng, lat]);
        onLocationSelect(lng, lat);
        map.current.flyTo({ center: [lng, lat], zoom: 14 });
      } else {
        console.error("Invalid coordinates from geocoder result:", e.result.geometry.coordinates);
      }
    });

    map.current.on('load', () => {
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current);
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      marker.current.setLngLat([lng, lat]);
      onLocationSelect(lng, lat);
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, [onLocationSelect]);

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default BasicMap;