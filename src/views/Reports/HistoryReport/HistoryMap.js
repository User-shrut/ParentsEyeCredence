import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-cluster'

// Importing all vehicle icons
import busredSvg from '../../assets/AllTopViewVehicle/Top R.svg'
import busyellowSvg from '../../assets/AllTopViewVehicle/Top Y.svg'
import busgreenSvg from '../../assets/AllTopViewVehicle/Top G.svg'
import busorangeSvg from '../../assets/AllTopViewVehicle/Top O.svg'
import busgraySvg from '../../assets/AllTopViewVehicle/Top Grey.svg'

import carredSvg from '../../assets/AllTopViewVehicle/Car-R.svg'
import caryellowSvg from '../../assets/AllTopViewVehicle/Car-Y.svg'
import cargreenSvg from '../../assets/AllTopViewVehicle/Car-G.svg'
import carorangeSvg from '../../assets/AllTopViewVehicle/Car-O.svg'
import cargraySvg from '../../assets/AllTopViewVehicle/Car-Grey.svg'

import tractorredSvg from '../../assets/AllTopViewVehicle/Tractor-R.svg'
import tractoryellowSvg from '../../assets/AllTopViewVehicle/Tractor-Y.svg'
import tractorgreenSvg from '../../assets/AllTopViewVehicle/Tractor-G.svg'
import tractororangeSvg from '../../assets/AllTopViewVehicle/Tractor-O.svg'
import tractorgraySvg from '../../assets/AllTopViewVehicle/Tractor-Grey.svg'

import autoredSvg from '../../assets/AllTopViewVehicle/Auto-R.svg'
import autoyellowSvg from '../../assets/AllTopViewVehicle/Auto-Y.svg'
import autogreenSvg from '../../assets/AllTopViewVehicle/Auto-G.svg'
import autoorangeSvg from '../../assets/AllTopViewVehicle/Auto-O.svg'
import autograySvg from '../../assets/AllTopViewVehicle/Auto-Grey.svg'

import jcbredSvg from '../../assets/AllTopViewVehicle/JCB-R.svg'
import jcbyellowSvg from '../../assets/AllTopViewVehicle/JCB-Y.svg'
import jcbgreenSvg from '../../assets/AllTopViewVehicle/JCB-G.svg'
import jcborangeSvg from '../../assets/AllTopViewVehicle/JCB-O.svg'
import jcbgraySvg from '../../assets/AllTopViewVehicle/JCB-GREY.svg'

import truckredSvg from '../../assets/AllTopViewVehicle/Truck-R.svg'
import truckyellowSvg from '../../assets/AllTopViewVehicle/Truck-Y.svg'
import truckgreenSvg from '../../assets/AllTopViewVehicle/Truck-G.svg'
import truckorangeSvg from '../../assets/AllTopViewVehicle/Truck-O.svg'
import truckgraySvg from '../../assets/AllTopViewVehicle/Truck-Grey.svg'

import { FaSearchLocation } from 'react-icons/fa'
import { IoMdSpeedometer } from 'react-icons/io'
import { HiOutlineStatusOnline } from 'react-icons/hi'
import { RxLapTimer } from 'react-icons/rx'
import dayjs from 'dayjs'
import './map.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { IoLocationSharp } from 'react-icons/io5'
import { GiSpeedometer } from 'react-icons/gi'

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
}

// Function to get the correct icon based on vehicle state
const getVehicleIcon = (vehicle) => {
  let speed = vehicle.speed
  let ignition = vehicle.attributes.ignition
  const category = mapIcons[vehicle?.category] || mapIcons['default']
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

const HistoryMap = () => {
  return (
    <MapContainer
      center={[21.1458, 79.0882]} // Center map on a default location (e.g., Nagpur)
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: '550px', width: '100%', borderRadius: '15px', border: '2px solid gray' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; Credence Tracker, HB Gadget Solutions Nagpur"
      />
      <MarkerClusterGroup chunkedLoading>
        <Marker
          key={index}
          position={[vehicle.latitude, vehicle.longitude]}
          icon={getVehicleIcon(vehicle)}
        >
          <Popup>
            <div>
              <h6>{vehicle.name}</h6>
              <p>{vehicle.deviceId}</p>
              <p>{address[vehicle.id]}</p>
            </div>
          </Popup>
        </Marker>
      </MarkerClusterGroup>
    </MapContainer>
  )
}

export default HistoryMap
