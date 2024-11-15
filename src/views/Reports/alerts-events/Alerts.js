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

const Alerts = () => {
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
    const accessToken = Cookies.get('authToken')
    const url = `${import.meta.env.VITE_API_URL}/alerts?deviceIds=${deviceIds}&limit=1000&types=`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data.alerts) {
        setData(response.data.alerts)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Alerts/Events</h2>
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
          height: 'auto', // Set the desired height
          overflowX: 'auto', // Enable horizontal scrollbar
          overflowY: 'auto', // Enable vertical scrollbar if needed
          marginBottom: '10px',
          borderRadius: '10px',
          border: '1px solid black'
        }}
      >
        <CTable bordered align="middle" className="mb-0 border" hover responsive >
          <CTableHead className="text-nowrap">
            <CTableRow className="bg-body-tertiary">
              <CTableHeaderCell className=" text-center ps-4 text-white bg-secondary">
                SN 
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center text-white bg-secondary">
                Device Name
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center text-white bg-secondary">
                Notification
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center text-white bg-secondary">
                Location
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center text-white bg-secondary">
                Message
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center text-white bg-secondary">
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
              data?.map((item, index) => (
                <CTableRow key={index} >
                  <CTableDataCell style={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",}} className="text-center ps-4">{index + 1}</CTableDataCell>
                  <CTableDataCell style={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",}} className="text-center ps-4">{item.name}</CTableDataCell>
                  <CTableDataCell style={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",}} className="text-center">{item.type}</CTableDataCell>
                  <CTableDataCell style={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",}} className="text-center">show location</CTableDataCell>
                  <CTableDataCell style={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",}} className="text-center">{item.message}</CTableDataCell>
                  <CTableDataCell style={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",}} className="text-center pe-4">{`${item.createdAt.slice(0,10)} ${item.createdAt.slice(11,19)}`}</CTableDataCell>
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

export default Alerts