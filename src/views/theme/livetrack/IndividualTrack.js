import React, { useContext, useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import axios from 'axios'
import useVehicleTracker from './useVehicleTracker'
import { useParams } from 'react-router-dom'
import location from 'src/assets/location.png'
import { duration } from 'dayjs' // Importing all vehicle icons

import ReactLeafletDriftMarker from 'react-leaflet-drift-marker'
import './IndividualTrack.css'
import Draggable from 'react-draggable'

import '../../Reports/style/remove-gutter.css'
import useGetVehicleIcon from '../../Reports/HistoryReport/useGetVehicleIcon'
import useVehicleImage from '../../Reports/HistoryReport/useVehicleImage'

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
  const [address, setAddress] = useState(null)
  const previousPosition = useRef(null) // Ref to store the previous position
  const [path, setPath] = useState([]) // State for polyline path

  useEffect(() => {
    if (vehicleData) {
      setIndividualSalesMan(vehicleData[0])
      console.log(vehicleData[0])
    }
  }, [vehicleData])

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const apiKey = 'DG2zGt0KduHmgSi2kifd' // Replace with your actual MapTiler API key
        const response = await axios.get(
          `https://api.maptiler.com/geocoding/${individualSalesMan?.longitude},${individualSalesMan?.latitude}.json?key=${apiKey}`,
        )
        if (response.data.features.length <= 5) {
          setAddress(response.data.features[0].place_name_en)
        } else {
          setAddress(response.data.features[1].place_name_en)
        }
        // console.log(response.data)
      } catch (error) {
        console.error('Error fetching the address:', error)
        setAddress('Error fetching address')
      }
    }

    if (individualSalesMan?.latitude && individualSalesMan?.longitude) {
      fetchAddress()
    }
  }, [individualSalesMan])

  const iconImage = (item, category) => useGetVehicleIcon(item, category)
  const vehicleImage = (category, item) => useVehicleImage(category, item)

  return (
    <>
      <div className="row gutter-0">
        <div className="col-12 position-relative">
          <div className="individualMap position-relative border border-5 ">
            <MapContainer
              center={[21.1458, 79.0882]} // Default center in case data isn't available
              zoom={13}
              style={{
                height: '87vh',
                marginTop: '7px',
                border: '1px solid black',
                borderRadius: '5px',
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; Credence Tracker, HB Gadget Solutions Nagpur"
              />

              <Draggable bounds="parent">
                <CCard className="mb-4 parametersContainer shadow" style={{ zIndex: '555' }}>
                  <CCardBody>
                    <div className="row">
                      <div className="col-7 mt-3">
                        <h6 className="fw-bold text-decoration-underline">
                          {name ? name : 'User Name'}
                        </h6>
                        <p>{address ? `${address}` : 'Address of User'}</p>
                      </div>
                      <div className="col-5">
                        <img
                          src={vehicleImage(category, individualSalesMan)}
                          className="nimg "
                          alt="vehicle"
                        />
                      </div>
                    </div>
                    <div className="row gap-3 justify-content-center">
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${individualSalesMan?.attributes?.ignition ? 'On' : 'Off'}`}</strong>
                        <br />
                        <p className="p-0 m-0">Ignition</p>
                      </div>
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${Math.round(individualSalesMan?.speed)}`}</strong>
                        <small> km/h</small>
                        <br />
                        <p className="p-0 m-0">Speed</p>
                      </div>
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${Math.round(individualSalesMan?.attributes?.distance)}`}</strong>
                        <small> M</small>
                        <br />
                        <p className="p-0 m-0">Distance</p>
                      </div>
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${individualSalesMan?.attributes?.motion ? 'Yes' : 'No'}`}</strong>
                        <br />
                        <p className="p-0 m-0">Moving</p>
                      </div>
                      <div className="col-2 text-center attribute shadow">
                        <strong>{`${category}`}</strong>
                        <br />
                        <p className="p-0 m-0">
                          <small>Category</small>
                        </p>
                      </div>
                    </div>
                    {/* <div className="name">
                      <div>
                        <h6>{name ? name : 'User Name'}</h6>
                        <p>{address ? `${address}` : 'Address of User'}</p>
                      </div>
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
                    </div>

                    <div className="parameters">
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
                    </div> */}
                  </CCardBody>
                </CCard>
              </Draggable>
              {individualSalesMan && (
                <ReactLeafletDriftMarker
                  position={[individualSalesMan.latitude, individualSalesMan.longitude]}
                  icon={iconImage(individualSalesMan, category)}
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
