import React, { useEffect, useState } from 'react'
import {
  CButton,
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
  CTooltip,
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
import * as XLSX from 'xlsx' // For Excel export
import jsPDF from 'jspdf' // For PDF export
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import { auto } from '@popperjs/core'
import Loader from '../../../components/Loader/Loader'
import '../style/remove-gutter.css'
import '../../../utils.css'
import { IoSearchSharp } from 'react-icons/io5'
import { IconButton, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const SearchGeofence = ({
  formData,
  handleInputChange,
  handleSubmit,
  users,
  getGroups,
  groups,
  devices,
  loading,
  getDevices,
  setShowMap,
  handlePutName,
}) => {
  const [validated, setValidated] = useState(false)
  const [showDateInputs, setShowDateInputs] = useState(false) // State to manage button text
  const [buttonText, setButtonText] = useState('SHOW NOW')
  const [isDropdownOpen, setDropdownOpen] = useState(false) // State to manage dropdown visibility
  const [selectedU, setSelectedU] = useState()
  const [selectedG, setSelectedG] = useState()

  // For username show in pdf
  const [putName, setPutName] = useState('')

  useEffect(() => {
    handlePutName(putName)
  }, [putName])

  const allDevicesOption = { value: 'all', label: 'All Devices' } // Define an option for "All Devices"

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
    console.log('handle submit ke pass hu')
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      handleSubmit()
      setShowMap(true) // Show the map
    }
    setValidated(true)
  }

  const handlePeriodChange = (value) => {
    handleInputChange('Periods', value)
    setShowDateInputs(value === 'Custom')
  }

  // Function to handle dropdown item clicks
  const handleDropdownClick = (text) => {
    setButtonText(text) // Change button text based on the clicked item
    setDropdownOpen(false) // Close the dropdown after selection
    handleSubmit() // Submit form
    setShowMap(true) // Show the map when form is valid and submitted
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
      <CCol md={3}>
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
            console.log('Selected user:', selectedUser)
            getGroups(selectedUser)
          }}
          isLoading={loading} // Optionally show a loading spinner
          placeholder="Choose a user..."
        />
        <CFormFeedback invalid>Please provide a valid user.</CFormFeedback>
      </CCol>

      <CCol md={2}>
        <CFormLabel htmlFor="devices">Groups</CFormLabel>
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
          isLoading={loading} // Optionally show a loading spinner
          placeholder="Choose a group..."
        />

        <CFormFeedback invalid>Please provide a valid group.</CFormFeedback>
      </CCol>

      <CCol md={3}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        <Select
          id="devices"
          isMulti
          options={[
            allDevicesOption,
            ...devices.map((device) => ({ value: device.deviceId, label: device.name })),
          ]}
          onChange={(selectedOptions) => {
            // Step 2: Check if "All Devices" is selected
            if (selectedOptions.some((option) => option.value === 'all')) {
              // If "All Devices" is selected, select all device IDs
              const allDeviceIds = devices.map((device) => device.deviceId)
              handleInputChange('Devices', allDeviceIds) // Store all device IDs
            } else {
              // Otherwise, store the selected device IDs
              const selectedDeviceIds = selectedOptions.map((option) => option.value)
              handleInputChange('Devices', selectedDeviceIds)
            }
          }}
          placeholder="Choose devices..."
          isClearable={true}
        />
        <CFormFeedback invalid>Please provide valid devices.</CFormFeedback>
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
              style={{ backgroundColor: '#0a2d63' }}
              type="submit"
              onClick={() => handleDropdownClick('SHOW NOW')}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </CCol>
    </CForm>
  )
}

const ShowGeofence = ({
  statusLoading,
  apiData,
  selectedColumns,
  columns,
  devices,
  searchQuery,
  selectedDeviceName,
  selectedGroupName,
  selectedUserName,
  selectedFromDate,
  selectedToDate,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [addressCache, setAddressCache] = useState({}) // Cache addresses to avoid multiple API calls

  console.log('devicessssssssssasdadwssss', devices) // Devices list

  // if (!apiData) return <><Loader></>; // Show loading state
  // if (!Array.isArray(apiData) || apiData.length === 0) return <div>No Data Available</div>;

  const renderColumnData = (data, column) => {
    switch (column) {
      case 'Name':
        return data.name
      case 'Type':
        return data.type
      case 'Message':
        return data.message
      case 'Location':
        const [lat, lng] = data.location || []
        if (!lat || !lng) return 'Coordinates not available'

        const key = `${lat},${lng}`
        if (addressCache[key]) {
          return addressCache[key] // Return cached address
        }

        // Fetch address asynchronously and update cache
        getAddressFromLatLng(lat, lng).then((address) => {
          setAddressCache((prev) => ({ ...prev, [key]: address }))
        })

        return 'Fetching address...' // Temporary placeholder
      case 'Created At':
        return new Date(data.createdAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false, // Use 24-hour format
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      default:
        return '-'
    }
  }

  // Address convertor

  const getAddressFromLatLng = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`

    try {
      const response = await axios.get(url)
      const address = response.data?.display_name || 'Address not found'
      return address
    } catch (error) {
      console.error('Error fetching address: ', error.message)
      return 'Address not found'
    }
  }

  // ###################

  const findDeviceName = (deviceId) => {
    const device = devices.find((d) => d.deviceId === deviceId.toString())
    return device ? device.name : 'Unknown Device'
  }

  // Search vehicle in result portion for fillteraion

  const filteredData = (Array.isArray(apiData) ? apiData : []).filter((data) => {
    // Loop through each column in selectedColumns (or use default columns if no selected columns)
    return (selectedColumns.length > 0 ? selectedColumns : columns).some((col) => {
      // Get the value of the current column for this row
      const cellValue = renderColumnData(data, col).toString().toLowerCase()

      // Check if the cell value contains the search query (case-insensitive)
      return cellValue.includes(searchQuery.toLowerCase())
    })
  })

  // Column to data key mapping
  const columnKeyMap = {
    Name: 'name',
    Type: 'type',
    Message: 'message',
    Location: 'location',
    'Created At': 'createdAt',
  }

  // Sorting handler
  const handleSort = (columnLabel) => {
    const sortKey = columnKeyMap[columnLabel]
    if (!sortKey) return

    let direction = 'asc'
    if (sortConfig.key === sortKey && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key: sortKey, direction })
  }

  // Sorted data
  const sortedData = React.useMemo(() => {
    if (!filteredData) return []
    const data = [...filteredData]

    if (sortConfig.key) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        // Handle date sorting
        if (sortConfig.key === 'createdAt') {
          return sortConfig.direction === 'asc'
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue)
        }

        // Handle string sorting
        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return 0
      })
    }
    return data
  }, [filteredData, sortConfig])

  // Export table data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    })

    // Add current date
    const today = new Date()
    const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getFullYear().toString()}`

    // Add "Credence Tracker" heading
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    const title = 'Credence Tracker'
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) / doc.internal.scaleFactor
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2
    doc.text(title, titleX, 15)

    // Add "Status Reports" subtitle
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    const subtitle = 'Geofences Reports'
    const subtitleWidth =
      (doc.getStringUnitWidth(subtitle) * doc.internal.getFontSize()) / doc.internal.scaleFactor
    const subtitleX = (doc.internal.pageSize.width - subtitleWidth) / 2
    doc.text(subtitle, subtitleX, 25)

    // Add current date at the top-right corner
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${date}`, doc.internal.pageSize.width - 20, 15, { align: 'right' })

    // Add user and device details
    const details = [
      `User Name: ${selectedUserName || '--'}`,
      `Group Name: ${selectedGroupName || '--'}`,
      `Vehicle Name: ${devices.map((device) => device.name) || '--'}`,
      `From Date: ${selectedFromDate || 'N/A'} , To Date: ${selectedToDate || 'N/A'}`,
    ]

    let yPosition = 35
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    details.forEach((detail) => {
      doc.text(detail, 14, yPosition)
      yPosition += 8 // Spacing between lines
    })

    // Define table columns and rows
    const tableColumns = ['SN', ...(selectedColumns.length > 0 ? selectedColumns : columns)] // Include 'SN' column
    const tableRows = sortedData.map((data, index) => {
      const serialNumber = index + 1 // Serial number starting from 1
      const rowData = tableColumns.slice(1).map((col) => renderColumnData(data, col)) // Map data for other columns
      return [serialNumber, ...rowData] // Add SN as the first column in each row
    })

    // Generate the table with enhanced styling
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: yPosition + 1, // Start below details section
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
        fillColor: [240, 240, 240], // Light gray rows
      },
      tableLineWidth: 0.5, // Table border thickness
      tableLineColor: [0, 0, 0], // Table border color
      margin: { top: 10 }, // Adjust table margin
    })

    // Save the PDF with a descriptive name
    doc.save(`Geofences_Reports_${date}.pdf`)
  }

  // Export table data to Excel
  const exportToExcel = () => {
    const tableColumns = selectedColumns.length > 0 ? selectedColumns : columns
    const tableRows = sortedData.map((data, index) => {
      return tableColumns.map((col) => renderColumnData(data, col))
    })

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet([tableColumns, ...tableRows])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data')

    // Export to Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'Geofences.xlsx')
  }
  return (
    <>
      <CTable bordered className="custom-table" style={{ overflowX: 'auto' }}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ backgroundColor: '#0a2d63', color: 'white' }}>
              SN
            </CTableHeaderCell>
            {(selectedColumns.length > 0 ? selectedColumns : columns).map((col, index) => (
              <CTableHeaderCell
                key={index}
                style={{
                  backgroundColor: '#0a2d63',
                  color: 'white',
                  cursor: 'pointer',
                }}
                onClick={() => handleSort(col)}
              >
                {col}
                {sortConfig.key === columnKeyMap[col] && (
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
                colSpan={selectedColumns.length + 6}
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
            sortedData.map((data, index) => (
              <CTableRow key={index}>
                <CTableDataCell
                  style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                >
                  {index + 1}
                </CTableDataCell>
                {selectedColumns.length > 0
                  ? selectedColumns.map((col, colIndex) => (
                      <CTableDataCell
                        key={colIndex}
                        style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                      >
                        {renderColumnData(data, col)}
                      </CTableDataCell>
                    ))
                  : columns.map((col, colIndex) => (
                      <CTableDataCell
                        key={colIndex}
                        style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                      >
                        {renderColumnData(data, col)}
                      </CTableDataCell>
                    ))}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={selectedColumns.length + 6}
                style={{
                  backgroundColor: '#f8f9fa', // Light gray background
                  color: '#6c757d', // Darker text color
                  fontStyle: 'italic', // Italic font style
                  padding: '16px', // Extra padding for emphasis
                  textAlign: 'center', // Center the text
                  border: '1px dashed #dee2e6', // Dashed border to highlight it
                }}
              >
                No data available
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
          <CDropdownItem onClick={exportToPDF}>PDF</CDropdownItem>
          <CDropdownItem onClick={exportToExcel}>Excel</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

const GeofenceReports = () => {
  const [formData, setFormData] = useState({
    Devices: [],
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
  const [showMap, setShowMap] = useState(false)

  const [columns] = useState(['Name', 'Type', 'Message', 'Location', 'Created At'])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [apiData, setApiData] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)

  const accessToken = Cookies.get('authToken')
  const token = Cookies.get('authToken')

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
          headers: { Authorization: `Bearer ${accessToken}` },
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
        headers: { Authorization: `Bearer ${accessToken}` },
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

      // After setting groups, find the selected group
      const selectedGroup = groups.find((group) => group.groupId === formData.Groups)
      const selectedGroupName = selectedGroup ? selectedGroup.name : ''
      console.log('Selected Group:', selectedGroupName)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  const getUser = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (response.data) {
        setUsers(response.data.users)
        setLoading(false)
        console.log('yaha tak thik hai')

        // After users are set, update selectedUserName based on formData.User
        const selectedUser = users.find((user) => user.userId === formData.User)
        const selectedUserName = selectedUser ? selectedUser.username : ''
        setSelectedUserName(selectedUserName)
        console.log('Selected Userrerrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:', selectedUserName)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
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
    const body = {
      deviceId: formData.Devices,
      fromDate: formData.FromDate ? new Date(formData.FromDate).toISOString() : null,
      toDate: formData.ToDate ? new Date(formData.ToDate).toISOString() : null,
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reports/geofence-by-time-range`,
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      console.log('API response data:', response.data) // Debug log
      setApiData(response.data.data) // Ensure response.data is an array or contains reports
      setStatusLoading(false)
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
              <strong>Geofence Report</strong>
            </CCardHeader>
            <CCardBody>
              <SearchGeofence
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                users={users}
                getGroups={getGroups}
                groups={groups}
                getDevices={getDevices}
                devices={devices}
                loading={loading}
                showMap={showMap}
                setShowMap={setShowMap}
                columns={columns}
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
                <strong>Geofence Report Results</strong>
                <div className="input-group" style={{ width: '300px' }}>
                  <CFormInput
                    placeholder="Search for Vehicle Number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <IconButton
                    className="bg-white rounded-end border disable"
                    style={{ height: '40px' }}
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <ShowGeofence
                  apiData={apiData}
                  selectedColumns={selectedColumns}
                  columns={columns}
                  devices={devices}
                  statusLoading={statusLoading}
                  searchQuery={searchQuery} // Passing searchQuery to ShowGeofence
                  selectedDeviceName={selectedDeviceName}
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

export default GeofenceReports
