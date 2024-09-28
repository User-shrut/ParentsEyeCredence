import React, { useContext, useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GlobalContext } from '../../../Context/Context';
import { CCard, CCardBody, CCardHeader } from '@coreui/react';
import axios from 'axios';
import useVehicleTracker from './useVehicleTracker';
import { useParams } from 'react-router-dom';
import location from 'src/assets/location.png';
import { duration } from 'dayjs';

import busredSvg from '../../../assets/AllTopViewVehicle/Top R.svg';
import busyellowSvg from '../../../assets/AllTopViewVehicle/Top Y.svg'
import busgreenSvg from '../../../assets/AllTopViewVehicle/Top G.svg'
import busorangeSvg from '../../../assets/AllTopViewVehicle/Top O.svg'
import busgraySvg from '../../../assets/AllTopViewVehicle/Top Grey.svg'

import carredSvg from '../../../assets/AllTopViewVehicle/Car-R.svg'
import caryellowSvg from '../../../assets/AllTopViewVehicle/Car-Y.svg'
import cargreenSvg from '../../../assets/AllTopViewVehicle/Car-G.svg'
import carorangeSvg from '../../../assets/AllTopViewVehicle/Car-O.svg'
import cargraySvg from '../../../assets/AllTopViewVehicle/Car-Grey.svg'

import tractorredSvg from '../../../assets/AllTopViewVehicle/Tractor-R.svg'
import tractoryellowSvg from '../../../assets/AllTopViewVehicle/Tractor-Y.svg'
import tractorgreenSvg from '../../../assets/AllTopViewVehicle/Tractor-G.svg'
import tractororangeSvg from '../../../assets/AllTopViewVehicle/Tractor-O.svg'
import tractorgraySvg from '../../../assets/AllTopViewVehicle/Tractor-Grey.svg'

import autoredSvg from '../../../assets/AllTopViewVehicle/Auto-R.svg'
import autoyellowSvg from '../../../assets/AllTopViewVehicle/Auto-Y.svg'
import autogreenSvg from '../../../assets/AllTopViewVehicle/Auto-G.svg'
import autoorangeSvg from '../../../assets/AllTopViewVehicle/Auto-O.svg'
import autograySvg from '../../../assets/AllTopViewVehicle/Auto-Grey.svg'

import jcbredSvg from '../../../assets/AllTopViewVehicle/JCB-R.svg'
import jcbyellowSvg from '../../../assets/AllTopViewVehicle/JCB-Y.svg'
import jcbgreenSvg from '../../../assets/AllTopViewVehicle/JCB-G.svg'
import jcborangeSvg from '../../../assets/AllTopViewVehicle/JCB-O.svg'
import jcbgraySvg from '../../../assets/AllTopViewVehicle/JCB-GREY.svg'

import truckredSvg from '../../../assets/AllTopViewVehicle/Truck-R.svg'
import truckyellowSvg from '../../../assets/AllTopViewVehicle/Truck-Y.svg'
import truckgreenSvg from '../../../assets/AllTopViewVehicle/Truck-G.svg'
import truckorangeSvg from '../../../assets/AllTopViewVehicle/Truck-O.svg'
import truckgraySvg from '../../../assets/AllTopViewVehicle/Truck-Grey.svg'

// Fix Leaflet's default marker icon in Webpack



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
}

const getVehicleIcon = (vehicle, cat) => {
  let speed = vehicle.speed
  let ignition = vehicle.attributes.ignition
  const category = mapIcons[cat] || mapIcons['default']
  let course = vehicle.course || 0

  let iconUrl
  switch (true) {
    case speed <= 2.0 && ignition:
      iconUrl = category['yellow']
      break
    case speed > 2.0 && speed < 60 && ignition:
      iconUrl = category['green']
      break
    case speed > 60.0 && ignition:
      iconUrl = category['orange']
      break
    case speed <= 1.0 && !ignition:
      iconUrl = category['red']
      break
    default:
      iconUrl = category['gray']
      break
  }

  return L.divIcon({
    html: `<img src="${iconUrl}" style="transform: rotate(${course}deg); width: 48px; height: 48px;" />`,
    iconSize: [48, 48],
    iconAnchor: [24, 24], // Adjust anchor point based on size and rotation
    popupAnchor: [0, -24],
    className: '', // Ensure no default styles are applied
  })

}


const MapController = ({ individualSalesMan, previousPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (individualSalesMan && map) {
      const { latitude, longitude } = individualSalesMan;
      const targetPosition = [latitude, longitude];

      if (previousPosition) {
        const { latitude: prevLat, longitude: prevLon } = previousPosition;

        // Smooth animation logic
        const distance = map.distance(previousPosition, targetPosition);
        const duration = 500; // Duration in milliseconds (3 seconds)

        // Calculate steps based on the distance and desired duration
        const steps = Math.ceil(distance / 0.0001); // Adjust the step size for smoother animation
        const latDiff = (latitude - prevLat) / steps;
        const lonDiff = (longitude - prevLon) / steps;

        let stepCount = 0;

        const animateMarker = () => {
          if (stepCount < steps) {
            const newLat = prevLat + latDiff * stepCount;
            const newLon = prevLon + lonDiff * stepCount;

            // Set the view to the new position smoothly
            map.setView([newLat, newLon], map.getZoom(), { animate: true });

            stepCount++;
            setTimeout(animateMarker, duration / steps); // Use setTimeout for smooth pacing
          } else {
            // Final setView to ensure it lands on the target position
            map.setView(targetPosition, 16, { animate: true });
          }
        };

        requestAnimationFrame(animateMarker);
      } else {
        map.setView(targetPosition, 16, { animate: true });
      }
    }
  }, [individualSalesMan, map, previousPosition]);

  return null;
};



const IndividualTrack = () => {
  const { deviceId, category, name } = useParams();
  const { vehicleData, loading, error } = useVehicleTracker(deviceId);
  const [individualSalesMan, setIndividualSalesMan] = useState(null);
  const { salesManList, selectedSalesMan } = useContext(GlobalContext);
  const [address, setAddress] = useState(null);
  const previousPosition = useRef(null); // Ref to store the previous position

  useEffect(() => {
    if (vehicleData) {
      setIndividualSalesMan(vehicleData[0]);
      console.log(vehicleData[0]);
    }
  }, [vehicleData]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/reverse.php?key=pk.23e7282ce5839ef4196426bbd0fd0def&lat=${individualSalesMan?.latitude}&lon=${individualSalesMan?.longitude}&format=json`
        );
        setAddress(response.data);
      } catch (error) {
        console.error('Error fetching the address:', error);
        setAddress('Error fetching address');
      }
    };

    if (individualSalesMan?.latitude && individualSalesMan?.longitude) {
      fetchAddress();
    }
  }, [individualSalesMan]);


  return (
    <>
      <div className="row">
        <div className="col-8">
          <div className="details" style={{ height: '150px' }}>
            <CCard className="mb-4">
              <div className="row">
                <div className="col flex">
                  <div>👷‍♂️</div>
                  <div>{name ? name : 'User Name'}</div>
                </div>
                <div className="col flex">
                  <div>🛣</div>
                  <div className="col">
                    {address
                      ? `${address.address.road}, ${address.address.village}, ${address.address.state_district}, ${address.address.state}, ${address.address.country}, ${address.address.postcode}`
                      : 'Address of User'}
                  </div>
                </div>
              </div>
              <div className="row g-2">
                <div className="col"><CCard className="mb-4">{`Ignition : ${individualSalesMan?.attributes?.ignition}`}</CCard></div>
                <div className="col"><CCard className="mb-4">{`Speed : ${individualSalesMan?.speed} kmph`}</CCard></div>
                <div className="col"><CCard className="mb-4">{`Latitude : ${individualSalesMan?.latitude}`}</CCard></div>
                <div className="col"><CCard className="mb-4">{`Longitude : ${individualSalesMan?.longitude}`}</CCard></div>
                <div className="col"><CCard className="mb-4">{`Category : ${category}`}</CCard></div>
              </div>
            </CCard>
          </div>
          <div className="individualMap">
            <MapContainer
              center={[21.1458, 79.0882]} // Default center in case data isn't available
              zoom={13}
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; RocketSales, HB Gadget Solutions Nagpur"
              />
              {individualSalesMan && (
                <Marker
                  position={[individualSalesMan.latitude, individualSalesMan.longitude]}
                  icon={getVehicleIcon(individualSalesMan, category)}
                >
                  <Popup>
                    A pretty marker.
                    <br /> Easily customizable.
                  </Popup>
                </Marker>
              )}
              <MapController individualSalesMan={individualSalesMan} previousPosition={previousPosition.current} />
            </MapContainer>
          </div>
        </div>
        <div className="col-4">
          <CCard className="mb-4">
            <CCardHeader>Tasks</CCardHeader>
            <CCardBody>
              <ul>
                <li>Task 1</li>
                <li>Task 2</li>
                <li>Task 3</li>
                <li>Task 4</li>
                <li>Task 5</li>
              </ul>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </>
  );
};

export default IndividualTrack;
