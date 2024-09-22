/* eslint-disable prettier/prettier */
// src/GoogleMapComponent.js

import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, Polygon } from '@react-google-maps/api';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';  
import CropDinIcon from '@mui/icons-material/CropDin'; 
import PolylineIcon from '@mui/icons-material/Polyline'; 

const containerStyle = {
  width: '100%',
  height: '760px',
  borderRadius: '10px',
  overflow: 'hidden',
  position: 'relative',
};

const apiKey = 'AIzaSyAvHHoPKPwRFui0undeEUrz00-8w6qFtik'; // Replace with your actual API key

const Gmap = () => {
  const [center, setCenter] = useState({
    lat: 21.1285453, // Default latitude
    lng: 79.1036561  // Default longitude
  });
  const [lat, setLat] = useState(center.lat);
  const [lng, setLng] = useState(center.lng);
  const [showInputs, setShowInputs] = useState(false);
  const [isDrawingPolyline, setIsDrawingPolyline] = useState(false);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [path, setPath] = useState([]);
  const [polygonPath, setPolygonPath] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLat = parseFloat(lat);
    const newLng = parseFloat(lng);
    if (!isNaN(newLat) && !isNaN(newLng)) {
      setCenter({ lat: newLat, lng: newLng });
    }
  };

  const toggleInputs = () => {
    setShowInputs(!showInputs);
  };

  const handleMapClick = (e) => {
    if (isDrawingPolyline) {
      const newPath = [...path, { lat: e.latLng.lat(), lng: e.latLng.lng() }];
      setPath(newPath);
    }
    if (isDrawingPolygon) {
      const newPolygonPath = [...polygonPath, { lat: e.latLng.lat(), lng: e.latLng.lng() }];
      setPolygonPath(newPolygonPath);
    }
  };

  const toggleDrawingPolyline = () => {
    setIsDrawingPolyline(!isDrawingPolyline);
    if (isDrawingPolyline) {
      setPath([]); // Reset path when stopping drawing polyline
    }
  };

  const toggleDrawingPolygon = () => {
    setIsDrawingPolygon(!isDrawingPolygon);
    if (isDrawingPolygon) {
      setPolygonPath([]); // Reset polygon path when stopping drawing polygon
    }
  };

  // Function to clear the drawn path and polygon
  const clearAll = () => {
    setPath([]); // Clear the polyline path
    setPolygonPath([]); // Clear the polygon path
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={<div>Loading...</div>}
      >
        <div style={{ position: 'relative' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onClick={handleMapClick}
          >
            <Marker position={center} />
            {path.length > 0 && (
              <Polyline 
                path={path} 
                options={{ 
                  strokeColor: '#FF0000', 
                  strokeOpacity: 0.8, 
                  strokeWeight: 2 
                }} 
              />
            )}
            {polygonPath.length > 0 && (
              <Polygon 
                path={polygonPath}
                options={{
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>

          <button 
            onClick={toggleInputs}  
            style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'skyblue' }}
          >
            {showInputs ? 'LAT/LNG' : 'Click On LAT/LNG'}
          </button>
          {showInputs && (
            <form 
              onSubmit={handleSubmit} 
              style={{
                position: 'absolute',
                top: '50px',
                left: '3px',
                backgroundColor: 'grey',
                padding: '4px',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                zIndex: 1000,
              }}
            >
              <input
                type="number"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                style={{ marginRight: '0px' }}
              />
              <input
                type="number"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
                style={{ marginRight: '0px' }}
              />
              <button type="submit" style={{ backgroundColor: 'green', color: 'white' }}>Submit</button>
            </form>
          )}

          {/* Icon buttons */}
          <IconButton 
            style={{ position: 'absolute', top: '60px', right: '10px', backgroundColor: 'white' }} 
            onClick={toggleDrawingPolyline}
          >
            <PolylineIcon />
          </IconButton>

          <IconButton 
            style={{ position: 'absolute', top: '103px', right: '10px', backgroundColor: 'white' }} 
            onClick={toggleDrawingPolygon}
          >
            <CropDinIcon />
          </IconButton>

          <IconButton 
            style={{ position: 'absolute', top: '147px', right: '10px', backgroundColor: 'white' }} 
            onClick={clearAll} // Call the clearAll function on click
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </LoadScript>
    </div>
  );
};

export default Gmap;
