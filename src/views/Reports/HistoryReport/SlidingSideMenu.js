import { CButton } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { FaBars } from 'react-icons/fa'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import './SlidingSideMenu.css'
import axios from 'axios'
import { MdOutlineRefresh } from 'react-icons/md'
import { FaUpload, FaDownload } from 'react-icons/fa'
import { FaRoad, FaClock } from 'react-icons/fa6'
import { GiDuration } from 'react-icons/gi'
import { IoLocationSharp } from 'react-icons/io5'
import { BiSolidShow } from 'react-icons/bi'
import { FaArrowRightLong } from 'react-icons/fa6'
import { BiHide } from "react-icons/bi";

dayjs.extend(duration)

// Format duration into days/hours/minutes/seconds
const formatDuration = (milliseconds) => {
  const d = dayjs.duration(milliseconds)
  return `${d.days()}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`
}

// Process and calculate additional data fields
const processStopData = (stopData) => {
  return stopData.map((stop, index, array) => {
    const previousStop = array[index - 1]
    const nextStop = array[index + 1]
    const arrivalTime = dayjs(stop.arrivalTime)
    const departureTime = stop.departureTime
      ? dayjs(stop.departureTime)
      : nextStop?.arrivalTime
        ? dayjs(nextStop.arrivalTime)
        : null

    const durationFromPrevious = previousStop
      ? arrivalTime.diff(dayjs(previousStop.departureTime))
      : 0

    const haltTime = departureTime ? departureTime.diff(arrivalTime) : null
    const latitude = stop.latitude
    const longitude = stop.longitude

    const obj = {
      ...stop,
      departureTime: departureTime?.toISOString() || null,
      distanceFromPrevious: previousStop ? stop.distance - previousStop.distance : 0,
      durationFromPrevious: formatDuration(durationFromPrevious),
      haltTime: haltTime ? formatDuration(haltTime) : 'N/A',
    }

    console.log('object hai yee', obj)
    return obj
  })
}

const fetchAddress = async (latitude, longitude) => {
  try {
    const apiKey = 'DG2zGt0KduHmgSi2kifd' // Replace with your geocoding API key
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`,
    )
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)
    const data = await response.json()
    return data.results[0]?.formatted_address || 'Address not found'
  } catch (error) {
    console.error('Geocoding error:', error)
    return 'Error fetching address'
  }
}

const addAddressesToData = async (data) => {
  const updatedData = await Promise.all(
    data.map(async (stop) => {
      const address = await fetchAddress(stop.latitude, stop.longitude)
      return { ...stop, address }
    }),
  )
  return updatedData
}

const SlidingSideMenu = ({
  stopData,
  mapRef,
  setIsPlaying,
  originalPositions,
  setPositions,
  trips,
  setCurrentPositionIndex,
  toggleStopages,
  showStopages,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [processedData, setProcessedData] = useState([])
  const [address, setAddress] = useState([])
  const [stopPage, setStopPage] = useState(true)
  const [tripPage, setTripPage] = useState(false)
  const [tripData, setTripData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const processAndSetData = async () => {
      const processed = processStopData(stopData?.finalDeviceDataByStopage)
      const withAddresses = await addAddressesToData(processed)
      setProcessedData(withAddresses)
    }

    if (stopData) {
      processAndSetData()
    }
  }, [stopData])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuBack = () => {
    setIsOpen(false)
  }
  const handleStopDiv = (latitude, longitude) => {
    setIsPlaying(false)
    const mapInstance = mapRef.current // Access Leaflet Map instance
    mapInstance.setView([latitude, longitude], 14) // New York coordinates
  }

  const filterPositionsByTrip = (trip) => {
    console.log('originalPositions ', originalPositions)
    const filteredPositions = originalPositions.filter((pos) => {
      const posTime = new Date(pos.createdAt).getTime()
      const tripStartTime = new Date(trip.startTime).getTime()
      const tripEndTime = new Date(trip.endTime).getTime()
      return posTime >= tripStartTime && posTime <= tripEndTime
    })

    console.log('filteredPositions ', filteredPositions)
    setPositions(filteredPositions)
    setCurrentPositionIndex(0)
  }

  const fetchAddress = async (vehicleId, longitude, latitude) => {
    try {
      const apiKey = 'DG2zGt0KduHmgSi2kifd' // Replace with your MapTiler API key
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`,
      )
      const address =
        response.data.features.length <= 5
          ? response.data.features[0]?.place_name_en || 'Address not available'
          : response.data.features[1]?.place_name_en || 'Address not available'

      setAddress((prevAddresses) => ({
        ...prevAddresses,
        [vehicleId]: address, // Update the specific vehicle's address
      }))
    } catch (error) {
      console.error('Error fetching the address:', error)
      setAddress((prevAddresses) => ({
        ...prevAddresses,
        [vehicleId]: 'Error fetching address',
      }))
    }
  }

  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true)
      try {
        const enrichedData = await Promise.all(
          trips.map(async (trip) => {
            try {
              const startAddress = await fetchAddress(
                trip.vehicleId,
                trip.startLongitude,
                trip.startLatitude,
              )
              const endAddress = await fetchAddress(
                trip.vehicleId,
                trip.endLongitude,
                trip.endLatitude,
              )
              return {
                ...trip,
                startAddress,
                endAddress,
                duration: new Date(trip.endTime) - new Date(trip.startTime),
              }
            } catch (error) {
              console.error('Error fetching trip data:', error)
            }
          }),
        )
        setTripData(enrichedData)
      } catch (error) {
        console.error('Error processing trip data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTripData()
  }, [trips])

  const handleStopPage = () => {
    setStopPage(true)
    setTripPage(false)
  }

  const handleTripPage = () => {
    setStopPage(false) // Fixed typo here
    setTripPage(true)
  }

  const handleIntialTrip = () => {
    setPositions(originalPositions)
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        style={{
          position: 'absolute',
          top: '20px',
          right: '0px',
          zIndex: 1000,
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          fontSize: '21px',
          cursor: 'pointer',
          opacity: isOpen ? '0' : '1',
          pointerEvents: isOpen ? 'none' : 'all',
          transition: 'right 0.3s ease-in-out, opacity 0.3s ease-in-out',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
        }}
      >
        <FaBars />
      </button>

      {/* Sliding Menu */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: isOpen ? '0' : '-350px', // Smooth sliding effect
          height: '70%',
          width: '300px',
          backgroundColor: '#f8f9fa',
          boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
          transition: 'right 0.3s ease-in-out, opacity 0.3s ease-in-out', // Smooth transitions
          zIndex: 9999,
          overflow: 'hidden',
          opacity: isOpen ? '1' : '0', // Fades out when closing
          pointerEvents: isOpen ? 'all' : 'none', // Prevents interaction when hidden
          borderRadius: '6px',
          border: '2px solid gray',
        }}
      >
        <Scrollbars style={{ width: '100%', height: '100%' }}>
          <div
            className="control-trips"
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              fontWeight: 'bold',
              position: 'sticky',
              top: '0',
              backgroundColor: '#d9d9d9',
            }}
          >
            <CButton
              color="success"
              onClick={handleStopPage}
              className="custom-button"
              style={{
                height: '2rem',
                width: '5rem',
                padding: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem', // Optional, to align horizontally as well
              }}
            >
              Stopages
            </CButton>
            <CButton
              color="primary"
              className="custom-button"
              onClick={handleTripPage}
              style={{
                height: '2rem',
                width: '4rem',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Optional, to align horizontally as well
              }}
            >
              Trips
            </CButton>
            <CButton
              color="danger"
              onClick={handleMenuBack}
              className="custom-button"
              style={{
                height: '2rem',
                width: '4rem',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Optional, to align horizontally as well
              }}
            >
              <FaArrowRightLong />
            </CButton>
          </div>
          <div style={{ padding: '8px', marginRight: '10px', zIndex: 9999 }}>
            {stopPage ? (
              <>
                <hr
                  style={{
                    width: '95% !important',
                  }}
                />

                <div
                  style={{
                    height: '3rem',
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px', // Optional, to align horizontally as well
                  }}
                >
                  <div className="divide">
                    <div className="bolding">Total stops</div>
                    <div className="lighting">{processedData?.length ?? 0}</div>
                  </div>

                  <div className="divide">
                    <div className="bolding">Total Distance</div>
                    <div className="lighting">
                      {tripData?.reduce((total, trip) => {
                        const distance = parseFloat(trip?.distance?.split(' ')[0] || 0) // Extract and convert the distance
                        // Add to total only if distance > 1
                        return distance > 0 ? total + distance : total
                      }, 0) || 0}
                    </div>
                  </div>

                  <CButton
                    color={showStopages ? 'primary' : 'success'}
                    onClick={(e) => toggleStopages(e)}
                    className="custom-button"
                    style={{
                      height: '2rem',
                      width: '2rem',
                      padding: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '8px', // Optional, to align horizontally as well
                    }}
                  >
                    {showStopages ? <BiSolidShow /> : <BiHide />}
                  </CButton>
                </div>

                <hr
                  style={{
                    width: '95% !important',
                    marginBottom: '1rem',
                  }}
                />
                {processedData.map((stop, index) => (
                  <div
                    key={index}
                    className="custom-div"
                    style={{
                      marginBottom: '20px',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                    }}
                    onClick={() => handleStopDiv(stop?.latitude, stop?.longitude)}
                  >
                    <h5>Stop {index + 1}</h5>
                    <div className="divide">
                      <div className="bold">
                        <FaDownload />
                        &nbsp;Arrival Time:
                      </div>
                      <div className="light">
                        {dayjs(stop?.arrivalTime).format('MMMM D, YYYY h:mm A')}
                      </div>
                    </div>
                    <div className="divide">
                      <div className="bold">
                        <FaUpload />
                        &nbsp;Depart. Time:
                      </div>
                      <div className="light">
                        {dayjs(stop?.departureTime).format('MMMM D, YYYY h:mm A')}
                      </div>
                    </div>
                    <div className="divide">
                      <div className="bold">
                        {' '}
                        <FaRoad /> &nbsp;Dist. from Previous Stop:
                      </div>
                      <div className="light">{stop?.distanceFromPrevious} km</div>
                    </div>
                    <div className="divide">
                      <div className="bold">
                        {' '}
                        <FaClock />
                        &nbsp;Dur. from Previous Stop:
                      </div>
                      <div className="light">{stop?.durationFromPrevious}</div>
                    </div>
                    <div className="divide">
                      <div className="bold">
                        <GiDuration />
                        &nbsp;Halt Time:
                      </div>
                      <div className="light">{stop?.haltTime}</div>
                    </div>
                    <div className="divide">
                      <div className="bold">
                        <IoLocationSharp /> &nbsp;Address:{' '}
                      </div>
                      <div className="light">{stop?.address}</div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <hr
                  style={{
                    width: '95% !important',
                  }}
                />

                <div
                  style={{
                    height: '3rem',
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px', // Optional, to align horizontally as well
                  }}
                >
                  <div className="divide">
                    <div className="bolding">Total trips</div>
                    <div className="lighting">
                      {tripData?.filter((trip) => {
                        const distance = parseFloat(trip?.distance?.split(' ')[0] || 0)
                        return distance > 1
                      }).length || 0}
                    </div>
                  </div>

                  <div className="divide">
                    <div className="bolding">Total Distance</div>
                    <div className="lighting">
                      {tripData?.reduce((total, trip) => {
                        const distance = parseFloat(trip?.distance?.split(' ')[0] || 0) // Extract and convert the distance
                        // Add to total only if distance > 1
                        return distance > 0 ? total + distance : total
                      }, 0) || 0}
                    </div>
                  </div>

                  <CButton
                    color="danger"
                    onClick={handleIntialTrip}
                    className="custom-button"
                    style={{
                      height: '2rem',
                      width: '2rem',
                      padding: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', // Optional, to align horizontally as well
                      marginLeft: '8px',
                    }}
                  >
                    <MdOutlineRefresh />
                  </CButton>
                </div>

                <hr
                  style={{
                    width: '95% !important',
                    marginBottom: '1rem',
                  }}
                />

                {tripData
                  .filter((trip) => {
                    const distance = parseFloat(trip?.distance?.split(' ')[0])
                    return distance > 1
                  })
                  .map((trip, index) => (
                    <div
                      key={index}
                      className="custom-div"
                      style={{
                        marginBottom: '20px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                      }}
                      onClick={() => filterPositionsByTrip(trip)}
                    >

                    <h5>Trip {index + 1}</h5>
                      <div className="divide">
                        <div className="bold">Start Time:</div>
                        <div className="light">
                          {dayjs(trip?.startTime).format('MMMM D, YYYY h:mm A')}
                        </div>
                      </div>
                      <div className="divide">
                        <div className="bold">Start Address:</div>
                        <div className="light">{trip?.startAddress}</div>
                      </div>
                      <div className="divide">
                        <div className="bold">End Time:</div>
                        <div className="light">
                          {dayjs(trip?.endTime).format('MMMM D, YYYY h:mm A')}
                        </div>
                      </div>
                      <div className="divide">
                        <div className="bold">End Address:</div>
                        <div className="light">{trip?.endAddress}</div>
                      </div>
                      <div className="divide">
                        <div className="bold">Total Distance:</div>
                        <div className="light">{trip?.totalDistance}</div>
                      </div>
                      <div className="divide">
                        <div className="bold">Average Speed:</div>
                        <div className="light">
                          {(trip?.avgSpeed * 1.6).toFixed(2)}
                          km/h
                        </div>
                      </div>
                      <div className="divide">
                        <div className="bold">Duration:</div>
                        <div className="light">{formatDuration(trip?.duration)}</div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </Scrollbars>
      </div>
    </>
  )
}

export default SlidingSideMenu
