import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-cluster'

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
import useGetVehicleIcon from '../Reports/HistoryReport/useGetVehicleIcon'

const FlyToMapCenter = ({ mapCenter }) => {
  const map = useMap()

  useEffect(() => {
    if (mapCenter) {
      map.setView([mapCenter?.lat, mapCenter?.lng], mapCenter.zoom) // Fly to new coordinates
    }
  }, [mapCenter, map])

  return null
}

const MainMap = ({ filteredVehicles, mapCenter, markerRefs }) => {
  const { newAddress } = useSelector((state) => state.address)
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const handleClickOnTrack = (vehicle) => {
    console.log('trcak clicked')
    navigate(`/salesman/${vehicle.deviceId}/${vehicle.category}/${vehicle.name}`)
  }
  const handleClickOnHistoryTrack = (vehicle) => {
    console.log('trcak clicked')
    navigate(`/history/${vehicle.deviceId}/${vehicle.category}/${vehicle.name}`)
  }

  useEffect(() => {
    console.log('filtered vehicle', filteredVehicles)
  }, [filteredVehicles])

  useEffect(() => {
    console.log('filtered vehicle', filteredVehicles)
  }, [filteredVehicles])

  const iconImage = (category, item) => useGetVehicleIcon(item, category)
  return (
    <MapContainer
      center={[21.1458, 79.0882]} // Center map on a default location (e.g., Nagpur)
      zoom={10}
      scrollWheelZoom={true}
      style={{
        height: '550px',
        width: '100%',
        borderRadius: '15px',
        border: '2px solid gray',
        zIndex: '0',
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; Credence Tracker, HB Gadget Solutions Nagpur"
      />
      <FlyToMapCenter mapCenter={mapCenter} />
      <MarkerClusterGroup chunkedLoading>
        {filteredVehicles?.map((vehicle, index) => {
          return (
            <Marker
              key={index}
              position={[vehicle.latitude, vehicle.longitude]}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[index] = ref // Save reference by vehicle.id
                  // console.log('maker id', index)
                }
              }}
              icon={iconImage(vehicle.category, vehicle)}
            >
              <Popup>
                <div className="toolTip">
                  <span style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                    <strong> {vehicle.name}</strong>
                  </span>
                  <hr
                    style={{
                      width: '100%',
                      height: '3px',
                      marginBottom: '0px',
                      marginTop: '5px',
                      borderRadius: '5px',
                      backgroundColor: '#000',
                    }}
                  />
                  <div className="toolTipContent">
                  <div>
                      <strong>
                        <RxLapTimer size={17} color="#FF7A00" />
                      </strong>{' '}
                      {dayjs(vehicle.lastUpdate).format('YYYY-MM-DD HH:mm')}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <strong>
                          <IoMdSpeedometer size={17} color="#FF7A00" />
                        </strong>{' '}
                        {vehicle.speed.toFixed(2)} km/h{' '}
                      </div>
                    </div>
                    <div>
                      <strong>
                        <HiOutlineStatusOnline size={17} color="#FF7A00" />
                      </strong>{' '}
                      {(() => {
                        const sp = vehicle.speed
                        const ig = vehicle.attributes.ignition
                        if (sp < 1 && ig == false) {
                          return 'Stoped'
                        }
                        if (sp < 2 && ig == false) {
                          return 'Idle'
                        }
                        if (sp > 2 && sp < 60 && ig == true) {
                          return 'Running'
                        }
                        if (sp > 60 && ig == true) {
                          return 'Over Speed'
                        } else {
                          return 'Inactive'
                        }
                      })()}
                    </div>
                    <span>
                      <strong>
                        <IoLocationSharp size={17} color="#FF7A00" />
                      </strong>{' '}
                      {newAddress[vehicle.deviceId] || 'Loading...'}
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        width:'100%',
                      }}
                    >
                      <button
                        className="btn"
                        style={{
                          width: '100%',
                          color: 'white',
                          fontSize: '0.6rem',
                          backgroundColor: '#000000',
                        }}
                        onClick={() => handleClickOnTrack(vehicle)}
                      >
                        Live Track
                      </button>
                      <button
                        className="btn"
                        style={{
                          width: '100%',
                          color: 'white',
                          fontSize: '0.6rem',
                          backgroundColor: '#000000',
                        }}
                        onClick={() => handleClickOnHistoryTrack(vehicle)}
                      >
                        History
                      </button>
                    </div>
                  </div>
                  {/* <strong></strong> {device.lastUpdate} km/h */}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MarkerClusterGroup>
    </MapContainer>
  )
}

export default MainMap
