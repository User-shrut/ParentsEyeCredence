import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CFormLabel,
  CFormFeedback,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import Select from 'react-select'
import Cookies from 'js-cookie'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilSettings } from '@coreui/icons'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // For table in PDF
import * as XLSX from 'xlsx'
import upLeft from 'src/direction/up-left-arrow.gif'
import upRight from 'src/direction/up-right-arrow.gif'
import downLeft from 'src/direction/down-left-arrow.gif'
import downRight from 'src/direction/down-right-arrow.gif'
import Loader from '../../../components/Loader/Loader'
import '../style/remove-gutter.css'
// import { saveAs } from 'file-saver';
import ignitionOff from 'src/status/power-off.png'
import ignitionOn from 'src/status/power-on.png'
import '../../../utils.css'

const SearchStop = ({
  formData,
  handleInputChange,
  handleSubmit,
  users,
  groups,
  getGroups,
  devices,
  loading,
  getDevices,
  columns,
  showMap,
  setShowMap,
  handlePutName,
}) => {
  const [validated, setValidated] = useState(false)
  const [buttonText, setButtonText] = useState('SHOW NOW')
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [selectedU, setSelectedU] = useState()
  const [selectedG, setSelectedG] = useState()

  // For username show in pdf
  const [putName, setPutName] = useState('')

  useEffect(() => {
    handlePutName(putName)
  }, [putName])

  // Date conversion function to convert the given date to the desired format
  const convertToDesiredFormat = (inputDate) => {
    const date = new Date(inputDate) // Create a Date object with the given input
    // Get the timezone offset in minutes and convert to milliseconds
    const timezoneOffset = date.getTimezoneOffset() * 60000
    // Adjust the date object to local time by subtracting the offset
    const localDate = new Date(date.getTime() - timezoneOffset)
    // Convert to ISO string format and append the +00:00 offset
    const formattedDate = localDate.toISOString().replace('Z', '+00:00')
    console.log('Original Date:', date)
    console.log('Local Adjusted Date:', localDate)
    console.log('Formatted Date:', formattedDate)
    return formattedDate
  }
  // Modify the existing handleInputChange function to include the format conversion
  const handleDateChange = (field, value) => {
    const formattedDate = convertToDesiredFormat(value) // Convert the input date
    handleInputChange(field, formattedDate) // Call the input change handler
    console.log('Formatted Date:', formattedDate) // Log the formatted date
  }
  const handleFormSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      handleSubmit()
      setShowMap(true) //Show data mapping
    }
    setValidated(true)
  }
  // Function to handle dropdown item clicks
  const handleDropdownClick = (text) => {
    setButtonText(text) // Change button text based on the clicked item
    setDropdownOpen(false) // Close the dropdown after selection
    setShowMap(true) // Show the map data
  }
  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      <CCol md={2}>
        <CFormLabel htmlFor="devices">User</CFormLabel>
        <Select
          id="user"
          options={
            loading
              ? [{ value: '', label: 'Loading Users...', isDisabled: true }]
              : users?.length > 0
                ? users.map((user) => ({ value: user._id, label: user.username }))
                : [{ value: '', label: 'No Users in this Account', isDisabled: true }]
          }
          value={
            selectedU
              ? { value: selectedU, label: users.find((user) => user._id === selectedU)?.username }
              : null
          }
          onChange={(selectedOption) => {
            const selectedUser = selectedOption?.value
            setSelectedU(selectedUser)
            setPutName(selectedOption.label)
            console.log('putNameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:', putName)
            console.log('Selected userDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd:', selectedUser)
            console.log('Selected user:', selectedUser)
            getGroups(selectedUser)
          }}
          placeholder="Choose a user..."
          isLoading={loading} // Show a loading spinner while fetching users
        />
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="devices">Groups</CFormLabel>
        {/* <CFormSelect
          id="group"
          required
          value={selectedG}
          onChange={(e) => {
            const selectedGroup = e.target.value;
            setSelectedG(selectedGroup);
            console.log("Selected Group ID:", selectedGroup);
            getDevices(selectedGroup);
          }}
        >
          <option value="">Choose a group...</option>

          {loading ? (<option>Loading Groups...</option>) : (
            groups?.length > 0 ? (
              groups?.map((group) => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))
            ) : (
              <option disabled>No Groups in this User</option>
            )
          )
          }
        </CFormSelect> */}
        <Select
          id="group"
          options={
            loading
              ? [{ value: '', label: 'Loading Groups...', isDisabled: true }]
              : groups?.length > 0
                ? groups.map((group) => ({ value: group._id, label: group.name }))
                : [{ value: '', label: 'No Groups in this User', isDisabled: true }]
          }
          value={
            selectedG
              ? { value: selectedG, label: groups.find((group) => group._id === selectedG)?.name }
              : null
          }
          onChange={(selectedOption) => {
            const selectedGroup = selectedOption?.value
            setSelectedG(selectedGroup)
            console.log('Selected Group ID:', selectedGroup)
            getDevices(selectedGroup)
          }}
          placeholder="Choose a group..."
          isLoading={loading} // Show a loading spinner while fetching groups
        />

        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        {/* <CFormSelect
          id="devices"
          required
          value={formData.Devices}
          onChange={(e) => handleInputChange('Devices', e.target.value)}
        >
          <option value="">Choose a device...</option>
          {loading ? (
            <option>Loading devices...</option>
          ) : devices?.length > 0 ? (
            devices?.map((device) => (
              <option key={device.id} value={device.deviceId}>
                {device.name}
              </option>
            ))
          ) : (
            <option disabled>No Device in this Group</option>
          )}
        </CFormSelect> */}
        <Select
          id="devices"
          options={
            loading
              ? [{ value: '', label: 'Loading devices...', isDisabled: true }]
              : devices?.length > 0
                ? devices.map((device) => ({ value: device.deviceId, label: device.name }))
                : [{ value: '', label: 'No Device in this Group', isDisabled: true }]
          }
          value={
            formData.Devices
              ? {
                  value: formData.Devices,
                  label: devices.find((device) => device.deviceId === formData.Devices)?.name,
                }
              : null
          }
          onChange={(selectedOption) => handleInputChange('Devices', selectedOption?.value)}
          placeholder="Choose a device..."
          isLoading={loading} // Show a loading spinner while fetching devices
        />

        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="columns">Columns</CFormLabel>
        <Select
          isMulti
          id="columns"
          options={[
            { value: 'all', label: 'All Columns' }, // Add "All Columns" option
            ...columns.map((column) => ({ value: column, label: column })),
          ]}
          value={
            formData.Columns.length === columns.length
              ? [{ value: 'all', label: 'All Columns' }] // Show "All Columns" if all columns are selected
              : formData.Columns.map((column) => ({ value: column, label: column }))
          }
          onChange={(selectedOptions) => {
            if (selectedOptions.find((option) => option.value === 'all')) {
              // If "All Columns" is selected, select all available columns
              handleInputChange('Columns', columns)
            } else {
              // Otherwise, update formData.Columns with selected values
              handleInputChange(
                'Columns',
                selectedOptions.map((option) => option.value),
              )
            }
          }}
        />
        <CFormFeedback invalid>Please select at least one column.</CFormFeedback>
      </CCol>
      {/* Date Inputs for From Date and To Date */}
      <CCol md={2}>
        <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
        <CFormInput
          type="datetime-local"
          id="fromDate"
          value={formData.FromDate ? formData.FromDate.slice(0, 16) : ''} // Display local datetime value
          onChange={(e) => handleDateChange('FromDate', e.target.value)} // Use handleDateChange for conversion
          required
        />
        <CFormFeedback invalid>Please provide a valid from date.</CFormFeedback>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="toDate">To Date</CFormLabel>
        <CFormInput
          type="datetime-local"
          id="toDate"
          value={formData.ToDate ? formData.ToDate.slice(0, 16) : ''} // Display local datetime value
          onChange={(e) => handleDateChange('ToDate', e.target.value)} // Use handleDateChange for conversion
          required
        />
        <CFormFeedback invalid>Please provide a valid to date.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <div className="d-flex justify-content-end">
          <div className="btn-group">
            <button
              className="btn text-white"
              type="submit"
              onClick={() => handleDropdownClick('SHOW NOW')}
              style={{ backgroundColor: '#0a2d63' }}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </CCol>
    </CForm>
  )
}

const StopTable = ({
  apiData,
  selectedDeviceName,
  selectedColumns,
  statusLoading,
  selectedGroupName,
  selectedUserName,
  selectedFromDate,
  selectedToDate,
  selectedPeriod,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [locationData, setLocationData] = useState({})

  // Function to convert latitude and longitude into a location name
  const fetchLocationName = async (lat, lng, rowIndex) => {
    // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`

    try {
      const response = await axios.get(url)
      const locationName = response.data.display_name || 'Unknown Location'
      setLocationData((prevState) => ({
        ...prevState,
        [rowIndex]: locationName, // Save the location for the row
      }))
    } catch (error) {
      console.error('Error fetching location name:', error)
    }
  }

  // Fetch location for each row when apiData is loaded
  useEffect(() => {
    if (apiData?.finalDeviceDataByStopage?.length > 0) {
      apiData.finalDeviceDataByStopage.forEach((row) => {
        if (row.latitude && row.longitude) {
          fetchLocationName(row.latitude, row.longitude, row.id)
        }
      })
    }
  }, [apiData])

  // Function to generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    })

    // Add current date
    const today = new Date()
    const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getFullYear().toString().slice(-2)}`

    // Add "Credence Tracker" heading centered
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    const title = 'Credence Tracker'
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) / doc.internal.scaleFactor
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2
    doc.text(title, titleX, 15)

    // Add "Status Reports" heading below "Credence Tracker"
    doc.setFontSize(18)
    const subtitle = 'Stops Reports' // Align with the title
    const subtitleWidth =
      (doc.getStringUnitWidth(subtitle) * doc.internal.getFontSize()) / doc.internal.scaleFactor
    const subtitleX = (doc.internal.pageSize.width - subtitleWidth) / 2
    doc.text(subtitle, subtitleX, 25)

    // Add current date at the top-right corner
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${date}`, doc.internal.pageSize.width - 20, 15, { align: 'right' })

    // Add device and user details with clear styling
    const details = [
      `User Name: ${selectedUserName || 'N/A'}`,
      `Group Name: ${selectedGroupName || 'N/A'}`,
      `Vehicle Name: ${selectedDeviceName || 'N/A'}`,
      `From Date: ${selectedFromDate || 'N/A'} , To Date: ${selectedToDate || 'N/A'}`,
    ]

    let yPosition = 35
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    details.forEach((detail) => {
      doc.text(detail, 14, yPosition)
      yPosition += 8 // Adjusted spacing for better readability
    })

    // Define table columns and rows
    const tableColumn = ['SN', 'Device Name', ...selectedColumns]
    const tableRows = []

    sortedData.forEach((row, rowIndex) => {
      const tableRow = [
        rowIndex + 1,
        row.device?.name || selectedDeviceName || '--',
        ...selectedColumns.map((column) => {
          switch (column) {
            case 'Speed':
              return `${(row.speed * 3.6).toFixed(2)} km/h`
            case 'Ignition':
              return row.ignition ? 'ON' : 'OFF'
            case 'Direction':
              if (row.course < 90 && row.course > 0) return 'North East'
              if (row.course > 90 && row.course < 180) return 'North West'
              if (row.course > 180 && row.course < 270) return 'South West'
              return 'South East'
            case 'Location':
              return locationData[rowIndex] || 'Fetching location...'
            case 'Co-ordinates':
              return row.latitude && row.longitude
                ? `${row.latitude}, ${row.longitude}`
                : 'Fetching location...'
            case 'Start Time':
              return new Date(
                new Date(row.arrivalTime).setHours(
                  new Date(row.arrivalTime).getHours() - 5,
                  new Date(row.arrivalTime).getMinutes() - 30,
                ),
              ).toLocaleString([], {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            case 'End Time':
              return new Date(
                new Date(row.departureTime).setHours(
                  new Date(row.departureTime).getHours() - 5,
                  new Date(row.departureTime).getMinutes() - 30,
                ),
              ).toLocaleString([], {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            default:
              return '--'
          }
        }),
      ]
      tableRows.push(tableRow)
    })

    // Add autoTable with enhanced styling
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: yPosition + 1,
      styles: {
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [100, 100, 255], // Light blue header
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternating rows
      },
      margin: { top: 20 },
    })

    // Save the PDF with a descriptive name
    const fileName = selectedDeviceName
      ? `${selectedDeviceName.replace(/ /g, '_')}_Stops_Report_${date}.pdf`
      : 'Stops_Report_.pdf'
    doc.save(fileName)
  }

  // Function to generate and download Excel without using file-saver
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedData.map((row, rowIndex) => {
        const rowData = {
          SN: rowIndex + 1, // Serial Number
          'Device Name': row.device?.name || selectedDeviceName || '--', // Add Device Name
        }

        selectedColumns.forEach((column) => {
          if (column === 'Speed') rowData.Speed = `${(row.speed * 3.6).toFixed(2)} km/h`
          if (column === 'Ignition') rowData.Ignition = row.ignition ? 'ON' : 'OFF'
          if (column === 'Direction') {
            rowData.Direction =
              row.course < 90 && row.course > 0
                ? 'North East'
                : row.course > 90 && row.course < 180
                  ? 'North West'
                  : row.course > 180 && row.course < 270
                    ? 'South West'
                    : 'South East'
          }
          if (column === 'Location')
            rowData.Location = locationData[rowIndex] || 'Fetching location...'
          if (column === 'Start Time')
            rowData['Start Time'] = new Date(
              new Date(row.arrivalTime).setHours(
                new Date(row.arrivalTime).getHours() - 5,
                new Date(row.arrivalTime).getMinutes() - 30,
              ),
            ).toLocaleString([], {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          if (column === 'End Time')
            rowData['End Time'] = new Date(
              new Date(row.departureTime).setHours(
                new Date(row.departureTime).getHours() - 5,
                new Date(row.departureTime).getMinutes() - 30,
              ),
            ).toLocaleString([], {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
        })
        return rowData
      }),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stops')

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    // Create a Blob from the Excel data
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })

    // Create a link element, trigger download, and remove the element
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${selectedDeviceName || 'Stops_Report'}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const columnKeyMap = {
    'Start Time': 'arrivalTime',
    'End Time': 'departureTime',
    Speed: 'speed',
    Ignition: 'ignition',
    Direction: 'course',
  }

  // Handle sorting when a header is clicked
  const handleSort = (columnLabel) => {
    const columnKey = columnKeyMap[columnLabel]
    if (!columnKey) return

    let direction = 'asc'
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key: columnKey, direction })
  }

  // Sort the data based on sortConfig
  const sortedData = React.useMemo(() => {
    if (!apiData?.finalDeviceDataByStopage) return []
    const data = [...apiData.finalDeviceDataByStopage]

    if (sortConfig.key) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        switch (sortConfig.key) {
          case 'arrivalTime':
          case 'departureTime': {
            const aDate = new Date(aValue)
            const bDate = new Date(bValue)
            return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
          }
          case 'speed':
          case 'course':
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
          case 'ignition': {
            const aBool = aValue ? 1 : 0
            const bBool = bValue ? 1 : 0
            return sortConfig.direction === 'asc' ? aBool - bBool : bBool - aBool
          }
          default:
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        }
      })
    }
    return data
  }, [apiData, sortConfig])

  return (
    <>
      <CTable bordered className="custom-table">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ backgroundColor: '#0a2d63', color: 'white' }}>
              SN
            </CTableHeaderCell>
            <CTableHeaderCell style={{ backgroundColor: '#0a2d63', color: 'white' }}>
              Vehicle Name
            </CTableHeaderCell>
            {selectedColumns.map((column, index) => (
              <CTableHeaderCell
                key={index}
                style={{
                  backgroundColor: '#0a2d63',
                  color: 'white',
                  cursor: columnKeyMap[column] ? 'pointer' : 'default',
                }}
                onClick={() => handleSort(column)}
              >
                {column}
                {sortConfig.key === columnKeyMap[column] && (
                  <span> {sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {statusLoading ? (
            <CTableRow style={{ position: 'relative' }}>
              <CTableDataCell
                colSpan={selectedColumns.length + 2}
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  fontStyle: 'italic',
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px dashed #dee2e6',
                  height: '100px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Loader />
                </div>
              </CTableDataCell>
            </CTableRow>
          ) : sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <CTableRow key={row.id} className="custom-row">
                <CTableDataCell
                  style={{ backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                >
                  {rowIndex + 1}
                </CTableDataCell>
                <CTableDataCell
                  style={{ backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                >
                  {selectedDeviceName}
                </CTableDataCell>
                {/* Dynamically render table cells based on selected columns */}
                {selectedColumns.map((column, index) => (
                  <CTableDataCell
                    key={index}
                    style={{ backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                  >
                    {column === 'Speed' ? (
                      // Convert speed from m/s to km/h and format to 2 decimal places
                      // (row.speed * 3.6).toFixed(2) + ' km/h'
                      row.speed.toFixed(2) + ' km/h'
                    ) : column === 'Ignition' ? (
                      // Show 'ON' or 'OFF' based on ignition status
                      row.ignition === true ? (
                        <img
                          src={ignitionOn}
                          alt="on"
                          width="40"
                          height="40"
                          style={{ marginRight: '10px' }}
                        />
                      ) : (
                        <img
                          src={ignitionOff}
                          alt="off"
                          width="40"
                          height="40"
                          style={{ marginRight: '10px' }}
                        />
                      )
                    ) : column === 'Direction' ? (
                      // Show direction (course)
                      row.course < 90 && row.course > 0 ? (
                        <>
                          <img src={upRight} alt="North East" width="30" height="25" />
                          <span>North East</span>
                        </>
                      ) : row.course > 90 && row.course < 180 ? (
                        <>
                          <img src={upLeft} alt="North West" width="30" height="25" />
                          <span>North West</span>
                        </>
                      ) : row.course > 180 && row.course < 270 ? (
                        <>
                          <img src={downLeft} alt="South West" width="30" height="25" />
                          <span>South West</span>
                        </>
                      ) : (
                        <>
                          <img src={downRight} alt="South East" width="30" height="25" />
                          <span>South East</span>
                        </>
                      )
                    ) : column === 'Location' ? (
                      // Show location
                      locationData[rowIndex] || 'Fetching location...'
                    ) : column === 'Co-ordinates' ? (
                      // Show location
                      row.latitude && row.longitude ? (
                        `${row.latitude}, ${row.longitude}`
                      ) : (
                        'Fetching location...'
                      )
                    ) : column === 'Start Time' ? (
                      // Add 6 hours 30 minutes to arrivalTime
                      new Date(
                        new Date(row.arrivalTime).setHours(
                          new Date(row.arrivalTime).getHours() - 5,
                          new Date(row.arrivalTime).getMinutes() - 30,
                        ),
                      ).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    ) : column === 'End Time' ? (
                      // Add 6 hours 30 minutes to departureTime
                      new Date(
                        new Date(row.departureTime).setHours(
                          new Date(row.departureTime).getHours() - 5,
                          new Date(row.departureTime).getMinutes() - 30,
                        ),
                      ).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    ) : column === 'Device Name' ? (
                      // Show device name, or '--' if not available
                      row.device?.name || '--'
                    ) : (
                      '--'
                    )}
                  </CTableDataCell>
                ))}
              </CTableRow>
            ))
          ) : (
            <CTableRow key={selectedDeviceName}>
              <CTableDataCell
                colSpan={selectedColumns.length + 3}
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  padding: '16px',
                }}
              >
                No data available {selectedDeviceName}
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

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
    </>
  )
}

const Stops = () => {
  const [formData, setFormData] = useState({
    Devices: '',
    Details: '',
    Periods: '',
    FromDate: '',
    ToDate: '',
    Columns: [],
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState()
  const [groups, setGroups] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [columns] = useState([
    'Start Time',
    'Ignition',
    'Speed',
    'Direction',
    'Location',
    'Co-ordinates',
    'End Time',
  ])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [showMap, setShowMap] = useState(false) //show mapping data
  const accessToken = Cookies.get('authToken')
  const [apiData, setApiData] = useState() //data from api

  const [selectedUserName, setSelectedUserName] = useState('')
  const [putName, setPutName] = useState('')

  useEffect(() => {
    console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', putName)
  }, [putName])

  // Get the selected device name from the device list based on formData.Devices
  const selectedDevice = devices.find((device) => device.deviceId === formData.Devices)
  const selectedDeviceName = selectedDevice ? selectedDevice.name : ''

  const handlePutName = (name) => {
    setPutName(name)
    console.log('putName', putName)
  }

  const getDevices = async (selectedGroup) => {
    const accessToken = Cookies.get('authToken')
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/device/getDeviceByGroup/${selectedGroup}`,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      if (response.data.success) {
        setDevices(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setDevices([])
      setLoading(false)
      throw error // Re-throw the error for further handling if needed
    }
  }

  const selectedGroup = groups.find((group) => group.groupId === formData.Groups)
  const selectedGroupName = selectedGroup ? selectedGroup.name : ''

  const getGroups = async (selectedUser = '') => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/group/${selectedUser}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data.groupsAssigned) {
        setGroups(response.data.groupsAssigned)
        setLoading(false)
        console.log('perticular user ke groups')
      } else if (response.data.groups) {
        setGroups(response.data.groups)
        setLoading(false)
        console.log('all groups')
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  const getUser = async () => {
    setLoading(true)
    setGroups([])
    setDevices([])
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data) {
        const usersData = response.data.users // Get the users from response
        setUsers(usersData) // Update the state with users
        setLoading(false)
        console.log('Users fetched successfully.')

        // After setting the users, find the selected user based on formData.User
        const selectedUser = usersData.find((user) => user.userId === formData.User)
        const selectedUserName = selectedUser ? selectedUser.username : ''
        setSelectedUserName(selectedUserName)
        console.log('Selected User:', selectedUserName)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getUser()
    getGroups()
  }, [])

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    if (name === 'Columns') {
      setSelectedColumns(value)
    }
  }
  const handleSubmit = async () => {
    setStatusLoading(true)
    console.log(formData)
    // Convert the dates to ISO format if they're provided
    const fromDate = formData.FromDate ? new Date(formData.FromDate).toISOString() : ''
    const toDate = formData.ToDate ? new Date(formData.ToDate).toISOString() : ''
    const body = {
      deviceId: formData.Devices, // Use the device ID from the form data
      // period: formData.Periods, // Use the selected period from the form data
      FromDate: fromDate,
      ToDate: toDate,
    }
    console.log(accessToken)
    // console.log(body);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/history/device-stopage?deviceId=${body.deviceId}&from=${body.FromDate}&to=${body.ToDate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
      // console.log(response.data.deviceDataByTrips[0]);
      if (response.status == 200) {
        setApiData(response.data)
        setStatusLoading(false)
      }
      // Assuming the data returned is what you want to display in the table
      console.log('Form submitted with data:', body)
    } catch (error) {
      setStatusLoading(false)
      console.error('Error submitting form:', error)
    }
  }

  // Example of extracting values similar to `selectedGroup`
  const selectedFromDate = formData.FromDate ? new Date(formData.FromDate).toLocaleDateString() : ''
  const selectedToDate = formData.ToDate ? new Date(formData.ToDate).toLocaleDateString() : ''
  const selectedPeriod = formData.Periods || ''

  console.log('Selected From Date:', selectedFromDate)
  console.log('Selected To Date:', selectedToDate)
  console.log('Selected Period:', selectedPeriod)

  return (
    <div>
      <CRow className="pt-3 gutter-0">
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader
              className="d-flex justify-content-between align-items-center text-white"
              style={{ backgroundColor: '#0a2d63' }}
            >
              <strong>Stop Report</strong>
            </CCardHeader>
            <CCardBody>
              <SearchStop
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                users={users}
                getGroups={getGroups}
                groups={groups}
                getDevices={getDevices}
                loading={loading}
                devices={devices}
                columns={columns}
                showMap={showMap}
                setShowMap={setShowMap}
                handlePutName={handlePutName}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {showMap && (
        <CRow className="justify-content-center mt-4 gutter-0">
          <CCol xs={12} className="px-4">
            <CCard className="p-0 mb-4 shadow-sm">
              <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>All Stop List {selectedDeviceName && `for ${selectedDeviceName}`} </strong>
                {/* <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                /> */}
              </CCardHeader>
              <CCardBody>
                <StopTable
                  apiData={apiData}
                  selectedDeviceName={selectedDeviceName}
                  selectedColumns={selectedColumns}
                  statusLoading={statusLoading}
                  selectedGroupName={selectedGroupName}
                  selectedUserName={putName}
                  selectedFromDate={selectedFromDate}
                  selectedToDate={selectedToDate}
                  selectedPeriod={selectedPeriod}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </div>
  )
}
export default Stops
