// import React, { useState, useRef, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, Polyline, Polygon } from '@react-google-maps/api';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';  
// import CropDinIcon from '@mui/icons-material/CropDin'; 
// import PolylineIcon from '@mui/icons-material/Polyline'; 
// import { CTooltip } from '@coreui/react';

// const containerStyle = {
//   width: '100%',
//   height: '760px',
//   borderRadius: '10px',
//   overflow: 'hidden',
//   position: 'relative',
// };

// const fullscreenContainerStyle = {
//   width: '100%',
//   height: '100vh',
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   zIndex: 1000,
//   backgroundColor: '#fff',
// };

// const apiKey = 'AIzaSyAvHHoPKPwRFui0undeEUrz00-8w6qFtik'; // Replace with your actual API key

// const Gmap = () => {
//   const [center, setCenter] = useState({
//     lat: 21.1285453, // Default latitude
//     lng: 79.1036561  // Default longitude
//   });
//   const [lat, setLat] = useState(center.lat);
//   const [lng, setLng] = useState(center.lng);
//   const [showInputs, setShowInputs] = useState(false);
//   const [isPolylineActive, setIsPolylineActive] = useState(false);
//   const [isPolygonActive, setIsPolygonActive] = useState(false);
//   const [path, setPath] = useState([]);
//   const [polygonPath, setPolygonPath] = useState([]);
//   const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen state
//   const mapContainerRef = useRef(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newLat = parseFloat(lat);
//     const newLng = parseFloat(lng);
//     if (!isNaN(newLat) && !isNaN(newLng)) {
//       setCenter({ lat: newLat, lng: newLng });
//     }
//   };

//   const toggleInputs = () => {
//     setShowInputs(!showInputs);
//   };

//   const handleMapClick = (e) => {
//     if (isPolylineActive) {
//       const newPath = [...path, { lat: e.latLng.lat(), lng: e.latLng.lng() }];
//       setPath(newPath);
//     }
//     if (isPolygonActive) {
//       const newPolygonPath = [...polygonPath, { lat: e.latLng.lat(), lng: e.latLng.lng() }];
//       setPolygonPath(newPolygonPath);
//     }
//   };

//   const togglePolyline = () => {
//     setIsPolylineActive(!isPolylineActive);
//     setIsPolygonActive(false);
//     if (!isPolylineActive) {
//       setPath([]);
//     }
//   };

//   const togglePolygon = () => {
//     setIsPolygonActive(!isPolygonActive);
//     setIsPolylineActive(false);
//     if (!isPolygonActive) {
//       setPolygonPath([]);
//     }
//   };

//   const clearAll = () => {
//     setPath([]);
//     setPolygonPath([]);
//     setIsPolylineActive(false);
//     setIsPolygonActive(false);
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       mapContainerRef.current.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, []);

//   return (
//     <div ref={mapContainerRef} style={isFullscreen ? fullscreenContainerStyle : containerStyle}>
//       <LoadScript googleMapsApiKey={apiKey}>
//         <div style={{ position: 'relative' }}>
//           <GoogleMap
//             mapContainerStyle={isFullscreen ? fullscreenContainerStyle : containerStyle}
//             center={center}
//             zoom={14}
//             onClick={handleMapClick}
//           >
//             <Marker position={center} />
//             {path.length > 0 && (
//               <Polyline 
//                 path={path} 
//                 options={{ 
//                   strokeColor: '#FF0000', 
//                   strokeOpacity: 0.8, 
//                   strokeWeight: 2 
//                 }} 
//               />
//             )}
//             {polygonPath.length > 0 && (
//               <Polygon 
//                 path={polygonPath}
//                 options={{
//                   fillColor: '#FF0000',
//                   fillOpacity: 0.35,
//                   strokeColor: '#FF0000',
//                   strokeOpacity: 0.8,
//                   strokeWeight: 2,
//                 }}
//               />
//             )}
//           </GoogleMap>

//           {/* Fullscreen Toggle Button */}
//           <button 
//             onClick={toggleFullscreen} 
//             style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'skyblue', zIndex: 1000 }}
//           >
//             {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
//           </button>

//           {/* LAT/LNG Form */}
//           <button 
//             onClick={toggleInputs}  
//             style={{ position: 'absolute', top: '50px', left: '10px', backgroundColor: 'skyblue', zIndex: 1000 }}
//           >
//             {showInputs ? 'LAT/LNG' : 'Click On LAT/LNG'}
//           </button>
//           {showInputs && (
//             <form 
//               onSubmit={handleSubmit} 
//               style={{
//                 position: 'absolute',
//                 top: '90px',
//                 left: '10px',
//                 backgroundColor: 'grey',
//                 padding: '4px',
//                 borderRadius: '5px',
//                 zIndex: 1100,
//               }}
//             >
//               <input
//                 type="number"
//                 value={lat}
//                 onChange={(e) => setLat(e.target.value)}
//                 placeholder="Latitude"
//                 style={{ marginRight: '10px' }}
//               />
//               <input
//                 type="number"
//                 value={lng}
//                 onChange={(e) => setLng(e.target.value)}
//                 placeholder="Longitude"
//                 style={{ marginRight: '10px' }}
//               />
//               <button type="submit" style={{ backgroundColor: 'green', color: 'white' }}>Submit</button>
//             </form>
//           )}

//           {/* Icon buttons */}
//           <CTooltip content='Line'>
//             <IconButton 
//               style={{ position: 'absolute', top: '60px', right: '10px', backgroundColor: 'white', zIndex: 1000 }} 
//               onClick={togglePolyline}
//               color={isPolylineActive ? 'primary' : 'default'}
//             >
//               <PolylineIcon />
//             </IconButton>
//           </CTooltip>

//           <CTooltip content='Polygon'>
//             <IconButton 
//               style={{ position: 'absolute', top: '103px', right: '10px', backgroundColor: 'white', zIndex: 1000 }} 
//               onClick={togglePolygon}
//               color={isPolygonActive ? 'primary' : 'default'}
//             >
//               <CropDinIcon />
//             </IconButton>
//           </CTooltip>

//           <CTooltip content='Delete'>
//             <IconButton 
//               style={{ position: 'absolute', top: '147px', right: '10px', backgroundColor: 'white', zIndex: 1000 }} 
//               onClick={clearAll}
//             >
//               <DeleteIcon />
//             </IconButton>
//           </CTooltip>
          
//         </div>
//       </LoadScript>
//     </div>
//   );
// };

// export default Gmap;


// For latitude and longitude show in console

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, Polygon } from '@react-google-maps/api';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CropDinIcon from '@mui/icons-material/CropDin';
import PolylineIcon from '@mui/icons-material/Polyline';
import { CTooltip } from '@coreui/react';

const containerStyle = {
  width: '100%',
  height: '760px',
  borderRadius: '10px',
  overflow: 'hidden',
  position: 'relative',
};

const fullscreenContainerStyle = {
  width: '100%',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
  backgroundColor: '#fff',
};

const apiKey = 'AIzaSyAvHHoPKPwRFui0undeEUrz00-8w6qFtik'; // Replace with your actual API key

const Gmap = () => {
  const [center, setCenter] = useState({
    lat: 21.1285453,
    lng: 79.1036561,
  });
  const [lat, setLat] = useState(center.lat);
  const [lng, setLng] = useState(center.lng);
  const [showInputs, setShowInputs] = useState(false);
  const [isPolylineActive, setIsPolylineActive] = useState(false);
  const [isPolygonActive, setIsPolygonActive] = useState(false);
  const [path, setPath] = useState([]);
  const [polygonPath, setPolygonPath] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef(null);

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
    const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (isPolylineActive) {
      const newPath = [...path, latLng];
      setPath(newPath);
      console.log('Polyline path:', newPath); // Logs each point clicked for polyline
    }
    if (isPolygonActive) {
      const newPolygonPath = [...polygonPath, latLng];
      setPolygonPath(newPolygonPath);
      console.log('Polygon path:', newPolygonPath); // Logs each point clicked for polygon
    }
  };

  const togglePolyline = () => {
    setIsPolylineActive(!isPolylineActive);
    setIsPolygonActive(false);
    if (!isPolylineActive) {
      setPath([]);
    }
  };

  const togglePolygon = () => {
    setIsPolygonActive(!isPolygonActive);
    setIsPolylineActive(false);
    if (!isPolygonActive) {
      setPolygonPath([]);
    }
  };

  const clearAll = () => {
    setPath([]);
    setPolygonPath([]);
    setIsPolylineActive(false);
    setIsPolygonActive(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={isFullscreen ? fullscreenContainerStyle : containerStyle}>
      <LoadScript googleMapsApiKey={apiKey}>
        <div style={{ position: 'relative' }}>
          <GoogleMap
            mapContainerStyle={isFullscreen ? fullscreenContainerStyle : containerStyle}
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
                  strokeWeight: 2,
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

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'skyblue', zIndex: 1000 }}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>

          {/* LAT/LNG Form */}
          <button
            onClick={toggleInputs}
            style={{ position: 'absolute', top: '50px', left: '10px', backgroundColor: 'skyblue', zIndex: 1000 }}
          >
            {showInputs ? 'LAT/LNG' : 'Click On LAT/LNG'}
          </button>
          {showInputs && (
            <form
              onSubmit={handleSubmit}
              style={{
                position: 'absolute',
                top: '90px',
                left: '10px',
                backgroundColor: 'grey',
                padding: '4px',
                borderRadius: '5px',
                zIndex: 1100,
              }}
            >
              <input
                type="number"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                style={{ marginRight: '10px' }}
              />
              <input
                type="number"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
                style={{ marginRight: '10px' }}
              />
              <button type="submit" style={{ backgroundColor: 'green', color: 'white' }}>
                Submit
              </button>
            </form>
          )}

          {/* Icon buttons */}
          <CTooltip content="Line">
            <IconButton
              style={{ position: 'absolute', top: '60px', right: '10px', backgroundColor: 'white', zIndex: 1000 }}
              onClick={togglePolyline}
              color={isPolylineActive ? 'primary' : 'default'}
            >
              <PolylineIcon />
            </IconButton>
          </CTooltip>

          <CTooltip content="Polygon">
            <IconButton
              style={{ position: 'absolute', top: '103px', right: '10px', backgroundColor: 'white', zIndex: 1000 }}
              onClick={togglePolygon}
              color={isPolygonActive ? 'primary' : 'default'}
            >
              <CropDinIcon />
            </IconButton>
          </CTooltip>

          <CTooltip content="Delete">
            <IconButton
              style={{ position: 'absolute', top: '147px', right: '10px', backgroundColor: 'white', zIndex: 1000 }}
              onClick={clearAll}
            >
              <DeleteIcon />
            </IconButton>
          </CTooltip>
        </div>
      </LoadScript>
    </div>
  );
};

export default Gmap;

 