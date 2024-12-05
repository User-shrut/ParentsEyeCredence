
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Paper, TableContainer } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const GeofenceReports = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [notificationIDs, setNotificationIDs] = useState()
  const accessToken = Cookies.get('authToken')

  const fetchNotificationData = async (page = 1) => {
    setLoading(true)
    const url = `${import.meta.env.VITE_API_URL}/notifications?page=${page}&limit=1000`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data) {
        const deviceIds = response.data.notifications.map(
          (notification) => notification.deviceId.deviceId,
        )
        setNotificationIDs(deviceIds)
        getAlerts(deviceIds)
        console.log(deviceIds)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  useEffect(() => {
    fetchNotificationData()
  }, [])

  const getAlerts = async (deviceIds) => {
    const url = `${import.meta.env.VITE_API_URL}/alerts?deviceIds=${deviceIds}&limit=1000&types=`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data.alerts) {
        // Fetch addresses for each alert
        const updatedData = await Promise.all(
          response.data.alerts.map(async (alert) => {
            const address = await getAddressFromLatLng(
              alert.location[1],
              alert.location[0]
            )
            return { ...alert, address } // Append address to the alert
          })
        )
        setData(updatedData)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  // Function to get address from latitude and longitude
  const getAddressFromLatLng = async (latitude, longitude) => {
    // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
  
    try {
      const response = await axios.get(url);
      const address = response.data?.display_name || 'Address not found';
      return address;
    } catch (error) {
      console.error('Error fetching address: ', error);
      return 'Address not found';
    }
  };
  
  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Geofences Reports</h2>
        </div>

        <div className="d-flex">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mb-2 d-md-none">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{
          height: 'auto',
          overflowX: 'auto',
          overflowY: 'auto',
          marginBottom: '10px',
          borderRadius: '10px',
          border: '1px solid black'
        }}
      >
        <CTable style={{ fontFamily: "Roboto, sans-serif", fontSize: '14px', }} bordered align="middle" className="mb-2 border min-vh-25 rounded-top-3" hover responsive >
          <CTableHead className="text-nowrap">
            <CTableRow className="bg-body-tertiary">
              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                SN
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                Device Name
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                Notification
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                Geofence Name
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                Message
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                Time
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
                  <div className="text-nowrap mb-2 text-center w-">
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-12" />
                    </p>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-12" />
                    </p>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-12" />
                    </p>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-12" />
                    </p>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ) : data.length > 0 ? (
              data
                .filter(
                  (item) =>
                    item.type === 'geofenceEntered' || item.type === 'geofenceExited'
                ) // Only include geofence alerts
                .filter((item) => {
                  const query = searchQuery.toLowerCase();
                  return (
                    item.name?.toLowerCase().includes(query) || // Filter by name
                    item.type?.toLowerCase().includes(query) || // Filter by type
                    item.address?.toLowerCase().includes(query) || // Filter by address
                    item.message?.toLowerCase().includes(query) // Filter by message
                  );
                })
                ?.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                      }}
                      className="text-center ps-4"
                    >
                      {index + 1}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                      }}
                      className="text-center ps-4"
                    >
                      {item.name}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                      }}
                      className="text-center"
                    >
                      {item.type}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                      }}
                      className="text-center"
                    >
                      {item.address || 'Fetching...'}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                      }}
                      className="text-center"
                    >
                      {item.message}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                      }}
                      className="text-center pe-4"
                    >
                      {new Date(item.createdAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour12: false, // Use 24-hour format
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </CTableDataCell>
                  </CTableRow>
                ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: '200px' }}
                  >
                    <p className="mb-0 fw-bold">"No Alerts are Available"</p>
                  </div>
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>

        </CTable>
      </TableContainer>
    </div>
  )
}

export default GeofenceReports
