import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../assets/css/Map2.css';

mapboxgl.accessToken = 'pk.eyJ1IjoieW91c3NlZm1lZGhhdGFzbHkiLCJhIjoiY2x3MmpyZzYzMHAxbDJxbXF0dDN1MGY2NSJ9.vrWqL8FrrRzm0yAfUNpu6g';

const NonMovableMap = ({ onLocationSelect, initialLocation }) => {
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

    map.current.on('load', () => {
      marker.current = new mapboxgl.Marker({ draggable: false }) // Ensure the marker is non-draggable
        .setLngLat([lng, lat])
        .addTo(map.current);
    });

    map.current.on('click', (e) => {
      // The marker's position is not updated on click
      const { lng, lat } = e.lngLat;
      onLocationSelect(lng, lat);
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, [onLocationSelect]);

  return (
    <div className="map-wrapper1">
      <div ref={mapContainer} className="map-container1" />
    </div>
  );
};

export default NonMovableMap;
