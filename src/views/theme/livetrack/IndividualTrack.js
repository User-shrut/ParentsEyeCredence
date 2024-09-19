import React, { useContext, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import location from 'src/assets/location.png'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { GlobalContext } from '../../../Context/Context'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import axios from 'axios'

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

const MapController = ({ individualSalesMan }) => {
  const map = useMap() // Access the map instance

  useEffect(() => {
    if (individualSalesMan && map) {
      map.flyTo([individualSalesMan.latitude, individualSalesMan.longitude], 13, { duration: 2 })
    }
  }, [individualSalesMan, map])

  return null
}

const IndividualTrack = () => {
  const [individualSalesMan, setIndividualSalesMan] = useState(null)
  const { salesManList, selectedSalesMan } = useContext(GlobalContext)
  const [address, setAddress] = useState()

  useEffect(() => {
    if (salesManList && selectedSalesMan?.positionId) {
      console.log('Selected salesman:', selectedSalesMan)
      console.log('Salesman list:', salesManList)

      const foundSalesman = salesManList.find(
        (salesman) => salesman.id == selectedSalesMan.positionId,
      )

      if (foundSalesman) {
        setIndividualSalesMan(foundSalesman)
        console.log('founded salesman', foundSalesman)

        // Ensure mapRef is set before calling flyTo
        // if (map) {
        //   map.flyTo([foundSalesman.latitude, foundSalesman.longitude], 13, { duration: 2 })
        // } else {
        //   console.error('Map reference is not set.')
        // }
      } else {
        console.warn('Salesman not found.')
      }
    }
  }, [selectedSalesMan, salesManList])

  // pk.23e7282ce5839ef4196426bbd0fd0def

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/reverse.php?key=pk.23e7282ce5839ef4196426bbd0fd0def&lat=${individualSalesMan?.latitude}&lon=${individualSalesMan?.longitude}&format=json`,
        )
        if (response.data) {
          setAddress(response.data)
        } else {
          setAddress('Address not found')
        }
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
        <div className="individualMap col">
          
          <MapContainer
            center={[21.1458, 79.0882]} // Default center
            zoom={13} // Default zoom
            style={{ height: '80vh', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; RocketSales, HB Gadget Solutions Nagpur"
            />
            {individualSalesMan && (
              <Marker
                position={[individualSalesMan.latitude, individualSalesMan.longitude]}
                icon={customIcon}
              >
                <Popup>
                  A pretty marker.
                  <br /> Easily customizable.
                </Popup>
              </Marker>
            )}
            <MapController individualSalesMan={individualSalesMan} />
          </MapContainer>
        </div>
      </div>
    </>
  )
}

export default IndividualTrack
