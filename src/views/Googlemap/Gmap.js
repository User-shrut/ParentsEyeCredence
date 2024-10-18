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

// import React, { useState, useRef, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CropDinIcon from '@mui/icons-material/CropDin';
// import PolylineIcon from '@mui/icons-material/Polyline';
// import { CTooltip } from '@coreui/react';

// const containerStyle = {
//   width: '100%',
//   height: '560px',
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

// const apiKey = 'AIzaSyAvHHoPKPwRFui0undeEUrz00-8w6qFtik';

// // Utility function to parse the area string into lat, lng, and radius
// const parseGeofenceArea = (area) => {
//   const match = area?.match(/Circle\(([\d.]+) ([\d.]+), ([\d.]+)\)/);
//   if (match) {
//     const lat = parseFloat(match[1]);
//     const lng = parseFloat(match[2]);
//     const radius = parseFloat(match[3]);
//     return { lat, lng, radius };
//   }
//   return null;
// };

// const Gmap = ({ data }) => {
//   const [center, setCenter] = useState({
//     lat: 21.1285453,
//     lng: 79.1036561,
//   });
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const mapContainerRef = useRef(null);

//   console.log(data)
//   const geofences = data; 
//   console.log(geofences)

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
//           >
//             <Marker position={center} />

//             {/* Iterate over the geofences array and render a Circle for each */}
//             {geofences.map((geofence, index) => {
//               const geofenceData = parseGeofenceArea(geofence.area);
//               return (
//                 geofenceData && (
//                   <Circle
//                     key={geofence._id}
//                     center={{ lat: geofenceData.lat, lng: geofenceData.lng }}
//                     radius={geofenceData.radius}
//                     options={{
//                       fillColor: '#00FF00',
//                       fillOpacity: 0.35,
//                       strokeColor: '#00FF00',
//                       strokeOpacity: 0.8,
//                       strokeWeight: 2,
//                     }}
//                   />
//                 )
//               );
//             })}

//           </GoogleMap>

//           <button
//             onClick={toggleFullscreen}
//             style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'skyblue', zIndex: 1000 }}
//           >
//             {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
//           </button>
//         </div>
//       </LoadScript>
//     </div>
//   );
// };

// export default Gmap;



// import React, { useState, useRef, useEffect } from 'react';
// import { GoogleMap, LoadScript, Polygon, useLoadScript } from '@react-google-maps/api';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CropDinIcon from '@mui/icons-material/CropDin';
// import PolylineIcon from '@mui/icons-material/Polyline';
// import { CTooltip } from '@coreui/react';

// const containerStyle = {
//   width: '100%',
//   height: '560px',
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

// const apiKey = 'AIzaSyAvHHoPKPwRFui0undeEUrz00-8w6qFtik';




// const Gmap = ({ data }) => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: apiKey,
//   });
//   const [center, setCenter] = useState({
//     lat: 21.1285453,
//     lng: 79.1036561,
//   });
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const mapContainerRef = useRef(null);

//   const geofences = data.filter(geofence => geofence.area.length > 0 && geofence.area.every(point => point.lat && point.lng));;
//   console.log("geofence hai ye ",geofences)

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
//     <div ref={mapContainerRef} style={containerStyle}>
//       <LoadScript googleMapsApiKey={apiKey}>
//         <div style={{ position: 'relative' }}>
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={center}
//             zoom={14}
//           >

//             {geofences.map((geofence, index) => (
//                 <Polygon
//                   key={index}
//                   path={geofence.area.map(({ lat, lng }) => ({ lat, lng }))}
//                   options={{
//                     fillColor: '#FF0000',
//                     fillOpacity: 0.35,
//                     strokeColor: '#FF0000',
//                     strokeOpacity: 0.8,
//                     strokeWeight: 2,
//                   }}
//                 />
              
//             ))}

//           </GoogleMap>

          
//         </div>
//       </LoadScript>
//     </div>
//   );
// };

// export default Gmap;

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CropDinIcon from '@mui/icons-material/CropDin';
import PolylineIcon from '@mui/icons-material/Polyline';
import { CTooltip } from '@coreui/react';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '10px',
  overflow: 'hidden',
  position: 'relative',
};

const fullscreenContainerStyle = {
  width: '100%',
  height: '100vh',
  position: 'fixed',
  borderRadius: '10px',
  top: 0,
  left: 0,
  zIndex: 1000,
  backgroundColor: '#fff',
};

const apiKey = 'AIzaSyAvHHoPKPwRFui0undeEUrz00-8w6qFtik';

const Gmap = ({ data }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const [center, setCenter] = useState({
    lat: 21.1285453,
    lng: 79.1036561,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef(null);

  const geofences = data.filter(
    (geofence) => geofence.area.length > 0 && geofence.area.every((point) => point.lat && point.lng)
  );
  console.log('geofence hai ye ', geofences);

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

  // Handle loading and error states
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div ref={mapContainerRef} style={containerStyle}>
      <div style={{ position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
          
          {geofences.map((geofence, index) => (
            <Polygon
              key={index}
              path={geofence.area.map(({ lat, lng }) => ({ lat, lng }))}
              options={{
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Gmap;

