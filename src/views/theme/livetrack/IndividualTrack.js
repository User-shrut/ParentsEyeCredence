import React, { useContext, useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { GlobalContext } from '../../../Context/Context'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import axios from 'axios'
import useVehicleTracker from './useVehicleTracker'
import { useParams } from 'react-router-dom'
import location from 'src/assets/location.png'
import { duration } from 'dayjs' // Importing all vehicle icons
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
// Fix Leaflet's default marker icon in Webpack
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker'
import './IndividualTrack.css'

// ================================CAR==================================
import carGreen from '../../../assets/vehicleList/Car/carGreen.svg'
import carRed from '../../../assets/vehicleList/Car/carRed.svg'
import carYellow from '../../../assets/vehicleList/Car/carYellow.svg'
import carOrange from '../../../assets/vehicleList/Car/carOrange.svg'
import carGray from '../../../assets/vehicleList/Car/carGray.svg'

//==============================BIKE========================================
import bikeGreen from '../../../assets/vehicleList/Bike/bikeGreen.svg'
import bikeRed from '../../../assets/vehicleList/Bike/bikeRed.svg'
import bikeYellow from '../../../assets/vehicleList/Bike/bikeYellow.svg'
import bikeOrange from '../../../assets/vehicleList/Bike/bikeOrange.svg'
import bikeGray from '../../../assets/vehicleList/Bike/bikeGray.svg'

import busGreen from '../../../assets/vehicleList/Bus/busGreen.svg'
import busRed from '../../../assets/vehicleList/Bus/busRed.svg'
import busOrange from '../../../assets/vehicleList/Bus/busOrange.svg'
import busYellow from '../../../assets/vehicleList/Bus/busYellow.svg'
import busGray from '../../../assets/vehicleList/Bus/busGray.svg'

//==============================TRUCK========================================
import truckGreen from '../../../assets/vehicleList/Truck/truckGreen.svg'
import truckRed from '../../../assets/vehicleList/Truck/truckRed.svg'
import truckYellow from '../../../assets/vehicleList/Truck/truckYellow.svg'
import truckOrange from '../../../assets/vehicleList/Truck/truckOrange.svg'
import truckGray from '../../../assets/vehicleList/Truck/truckGray.svg'

//==============================CRANE========================================
import craneGreen from '../../../assets/vehicleList/Crane/craneGreen.svg'
import craneRed from '../../../assets/vehicleList/Crane/craneRed.svg'
import craneYellow from '../../../assets/vehicleList/Crane/craneYellow.svg'
import craneOrange from '../../../assets/vehicleList/Crane/craneOrange.svg'
import craneGray from '../../../assets/vehicleList/Crane/craneGray.svg'

//==============================JCB========================================
import jcbGreen from '../../../assets/vehicleList/JCB/jcbGreen.svg'
import jcbRed from '../../../assets/vehicleList/JCB/jcbRed.svg'
import jcbYellow from '../../../assets/vehicleList/JCB/jcbYellow.svg'
import jcbOrange from '../../../assets/vehicleList/JCB/jcbOrange.svg'
import jcbGray from '../../../assets/vehicleList/JCB/jcbGray.svg'

//==============================AUTO========================================
import autoGreen from '../../../assets/vehicleList/Auto/autoGreen.svg'
import autoRed from '../../../assets/vehicleList/Auto/autoRed.svg'
import autoYellow from '../../../assets/vehicleList/Auto/autoYellow.svg'
import autoOrange from '../../../assets/vehicleList/Auto/autoOrange.svg'
import autoGray from '../../../assets/vehicleList/Auto/autoGray.svg'
import Draggable from 'react-draggable'

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

const MapController = ({ individualSalesMan, previousPosition, setPath }) => {
  const map = useMap()
  const animationRef = useRef(null)

  useEffect(() => {
    if (individualSalesMan && map) {
      const { latitude, longitude } = individualSalesMan
      const targetPosition = [latitude, longitude]

      // Update the path with the new position
      setPath((prevPath) => [...prevPath, targetPosition])

      if (previousPosition) {
        const { latitude: prevLat, longitude: prevLon } = previousPosition
        const start = [prevLat, prevLon]
        const end = targetPosition
        const duration = 5000 // Total animation duration in milliseconds

        let startTime

        const animateMarker = (timestamp) => {
          if (!startTime) startTime = timestamp

          const elapsedTime = timestamp - startTime
          const progress = Math.min(elapsedTime / duration, 1) // Calculate progress between 0 and 1

          // Calculate intermediate positions
          const newLat = prevLat + (latitude - prevLat) * progress
          const newLon = prevLon + (longitude - prevLon) * progress

          map.setView([newLat, newLon], map.getZoom(), { animate: true })

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateMarker) // Continue animation
          } else {
            // Final position
            map.setView(targetPosition, 16, { animate: true })
          }
        }

        animationRef.current = requestAnimationFrame(animateMarker)

        return () => {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current) // Clean up animation
          }
        }
      } else {
        map.setView(targetPosition, 16, { animate: true })
      }
    }
  }, [individualSalesMan, map, previousPosition, setPath])

  return null
}

const IndividualTrack = () => {
  const { deviceId, category, name } = useParams()
  const { vehicleData, loading, error } = useVehicleTracker(deviceId)
  const [individualSalesMan, setIndividualSalesMan] = useState(null)
  const { salesManList, selectedSalesMan } = useContext(GlobalContext)
  const [address, setAddress] = useState(null)
  const previousPosition = useRef(null) // Ref to store the previous position
  const [path, setPath] = useState([]) // State for polyline path

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
  const selectImage = (category, sp, ig) => {
    const cate = getCategory(category)
    let image

    const imageMap = {
      car: {
        red: carRed,
        green: carGreen,
        yellow: carYellow,
        orange: carOrange,
        gray: carGray,
      },
      bike: {
        red: bikeRed,
        green: bikeGreen,
        yellow: bikeYellow,
        orange: bikeOrange,
        gray: bikeGray,
      },
      truck: {
        red: truckRed,
        green: truckGreen,
        yellow: truckYellow,
        orange: truckOrange,
        gray: truckGray,
      },
      auto: {
        red: autoRed,
        green: autoGreen,
        yellow: autoYellow,
        orange: autoOrange,
        gray: autoGray,
      },
      jcb: {
        red: jcbRed,
        green: jcbGreen,
        yellow: jcbYellow,
        orange: jcbOrange,
        gray: jcbGray,
      },
      crane: {
        red: craneRed,
        green: craneGreen,
        yellow: craneYellow,
        orange: craneOrange,
        gray: craneGray,
      },
      tractor: {
        red: craneRed,
        green: craneGreen,
        yellow: craneYellow,
        orange: craneOrange,
        gray: craneGray,
      },
      bus: {
        red: busRed,
        green: busGreen,
        yellow: busYellow,
        orange: busOrange,
        gray: busGray,
      },
    }

    const ignition = ig
    const speed = sp || 0

    if (!ignition && speed < 1) {
      image = imageMap[cate].red
    } else if (ignition && speed > 2 && speed < 60) {
      image = imageMap[cate].green
    } else if (ignition && speed < 2) {
      image = imageMap[cate].yellow
    } else if (ignition && speed > 60) {
      image = imageMap[cate].orange
    } else {
      image = imageMap[cate].gray
    }

    return image || car // Return a default image if no match found
  }

  useEffect(() => {
    if (vehicleData) {
      setIndividualSalesMan(vehicleData[0])
      console.log(vehicleData[0])
    }
  }, [vehicleData])

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/reverse.php?key=pk.23e7282ce5839ef4196426bbd0fd0def&lat=${individualSalesMan?.latitude}&lon=${individualSalesMan?.longitude}&format=json`,
        )
        setAddress(response.data)
      } catch (error) {
        console.error('Error fetching the address:', error)
        setAddress('Error fetching address')
      }
    }

    if (individualSalesMan?.latitude && individualSalesMan?.longitude) {
      fetchAddress()
    }
  }, [individualSalesMan])

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="individualMap">
            <MapContainer
              center={[21.1458, 79.0882]} // Default center in case data isn't available
              zoom={13}
              style={{ height: '650px', marginTop: '7px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; RocketSales, HB Gadget Solutions Nagpur"
              />

              <Draggable>
                <CCard className="mb-4 parametersContainer" style={{ zIndex: '9999' }}>
                  <CCardHeader>Tasks</CCardHeader>
                  <CCardBody>
                    <div className="name">
                      <div className="nameImage">
                        <img
                          src={selectImage(
                            category,
                            individualSalesMan?.speed,
                            individualSalesMan?.attributes?.ignition,
                          )}
                          className="nimg upperdata"
                          alt="vehicle"
                        />
                      </div>
                      <div>{name ? name : 'User Name'}</div>
                    </div>

                    <div className="parameters">
                      <div className="col">
                        <strong>Address</strong>
                        {address
                          ? ` : ${address.address?.road}, ${address.address?.village}, ${address.address?.state_district}, ${address.address?.state}, ${address.address?.country}, ${address.address?.postcode}`
                          : ' : Address of User'}
                      </div>

                      <div className="col">
                        <strong>Ignition</strong>
                        {` : ${individualSalesMan?.attributes?.ignition ? 'On' : 'Off'}`}
                      </div>
                      <div className="col">
                        <strong>Speed</strong>
                        {` : ${Math.round(individualSalesMan?.speed)} kmph`}
                      </div>
                      <div className="col">
                        <strong>Latitude</strong>
                        {` : ${individualSalesMan?.latitude}`}
                      </div>
                      <div className="col">
                        <strong>Longitude</strong>
                        {` : ${individualSalesMan?.longitude}`}
                      </div>
                      <div className="col">
                        <strong>Category</strong>
                        {` : ${category}`}
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </Draggable>
              {individualSalesMan && (
                <ReactLeafletDriftMarker
                  position={[individualSalesMan.latitude, individualSalesMan.longitude]}
                  icon={getVehicleIcon(individualSalesMan, category)}
                  duration={2000}
                >
                  <Popup>
                    A pretty marker.
                    <br /> Easily customizable.
                  </Popup>
                </ReactLeafletDriftMarker>
              )}
              {/* Draw polyline based on path */}
              <Polyline positions={path} color="blue" />
              <MapController
                individualSalesMan={individualSalesMan}
                previousPosition={previousPosition.current}
                setPath={setPath}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  )
}

export default IndividualTrack
