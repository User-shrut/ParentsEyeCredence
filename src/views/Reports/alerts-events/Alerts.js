// ##################################### New Alerts With address ################################################### //

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CFormLabel,
  CTableRow,
} from '@coreui/react'
import Select from 'react-select'
import {
  Paper,
  TableContainer,
  IconButton,
  InputBase,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import CIcon from '@coreui/icons-react'
import { cilSettings } from '@coreui/icons'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
// import '../../../utils.css'
import SearchIcon from '@mui/icons-material/Search'
import { useParams } from 'react-router-dom'

const Alerts = () => {
  const { deviceId: urlDeviceId, category, name } = useParams() // Retrieve params from URL
  const [deviceId, setDeviceId] = useState(urlDeviceId || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [notificationIDs, setNotificationIDs] = useState()
  const [filteredData, setFilteredData] = useState([])
  const [devices, setDevices] = useState([])
  const [filterDevice, setFilterDevice] = useState('') // State for device filter
  const [filterType, setFilterType] = useState('') // State for selected filter
  const [currentPage, setCurrentPage] = useState(1) // Current page number
  const [rowsPerPage, setRowsPerPage] = useState(20) // Rows per page
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const accessToken = Cookies.get('authToken')
  const [selectedD, setSelectedD] = useState()

  const notificationTypes = [
    'deviceMoving',
    'ignitionOn',
    'ignitionOff',
    'deviceStopped',
    'geofenceExited',
    'geofenceEntered',
    'speedLimitExceeded',
    'statusOnline',
    'statusOffline',
    'statusUnknown',
    'deviceActive',
    'deviceInactive',
    'fuelDrop',
    'fuelIncrease',
    'alarm',
    'maintenanceRequired',
  ]

  const getDevices = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/device`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const newApiData = response.data.devices
      const deviceNames = newApiData.map((device) => device.name)
      setDevices(deviceNames)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  // Transform devices to the format react-select expects
  const deviceOptions = devices.map((device) => ({
    value: device,
    label: device,
  }))

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
    getDevices()
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
            const address = await getAddressFromLatLng(alert.location[1], alert.location[0])
            return { ...alert, address } // Append address to the alert
          }),
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
    // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`

    try {
      const response = await axios.get(url)
      const address = response.data?.display_name || 'Address not found'
      return address
    } catch (error) {
      console.error('Error fetching address: ', error)
      return 'Address not found'
    }
  }

  // Filter data whenever filterType or searchQuery changes
  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        (!filterType || item.type === filterType) &&
        (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.message?.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setFilteredData(filtered)
  }, [filterType, searchQuery, data])

  //  Download pdf file

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Alerts/Events', 10, 10)

    const tableData = filteredData.map((item, index) => [
      index + 1,
      item.name,
      item.type,
      item.address || 'Fetching...',
      item.message,
      new Date(item.createdAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    ])

    doc.autoTable({
      head: [['SN', 'Device Name', 'Notification', 'Location', 'Message', 'Time']],
      body: tableData,
      styles: {
        lineWidth: 0.5, // Border thickness
        lineColor: [0, 0, 0], // Black border color
      },
      tableLineWidth: 0.5, // Border around the table
      tableLineColor: [0, 0, 0], // Table border color
    })

    doc.save('alerts.pdf')
  }

  // Download Excel file

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        SN: index + 1,
        'Device Name': item.name,
        Notification: item.type,
        Location: item.address || 'Fetching...',
        Message: item.message,
        Time: new Date(item.createdAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alerts')
    XLSX.writeFile(workbook, 'alerts.xlsx')
  }

  // pagination

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }
  // Handle change of rows per page
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1) // Reset to first page when changing rows per page
  }

  const handleDeviceChange = (selectedOption) => {
    setDeviceId(selectedOption ? selectedOption.value : '')
    setFilterDevice(selectedOption)
  }

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  console.log(devices)

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <div className="d-flex justify-content-between mb-2">
        <div>{/* <h2>Alerts/Events</h2> */}</div>
      </div>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Alerts and Events</strong>
              <div className="d-flex gap-3" style={{ width: '100%', maxWidth: '800px' }}>
                {/** Devices Dropdown */}
                {/* <Autocomplete
                  value={filterDevice}
                  onChange={(e, newValue) => setFilterDevice(newValue)}
                  options={devices}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Device"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={15} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      style={{
                        width: '250px',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        color: 'black',
                      }}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                  disableClearable
                /> */}

                <div style={{ width: '500px' }}>
                  <Select
                    id="device-select"
                    value={deviceOptions.find((device) => device.value === deviceId)}
                    onChange={handleDeviceChange}
                    options={deviceOptions}
                    placeholder="Select a Device"
                    style={{ height: '40px' }}
                  />
                </div>

                {/** Notification Types Dropdown */}
                <select
                  className="form-select"
                  style={{
                    width: '150px',
                    borderRadius: '4px',
                    height: '40px',
                  }}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {notificationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {/** Rows Per Page Dropdown */}
                <select
                  className="form-select"
                  style={{
                    width: '200px',
                    borderRadius: '4px',
                    height: '40px',
                  }}
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={200}>200 rows</option>
                  <option value={500}>500 rows</option>
                </select>

                {/** Search Bar */}
                <div className="input-group">
                  <InputBase
                    type="search"
                    className="form-control border"
                    style={{
                      borderRadius: '4px 0 0 4px',
                      height: '40px',
                    }}
                    placeholder="Search for Device"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <IconButton
                    className="bg-white border"
                    style={{
                      borderRadius: '0 4px 4px 0',
                      borderLeft: 'none',
                      height: '40px',
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
              </div>
            </CCardHeader>

            <TableContainer
              component={Paper}
              sx={{
                height: 'auto',
                overflowX: 'auto',
                overflowY: 'auto',
                // marginBottom: '10px',
                // borderRadius: '5px',
                // border: '1px solid black',
              }}
            >
              <CCardBody>
                <CTable
                  className="mb-0 border rounded-4"
                  style={{ fontSize: '14px' }}
                  bordered
                  align="middle"
                  hover
                  responsive
                >
                  <CTableHead className="text-nowrap">
                    <CTableRow className="bg-body-tertiary">
                      <CTableHeaderCell
                        className="text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        SN
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className=" text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        Device Name
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        Notification
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        Location
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        Message
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        Date/Time
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
                    ) : paginatedData.length > 0 ? (
                      paginatedData
                        .filter((item) => {
                          const query = searchQuery.toLowerCase()
                          return (
                            item.name?.toLowerCase().includes(query) || // Filter by name
                            item.type?.toLowerCase().includes(query) || // Filter by type
                            item.address?.toLowerCase().includes(query) || // Filter by address
                            item.message?.toLowerCase().includes(query) // Filter by message
                          )
                        })
                        ?.map((item, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell
                              style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                              className="text-center ps-4"
                            >
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                              className="text-center ps-4"
                            >
                              {item.name}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                              className="text-center"
                            >
                              {item.type}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                              className="text-center"
                            >
                              {item.address || 'Fetching...'}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                              className="text-center"
                            >
                              {item.message}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                              className="text-center pe-4"
                            >
                              {' '}
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
              </CCardBody>

              <CDropdown className="position-fixed bottom-0 end-0 m-3">
                <CDropdownToggle
                  color="secondary"
                  style={{ borderRadius: '50%', padding: '10px', height: '48px', width: '48px' }}
                >
                  <CIcon icon={cilSettings} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={downloadPDF}>PDF</CDropdownItem>
                  <CDropdownItem onClick={downloadExcel}>Excel</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </TableContainer>
          </CCard>
        </CCol>
      </CRow>

      {/* Pagination */}
      <div className="d-flex flex-column justify-content-between mt-1 mb-4">
        {/* Top: Page Navigation Buttons */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="d-flex align-items-center">
            {/* First Button */}
            <button
              onClick={() => handlePageChange(1)} // Go to the first page
              disabled={currentPage === 1}
              className="btn btn-sm btn-outline-secondary mx-1"
            >
              First
            </button>
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-sm btn-outline-secondary mx-1"
            >
              Prev
            </button>
            {/* Current Page */}
            <p className="mb-0 mx-2">{currentPage}</p>
            {/* Next Button */}
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-outline-secondary mx-1"
            >
              Next
            </button>
            {/* Last Button */}
            <button
              onClick={() => handlePageChange(totalPages)} // Go to the last page
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-outline-secondary mx-1"
            >
              Last
            </button>
          </div>
        </div>

        {/* Bottom: Showing Entries */}
        <div className="d-flex justify-content-center align-items-center ">
          <div>
            <p className="mb-0">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
              {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}{' '}
              entries
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts
