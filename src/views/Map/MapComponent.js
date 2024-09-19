import React, { useContext, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import location from 'src/assets/location.png'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { GlobalContext } from '../../Context/Context'

// Import marker icons for Leaflet
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default marker icon in Webpack
const customIcon = L.icon({
  iconUrl: location, // URL of your custom marker image
  iconSize: [48, 48], // size of the icon (width, height)
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png', // optional shadow URL
  shadowSize: [41, 41], // size of the shadow
  shadowAnchor: [13, 41], // point of the shadow which will correspond to marker's location
})
const MainMap = () => {
  const { salesManPosition } = useContext(GlobalContext);
  if(salesManPosition){
    console.log(salesManPosition);
  }
  return (
    <>
      <MapContainer
        center={[21.1458, 79.0882]}
        zoom={8}
        style={{ height: '550px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; RocketSales, HB Gadget Solutions Nagpur"
        />
        {salesManPosition?.map((salesman , index) => (
          <Marker key={index} position={[salesman.lat, salesman.lng]} icon={customIcon}>
            <Popup>
              {salesManPosition?.deviceId}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

export default MainMap
