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
import { Pagination } from 'react-bootstrap'
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
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    // Add current date
    const today = new Date();
    const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getFullYear().toString()}`;

    // Add "Credence Tracker" heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    const title = 'Credence Tracker';
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 15);

    // Add "Alerts Reports" heading
    doc.setFontSize(16);
    const subtitle = 'Alerts Reports';
    const subtitleWidth = doc.getTextWidth(subtitle);
    const subtitleX = (pageWidth - subtitleWidth) / 2;
    doc.text(subtitle, subtitleX, 25);

    // Add current date at the top-right corner
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${date}`, pageWidth - 20, 15, { align: 'right' });

    // Section title for Alerts/Events
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Alert Details', 10, 40);

    // Additional Details (Devices name or other info)
    const details = [
      `Devices Name: ${devices || 'N/A'}`
    ];
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    details.forEach((text, idx) => {
      doc.text(text, 10, 50 + (idx * 10));
    });

    // Prepare table data
    const tableData = filteredData.map((item, index) => [
      index + 1,  // Serial number
      item.name || '--', // Device Name
      item.type || '--', // Notification Type
      item.address || 'Fetching...', // Location
      item.message || '--', // Message
      new Date(item.createdAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }), // Time
    ]);

    // Define table columns
    const tableColumns = ['SN', 'Device Name', 'Notification', 'Location', 'Message', 'Time'];

    // Set the width of the table to span across the entire page
    const tableWidth = pageWidth - 20;  // Leaving 10px padding on each side

    // Create the table in the PDF with styling
    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: 60, // Start the table just below the section title
      theme: 'grid', // Use a grid theme for the table
      headStyles: {
        fillColor: [100, 100, 255], // Blue header background
        textColor: [255, 255, 255], // White text color
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center', // Center align header text
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5, // Add padding inside cells
        valign: 'middle', // Center align vertical content
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternate rows
      },
      tableLineWidth: 0.5, // Table borders
      tableLineColor: [0, 0, 0], // Black border color for the table
      columnStyles: {
        0: { cellWidth: tableWidth * 0.05 }, // 5% width for serial number column
        1: { cellWidth: tableWidth * 0.25 }, // 25% width for the device name column
        2: { cellWidth: tableWidth * 0.20 }, // 20% for notification column
        3: { cellWidth: tableWidth * 0.20 }, // 20% for location column
        4: { cellWidth: tableWidth * 0.20 }, // 20% for message column
        5: { cellWidth: tableWidth * 0.10 }, // 10% for time column
      },
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      width: tableWidth, // Full width of the table
    });

    // Save the PDF document
    doc.save(`Alerts_Reports_${date}.pdf`);
  };



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
      <div className="mt-3 d-flex flex-column align-items-center justify-content-center">
        {/* Top: Page Navigation Buttons */}
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          />

          {/* Add "First" and ellipsis if current page is far from the first page */}
          {currentPage > 3 && (
            <>
              <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
              {currentPage > 4 && <Pagination.Ellipsis disabled />}
            </>
          )}

          {/* Display pages around the current page */}
          {Array.from({ length: 5 }, (_, i) => {
            const page = currentPage - 2 + i
            if (page > 0 && page <= totalPages) {
              return (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </Pagination.Item>
              )
            }
            return null
          })}

          {/* Add ellipsis and "Last" if current page is far from the last page */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <Pagination.Ellipsis disabled />}
              <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </Pagination.Item>
            </>
          )}

          <Pagination.Next
            onClick={() => handlePageChange((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          />
        </Pagination>

        {/* Bottom: Showing Entries */}
        <div className="d-flex justify-content-center align-items-center ">
          <div>
            <p className="mb-3">
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
