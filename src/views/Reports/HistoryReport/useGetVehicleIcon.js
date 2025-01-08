import React from 'react'
import L from 'leaflet' // Import L for Leaflet methods
import busredSvg from '../../../assets/AllTopViewVehicle/Top R.svg'
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
import dayjs from 'dayjs'

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
const getCategory = (category) => {
  switch (category) {
    case 'car':
      return 'car'
    case 'bus':
      return 'bus'
    case 'truck':
      return 'truck'
    case 'motorcycle':
      return 'bike' // Adjusted to match the imageMap key
    case 'auto':
      return 'auto'
    case 'tractor':
      return 'crane'
    case 'jcb':
      return 'jcb'
    default:
      return 'car' // Default case
  }
}

const maxDiffInHours = 35

function timeDiffIsLessThan35Hours(lastUpdate) {
  const lastUpdateTime = dayjs(lastUpdate)
  const now = dayjs()
  return now.diff(lastUpdateTime, 'hour') <= maxDiffInHours
}
const useGetVehicleIcon = (vehicle, cat) => {
  const speed = vehicle?.speed
  const ignition = vehicle?.attributes?.ignition
  const course = vehicle?.course || 0
  const category = getCategory(cat?.toLowerCase())

  // Select the category of icons
  const selectedCategory = mapIcons[category] || mapIcons['default']

  // Determine the icon URL based on speed and ignition status
  let iconUrl
  if (speed <= 2.0 && ignition && timeDiffIsLessThan35Hours(vehicle.lastUpdate)) {
    //idle
    iconUrl = selectedCategory['yellow']
  } else if (
    speed > 2.0 &&
    speed < 60 &&
    ignition &&
    timeDiffIsLessThan35Hours(vehicle.lastUpdate)
  ) {
    iconUrl = selectedCategory['green'] // running
  } else if (speed > 60.0 && ignition && timeDiffIsLessThan35Hours(vehicle.lastUpdate)) {
    iconUrl = selectedCategory['orange'] // overspeed
  } else if (speed <= 1.0 && !ignition && timeDiffIsLessThan35Hours(vehicle.lastUpdate)) {
    iconUrl = selectedCategory['red'] // stop
  } else if (!timeDiffIsLessThan35Hours(vehicle.lastUpdate)) {
    iconUrl = selectedCategory['gray'] // inactive
  }

  return L.divIcon({
    html: `<img src="${iconUrl}" style="transform: rotate(${course}deg); width: 48px; height: 48px;" />`,
    iconSize: [48, 48],
    iconAnchor: [24, 24], // Anchor at the center
    popupAnchor: [0, -24], // Popup above the icon
    className: '', // No additional styling
  })
}

export default useGetVehicleIcon
