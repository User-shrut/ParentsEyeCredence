import React, { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GlobalContext } from '../../Context/Context';
import MarkerClusterGroup from 'react-leaflet-cluster'

// Importing all vehicle icons
import busredSvg from "../../assets/AllTopViewVehicle/Top R.svg";
import busyellowSvg from '../../assets/AllTopViewVehicle/Top Y.svg';
import busgreenSvg from '../../assets/AllTopViewVehicle/Top G.svg';
import busorangeSvg from '../../assets/AllTopViewVehicle/Top O.svg';
import busgraySvg from '../../assets/AllTopViewVehicle/Top Grey.svg';

import carredSvg from '../../assets/AllTopViewVehicle/Car-R.svg';
import caryellowSvg from '../../assets/AllTopViewVehicle/Car-Y.svg';
import cargreenSvg from '../../assets/AllTopViewVehicle/Car-G.svg';
import carorangeSvg from '../../assets/AllTopViewVehicle/Car-O.svg';
import cargraySvg from '../../assets/AllTopViewVehicle/Car-Grey.svg';

import tractorredSvg from '../../assets/AllTopViewVehicle/Tractor-R.svg';
import tractoryellowSvg from '../../assets/AllTopViewVehicle/Tractor-Y.svg';
import tractorgreenSvg from '../../assets/AllTopViewVehicle/Tractor-G.svg';
import tractororangeSvg from '../../assets/AllTopViewVehicle/Tractor-O.svg';
import tractorgraySvg from '../../assets/AllTopViewVehicle/Tractor-Grey.svg';

import autoredSvg from '../../assets/AllTopViewVehicle/Auto-R.svg';
import autoyellowSvg from '../../assets/AllTopViewVehicle/Auto-Y.svg';
import autogreenSvg from '../../assets/AllTopViewVehicle/Auto-G.svg';
import autoorangeSvg from '../../assets/AllTopViewVehicle/Auto-O.svg';
import autograySvg from '../../assets/AllTopViewVehicle/Auto-Grey.svg';

import jcbredSvg from '../../assets/AllTopViewVehicle/JCB-R.svg';
import jcbyellowSvg from '../../assets/AllTopViewVehicle/JCB-Y.svg';
import jcbgreenSvg from '../../assets/AllTopViewVehicle/JCB-G.svg';
import jcborangeSvg from '../../assets/AllTopViewVehicle/JCB-O.svg';
import jcbgraySvg from '../../assets/AllTopViewVehicle/JCB-GREY.svg';

import truckredSvg from '../../assets/AllTopViewVehicle/Truck-R.svg';
import truckyellowSvg from '../../assets/AllTopViewVehicle/Truck-Y.svg';
import truckgreenSvg from '../../assets/AllTopViewVehicle/Truck-G.svg';
import truckorangeSvg from '../../assets/AllTopViewVehicle/Truck-O.svg';
import truckgraySvg from '../../assets/AllTopViewVehicle/Truck-Grey.svg';

// Define map icons
const mapIcons = {
  bus: {
    red: busredSvg,
    yellow: busyellowSvg,
    green: busgreenSvg,
    orange: busorangeSvg,
    gray: busgraySvg,
  },
  car: {
    red: carredSvg,
    yellow: caryellowSvg,
    green: cargreenSvg,
    orange: carorangeSvg,
    gray: cargraySvg,
  },
  tractor: {
    red: tractorredSvg,
    yellow: tractoryellowSvg,
    green: tractorgreenSvg,
    orange: tractororangeSvg,
    gray: tractorgraySvg,
  },
  auto: {
    red: autoredSvg,
    yellow: autoyellowSvg,
    green: autogreenSvg,
    orange: autoorangeSvg,
    gray: autograySvg,
  },
  jcb: {
    red: jcbredSvg,
    yellow: jcbyellowSvg,
    green: jcbgreenSvg,
    orange: jcborangeSvg,
    gray: jcbgraySvg,
  },
  truck: {
    red: truckredSvg,
    yellow: truckyellowSvg,
    green: truckgreenSvg,
    orange: truckorangeSvg,
    gray: truckgraySvg,
  },
  default: {
    red: carredSvg,
    yellow: caryellowSvg,
    green: cargreenSvg,
    orange: carorangeSvg,
    gray: cargraySvg,
  },
};

// Function to get the correct icon based on vehicle state
const getVehicleIcon = (vehicle, device) => {
  let speed = vehicle.speed;
  let ignition = vehicle.attributes.ignition;
  const category = mapIcons[device?.category] || mapIcons['default'];
  let course = vehicle.course || 0;

  let iconUrl;
  switch (true) {
    case speed <= 2.0 && ignition:
      iconUrl = category['yellow'];
      break;
    case speed > 2.0 && speed < 60 && ignition:
      iconUrl = category['green'];
      break;
    case speed > 60.0 && ignition:
      iconUrl = category['orange'];
      break;
    case speed <= 1.0 && !ignition:
      iconUrl = category['red'];
      break;
    default:
      iconUrl = category['gray'];
      break;
  }

  return L.divIcon({
    html: `<img src="${iconUrl}" style="transform: rotate(${course}deg); width: 48px; height: 48px;" />`,
    iconSize: [48, 48],
    iconAnchor: [24, 24], // Adjust anchor point based on size and rotation
    popupAnchor: [0, -24],
    className: '' // Ensure no default styles are applied
  });
};

const MainMap = () => {
  const { salesManList, salesman } = useContext(GlobalContext);

  return (
    <MapContainer
      center={[21.1458, 79.0882]} // Center map on a default location (e.g., Nagpur)
      zoom={10}
      style={{ height: '550px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; RocketSales, HB Gadget Solutions Nagpur"
      />
  <MarkerClusterGroup chunkedLoading >
{salesManList?.map((sale, index) => {
        const device = salesman.find(device => device.id === sale.deviceId);
        return (
          <Marker
            key={index}
            position={[sale.latitude, sale.longitude]}
            icon={getVehicleIcon(sale, device)}
          >
            <Popup>
              <div>
                <strong>Device ID:</strong> {sale.deviceId} <br />
                <strong>Speed:</strong> {sale.speed} km/h
              </div>
            </Popup>
          </Marker>
        );
      })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MainMap;
