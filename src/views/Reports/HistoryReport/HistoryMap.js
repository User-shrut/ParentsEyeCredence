import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import useHistoryData from './useHistoryData'
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker'
import { IoMdPause, IoMdPlay } from 'react-icons/io'
import { FaForward, FaBackward } from 'react-icons/fa'
import { CButton } from '@coreui/react'
import useStoppageTimes from './useStoppageTimes.js'
import useVehicleImage from './useVehicleImage.js'
import useGetVehicleIcon from './useGetVehicleIcon.js'
import location from '../../../assets/location.svg'
import HistoryLoader from './HistoryLoader.js'


const redIcon = L.icon({
  iconUrl: location, // Path to your custom icon (e.g., PNG or SVG)
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor point of the icon (where the marker is placed)
  popupAnchor: [0, -32], // Popup position relative to the icon
});
const HistoryMap = ({
  fromDateTime,
  toDateTime,
  deviceId,
  fetch,
  setFetch,
  historyOn,
  setHistoryOn,
  category,
  name,
}) => {
  const { data, loading } = useHistoryData(
    'http://63.142.251.13:9000/history/device-history-playback',
    { deviceId, from: fromDateTime, to: toDateTime },
    fetch,
  )
  const { data: stopData } = useHistoryData(
    'http://63.142.251.13:9000/history/device-stopage',
    { deviceId, from: fromDateTime, to: toDateTime },
    fetch,
  )
  const { data: tripData } = useHistoryData(
    'http://63.142.251.13:9000/history/show-only-device-trips-startingpoint-endingpoint',
    { deviceId, from: fromDateTime, to: toDateTime },
    fetch,
  )
  console.log('return data' + stopData)

  const [positions, setPositions] = useState([])
  const [stopages, setStopages] = useState(stopData?.finalDeviceDataByStopage || [])
  const [showStopages, setShowStopages] = useState(false)
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(10)
  const [progress, setProgress] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [trips, setTrips] = useState([])
  const [totalTrips, setTotalTrips] = useState(0)
  const [longestTrip, setLongestTrip] = useState(null)
  const [startAddress, setStartAddress] = useState('')
  const [endAddress, setEndAddress] = useState('')
  useEffect(() => {
    if (tripData?.finalTrip) {
      setTrips(tripData.finalTrip)
      setTotalTrips(tripData.finalTrip.length)
      findLongestTrip(tripData.finalTrip)
    }
  }, [tripData])

  const findLongestTrip = (tripData) => {
    if (!tripData.length) return
    let longest = tripData[0]
    for (const trip of tripData) {
      const durationInMinutes = convertDurationToMinutes(trip.duration)
      const longestDurationInMinutes = convertDurationToMinutes(longest.duration)
      if (durationInMinutes > longestDurationInMinutes) {
        longest = trip
      }
    }
    setLongestTrip(longest)
    fetchAddress(longest.startLatitude, longest.startLongitude, setStartAddress)
    fetchAddress(longest.endLatitude, longest.endLongitude, setEndAddress)
  }

  const convertDurationToMinutes = (duration) => {
    const [hours, minutes] = duration.split(/h|m/).map((item) => parseInt(item.trim()) || 0)
    return hours * 60 + minutes
  }

  const fetchAddress = async (latitude, longitude, setAddress) => {
    const apiKey = 'DG2zGt0KduHmgSi2kifd' // Replace with your MapTiler API key
    const addressUrl = `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`

    try {
      const response = await axios.get(addressUrl)
      const results = response.data?.features

      if (results && results.length > 0) {
        // Extract the relevant part for place/area and pincode
        console.log(results)
        const place = results[0]?.text || '' // Place/Area
        const pincode =
          results[0]?.context?.find((item) => item.id.startsWith('postal_code'))?.text ||
          'Unknown Pincode'

        setAddress(`${place}, ${pincode}`)
      } else {
        setAddress('Address not available')
      }
    } catch (error) {
      console.error('Error fetching address:', error)
      setAddress('Unable to fetch address')
    }
  }
  const fetchAddressStop = async (latitude, longitude) => {
    const apiKey = 'DG2zGt0KduHmgSi2kifd' // Replace with your MapTiler API key
    const addressUrl = `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`

    try {
      const response = await axios.get(addressUrl)
      const results = response.data?.features

      if (results && results.length > 0) {
        // Extract the relevant part for place/area and pincode
        console.log(results)
        const place = results[0]?.text || 'Unknown Place'
        const pincode =
          results[0]?.context?.find((item) => item.id.startsWith('postal_code'))?.text ||
          'Unknown Pincode'

        return `${place}, ${pincode}`
      } else {
        return 'Address not available'
      }
    } catch (error) {
      console.error('Error fetching address:', error)
      return 'Unable to fetch address'
    }
  }

  // Calculate haversine distance
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180
    const R = 6371 // Earth's radius in km

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in km
  }

  // Filter data using useMemo for optimization
  const filteredData = useMemo(() => {
    if (!data?.deviceHistory?.length) return []
    return data.deviceHistory.reduce((acc, current, i) => {
      if (
        i === 0 ||
        haversineDistance(
          acc[acc.length - 1].latitude,
          acc[acc.length - 1].longitude,
          current.latitude,
          current.longitude,
        ) <= 0.5
      ) {
        acc.push(current)
      }
      return acc
    }, [])
  }, [data])

  // Update positions when data changes
  useEffect(() => {
    if (filteredData.length > 0) {
      setPositions(filteredData)
      setIsPlaying(true) // Start animation as soon as data is fetched
    }
  }, [filteredData])

  useEffect(() => {
    if (stopData?.finalDeviceDataByStopage?.length > 0) {
      setStopages(stopData.finalDeviceDataByStopage)
    }
  }, [stopData])

  // Create polyline data
  const poly = useMemo(() => positions.map((item) => [item.latitude, item.longitude]), [positions])
  // console.log(poly)

  // Playback animation logic
  useEffect(() => {
    if (positions.length > 0 && isPlaying) {
      const intervalSpeed = Math.max(100, 1000 / speed) // Ensure reasonable playback speed
      const interval = setInterval(() => {
        setCurrentPositionIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % positions.length
          setProgress(((nextIndex + 1) / positions.length) * 100)
          return nextIndex
        })
      }, intervalSpeed)

      return () => clearInterval(interval)
    }
  }, [positions, isPlaying, speed])

  const handlePlayPause = () => setIsPlaying((prev) => !prev)

  const handleForward = () =>
    setCurrentPositionIndex((prevIndex) => Math.min(prevIndex + 10, positions.length - 1))

  const handleBackward = () => setCurrentPositionIndex((prevIndex) => Math.max(prevIndex - 10, 0))

  const handleZoomChange = (level) => setZoomLevel(level)

  const MapZoomController = () => {
    const map = useMap()
    const [lastPosition, setLastPosition] = useState(null)

    useEffect(() => {
      if (positions.length > 0) {
        const currentPosition = positions[currentPositionIndex]
        if (
          !lastPosition ||
          Math.abs(currentPosition.latitude - lastPosition.latitude) > 0.001 ||
          Math.abs(currentPosition.longitude - lastPosition.longitude) > 0.001
        ) {
          // Only update the view if the position has changed significantly
          map.setView([currentPosition.latitude, currentPosition.longitude], 15)
          setLastPosition(currentPosition)
        }
      }
    }, [currentPositionIndex, zoomLevel, map, positions, lastPosition])

    return null
  }

  const handleBack = (e) => {
    window.location.reload()
  }
  const toggleStopages = (e) => {
    e.preventDefault()
    if (fetch && !loading && (!stopages || stopages.length === 0))
      return alert('This vehicles has not taken any stop in this time period.')
    setShowStopages((prev) => !prev)
    console.log('These are the stopages==================' + JSON.stringify(stopages))
  }

  const arrowPositions = useMemo(() => {
    return poly.slice(1).map((pos, index) => {
      const [lat1, lon1] = poly[index]
      const [lat2, lon2] = pos

      // Calculate angle for rotation
      const angle = Math.atan2(lat2 - lat1, lon2 - lon1) * (180 / Math.PI)
      return { lat: lat2, lon: lon2, angle }
    })
  }, [poly])

  const { longestStop, shortestStop, longestDuration, shortestDuration } =
    useStoppageTimes(stopages)

  const [isDataAvailable, setIsDataAvailable] = useState(fetch && stopages.length > 0)

  useEffect(() => {
    setIsDataAvailable(fetch && stopages.length > 0)
  }, [fetch, stopages, loading])

  const [longestStopAddress, setLongestStopAddress] = useState('')
  const [shortestStopAddress, setShortestStopAddress] = useState('')

  useEffect(() => {
    const fetchAddresses = async () => {
      if (isDataAvailable) {
        const longestStopAddress = await fetchAddressStop(
          longestStop?.latitude,
          longestStop?.longitude,
        )
        setLongestStopAddress(longestStopAddress)

        const shortestStopAddress = await fetchAddressStop(
          shortestStop?.latitude,
          shortestStop?.longitude,
        )
        setShortestStopAddress(shortestStopAddress)
      }
    }

    fetchAddresses()
  }, [isDataAvailable, longestStop, shortestStop])

  const iconImage = useGetVehicleIcon(positions[currentPositionIndex], category)
  const vehicleImage = useVehicleImage(category, positions[currentPositionIndex])

  return (
    <div className="individualMap position-relative border border-5">
      {loading && <HistoryLoader />}
      <MapContainer
        center={
          filteredData && positions && currentPositionIndex
            ? [positions[currentPositionIndex].latitude, positions[currentPositionIndex].longitude]
            : [21.1458, 79.0882]
        }
        zoom={zoomLevel}
        scrollWheelZoom={true}
        style={{
          position: 'relative',
          height: '600px',
          width: '100%',
          borderRadius: '15px',
          border: '2px solid gray',
        }}
      >
        <MapZoomController />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; Credence Tracker, HB Gadget Solutions Nagpur"
        />
        {positions.length > 0 && (
          <>
            <Polyline
              positions={poly}
              color="blue"
              weight={7}
              opacity={0.6}
              arrowheads={{
                size: '15px',
                frequency: 'endonly',
                fill: true,
                color: 'white', // Arrow color set to white
              }}
            />

            <ReactLeafletDriftMarker
              position={[
                positions[currentPositionIndex].latitude,
                positions[currentPositionIndex].longitude,
              ]}
              duration={1000}
              icon={iconImage}
            >
              <Popup>
                {`Vehicle at ${positions[currentPositionIndex].latitude}, ${positions[currentPositionIndex].longitude}`}
              </Popup>
            </ReactLeafletDriftMarker>
          </>
        )}
        {showStopages &&
          stopages &&
          stopages.map((stop, index) => (
            <Marker
              key={index}
              position={[stop?.latitude, stop?.longitude]}
              icon={redIcon}
              iconAnchor={[12, 41]}
              popupAnchor={[1, -34]}
              shadowAnchor={[10, 41]}
            >
              <Popup>
                <div>
                  <p>
                    <strong>Speed:</strong> {stop?.speed}
                  </p>
                  <p>
                    <strong>Arrival Time:</strong> {new Date(stop?.arrivalTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Departure Time:</strong>{' '}
                    {stop.departureTime ? new Date(stop?.departureTime).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      {historyOn && (
        <div>
          <div className="controllers upperBox">
            <div className="info">
              <div className="head-img-info">
                <div className="info-img">
                  <img src={vehicleImage} alt="Car icon" className="vehicle" />
                </div>
                <div className="info-info">
                  <strong>{name}</strong>
                  <br />
                  <strong>
                    Ignition:{' '}
                    {fetch && positions
                      ? positions[currentPositionIndex]?.attributes?.ignition
                        ? 'On'
                        : 'Off'
                      : 'Off'}
                  </strong>
                  <br />
                  <strong>
                    Speed:{' '}
                    {fetch && positions
                      ? Math.round(positions[currentPositionIndex]?.speed * 1.6)
                      : '0'}{' '}
                    km/hr
                  </strong>
                </div>
              </div>
              <div className="trip-divi">
                <div className="divide">
                  <div className="bold">Total Trips :</div>
                  <div className="light">{totalTrips}</div>
                </div>

                <div className="divide">
                  <div className="bold">Longest Trip Duration :</div>
                  <div className="light">{longestTrip?.duration}</div>
                </div>
                <div className="divide">
                  <div className="bold">Started From :</div>
                  <div className="light">{startAddress}</div>
                </div>
                <div className="divide">
                  <div className="bold">Ended to :</div>
                  <div className="light">{endAddress}</div>
                </div>
              </div>
            </div>

            <div className="controls">
              <div className="center">
                <div className="pro">
                  <div onClick={handleBackward}>
                    <FaBackward />
                  </div>
                  <div onClick={handlePlayPause}>{isPlaying ? <IoMdPause /> : <IoMdPlay />}</div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => {
                      const newIndex = Math.floor((positions.length * e.target.value) / 100)
                      setCurrentPositionIndex(newIndex)
                      setProgress(e.target.value)
                    }}
                  />
                  <div onClick={handleForward}>
                    <FaForward />
                  </div>
                  <div className={`zoom-control ${isExpanded ? 'expanded' : ''}`}>
                    <select
                      value={speed}
                      className="speed-toggle"
                      onChange={(e) => setSpeed(Number(e.target.value))}
                    >
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                      <option value={3}>3x</option>
                    </select>
                    <button className="zoom-toggle" onClick={() => setIsExpanded(!isExpanded)}>
                      Zoom
                    </button>
                    {isExpanded && (
                      <div className="zoom-slider">
                        <input
                          type="range"
                          min="5"
                          max="20"
                          value={zoomLevel}
                          onChange={(e) => handleZoomChange(Number(e.target.value))}
                          className="slider"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="controllers" style={{ marginTop: '10px' }}>
            <div className="info-stops">
              <strong>Stop Details</strong>
              <div className="divide">
                <div className="bold">Total Stops : </div>
                <div className="light">{isDataAvailable ? stopages.length : 0}</div>
              </div>
              <div className="divide">
                <div className="bold">Longest stop :</div>
                <div className="light">{isDataAvailable ? longestStopAddress : '--'}</div>
              </div>

              <div className="divide">
                <div className="bold">Duration :</div>
                <div className="light">{isDataAvailable ? longestDuration : '--'}</div>
              </div>

              <div className="divide">
                <div className="bold">Shortest stop :</div>
                <div className="light">{isDataAvailable ? shortestStopAddress : '--'}</div>
              </div>

              <div className="divide">
                <div className="bold">Duration :</div>
                <div className="light">{isDataAvailable ? shortestDuration : '--'}</div>
              </div>
            </div>

            <CButton
              color={showStopages ? 'primary' : 'success'}
              onClick={(e) => toggleStopages(e)}
              style={{
                height: 'auto',
                width: '8rem',
                marginTop: '1rem',
                color: 'white', // Ensures text contrast
              }}
            >
              {showStopages ? 'Remove Stopages' : 'Show Stopages'}
            </CButton>
          </div>
          <CButton
            color="danger"
            onClick={handleBack}
            style={{
              height: '3rem',
              width: '8rem',
              marginTop: '1rem',
            }}
          >
            Back
          </CButton>
        </div>
      )}
    </div>
  )
}

export default HistoryMap
