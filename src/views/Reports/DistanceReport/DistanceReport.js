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
import autoTable from 'jspdf-autotable'
import { auto } from '@popperjs/core'
import Loader from '../../../components/Loader/Loader'
import '../style/remove-gutter.css';

const SearchDistance = ({
  formData,
  handleInputChange,
  handleSubmit,
  users,
  getGroups,
  groups,
  devices,
  loading,
  getDevices,
  columns,
  showMap,
  setShowMap,
}) => {
  const [validated, setValidated] = useState(false)
  const [showDateInputs, setShowDateInputs] = useState(false) // State to manage button text
  const [buttonText, setButtonText] = useState('SHOW NOW')
  const [isDropdownOpen, setDropdownOpen] = useState(false) // State to manage dropdown visibility
  const [selectedU, setSelectedU] = useState();
  const [selectedG, setSelectedG] = useState();


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
      setShowMap(true) //Show the mapping
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
        {/* <CFormSelect
          id="user"
          required
          value={selectedU}
          onChange={(e) => {
            const selectedUser = e.target.value;
            setSelectedU(selectedUser)
            console.log("Selected user:", selectedUser);
            getGroups(selectedUser);
          }}
        >
          <option value="">Choose a user...</option>
          {loading ? (<option>Loading Users...</option>) : (
            users?.length > 0 ? (
              users?.map((user) => (
                <option key={user._id} value={user._id}>{user.username}</option>
              ))
            ) : (
              <option disabled>No Users in this Account</option>
            )
          )
          }
        </CFormSelect> */}
        <Select
  id="user"
  options={
    loading
      ? [{ value: '', label: 'Loading Users...', isDisabled: true }]
      : users?.length > 0
      ? users.map((user) => ({ value: user._id, label: user.username }))
      : [{ value: '', label: 'No Users in this Account', isDisabled: true }]
  }
  value={selectedU ? { value: selectedU, label: users.find((user) => user._id === selectedU)?.username } : null}
  onChange={(selectedOption) => {
    const selectedUser = selectedOption?.value;
    setSelectedU(selectedUser);
    console.log('Selected user:', selectedUser);
    getGroups(selectedUser);
  }}
  placeholder="Choose a user..." // Displayed when no value is selected
  isLoading={loading} // Optional loading spinner
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
  value={selectedG ? { value: selectedG, label: groups.find((group) => group._id === selectedG)?.name } : null}
  onChange={(selectedOption) => {
    const selectedGroup = selectedOption?.value;
    setSelectedG(selectedGroup);
    console.log('Selected Group ID:', selectedGroup);
    getDevices(selectedGroup);
  }}
  placeholder="Choose a group..." // Displayed when no value is selected
  isLoading={loading} // Shows a loading spinner during fetching
/>

        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
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
              className="btn btn-secondary"
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

const ShowDistance = ({ apiData, distanceLoading, selectedColumns, allDates, devices, searchQuery }) => {
  const [addressData, setAddressData] = useState({})
  const [newAddressData, setnewAddressData] = useState()
  // Function to get address based on latitude and longitude using Nominatim API
  const getAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      )
      if (response.data) {
        console.log('Fetched address:', response.data.display_name) // Debugging: log the address
        return response.data.display_name // Return display_name
      } else {
        console.error('Error fetching address: No data found')
        return 'Address not available'
      }
    } catch (error) {
      console.error('Error:', error.message)
      return 'Address not available'
    }
  }
  useEffect(() => {
    const fetchAddresses = async () => {
      // Fetch all addresses concurrently
      const promises = apiData.data.map(async (data) => {
        // Split the startLocation and endLocation strings into latitudes and longitudes
        const [startLat, startLon] = data.startLocation
          ? data.startLocation.split(',').map((coord) => coord.trim())
          : [null, null]
        const [endLat, endLon] = data.endLocation
          ? data.endLocation.split(',').map((coord) => coord.trim())
          : [null, null]
        // Fetch the start and end addresses only if coordinates are valid
        const startAddress =
          startLat && startLon ? await getAddress(startLat, startLon) : 'Invalid start location'
        const endAddress =
          endLat && endLon ? await getAddress(endLat, endLon) : 'Invalid end location'
        // Store the addresses in the addressData state
        return {
          ouid: data.ouid,
          startAddress: startAddress || 'Address not found',
          endAddress: endAddress || 'Address not found',
        }
      })
      // Wait for all promises to resolve
      const results = await Promise.all(promises)
      // Update the addressData state with the fetched addresses
      results.forEach((result) => {
        setnewAddressData({
          startAddress: result.startAddress,
          endAddress: result.endAddress,
        })
      })
      console.log('Updated addressData:', newAddressData) // Debugging: log addressData
      setAddressData(newAddressData)
    }
    if (apiData?.data?.length > 0) {
      fetchAddresses()
    }
  }, [apiData])
  if (newAddressData) {
    console.log(newAddressData)
  }

  allDates && console.log('yaha bhi sahi hai dates', allDates)

  const calculateTotalDistance = (row) => {
    return allDates.reduce((total, date) => {
      const distance = parseFloat(row[date]) || 0 // Convert to float and handle 'undefined' values
      return total + distance
    }, 0) // Initial total is 0
  }

  const findDeviceName = (deviceId) => {
    const device = devices.find((d) => d.deviceId === deviceId.toString())
    return device ? device.name : 'Unknown Device'
  }

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    const tableData = apiData.data.map((row) => [
      findDeviceName(row.deviceId),
      ...allDates.map((date) => (row[date] !== undefined ? `${row[date]} km` : '0 km')),
      `${calculateTotalDistance(row).toFixed(2)} km`,
    ])

    const headers = ['Vehicle', ...allDates, 'Total Distance (km)']

    autoTable(doc, {
      head: [headers],
      body: tableData,
      styles: { fontSize: 5, fontWeight: 'bold' },
      margin: { top: 10 },
    })

    doc.save('table_data.pdf')
  }

  // Export to Excel function
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()
    const tableData = []

    const headers = ['Vehicle', ...allDates, 'Total Distance (km)']
    tableData.push(headers)

    apiData.data.forEach((row) => {
      const rowData = [
        findDeviceName(row.deviceId),
        ...allDates.map((date) => (row[date] !== undefined ? row[date] : 0)),
        calculateTotalDistance(row).toFixed(2),
      ]
      tableData.push(rowData)
    })

    const ws = XLSX.utils.aoa_to_sheet(tableData)
    XLSX.utils.book_append_sheet(wb, ws, 'Table Data')
    XLSX.writeFile(wb, 'table-data.xlsx')
  }


  // Filter logic
  const filteredData = apiData?.data?.filter((row) => {
    const deviceName = findDeviceName(row.deviceId)?.toLowerCase() || '';
    const searchTerm = searchQuery.toLowerCase();

    // Check if the searchQuery matches the device name or any other relevant fields
    return deviceName.includes(searchTerm);
  }) || [];


  return (
    <>
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <CTable bordered className="custom-table" >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: "70px", minWidth: "70px" }}>Sr No.</CTableHeaderCell>
              <CTableHeaderCell>Vehicle</CTableHeaderCell>
              {/* Dynamically render table headers based on selected columns */}

              {allDates?.map((date, index) => (
                <CTableHeaderCell key={index} style={{ width: "110px", minWidth: "110px" }}>{date}</CTableHeaderCell>
              ))}
              <CTableHeaderCell>Total Distance</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {distanceLoading ? (<CTableRow style={{ position: 'relative' }}>
              <CTableDataCell
                colSpan={allDates.length + 3}
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
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <Loader />
                </div>
              </CTableDataCell>
            </CTableRow>) : (
             filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                  <CTableRow key={row.deviceId} className="custom-row">
                    <CTableDataCell  style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{rowIndex + 1}</CTableDataCell>
                    <CTableDataCell  style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{findDeviceName(row.deviceId)}</CTableDataCell>

                    {/* Dynamically render table cells based on the date range */}
                    {allDates.map((date, index) => (
                      <CTableDataCell key={index}  style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }} >
                        {/* Check if the date exists in the row, otherwise print '0' */}
                        {row[date] !== undefined ? `${row[date]} km` : '0 km'}
                      </CTableDataCell>
                    ))}
                    <CTableDataCell  style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>
                      {calculateTotalDistance(row).toFixed(2)}
                      <span> km</span>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan={allDates.length + 1}
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
              ))}
          </CTableBody>
        </CTable>
      </div >

      <CDropdown className="position-fixed bottom-0 end-0 m-3">
        <CDropdownToggle color="secondary" style={{ borderRadius: '50%', padding: '10px', height: '48px', width: '48px' }}>
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

const Distance = () => {
  const [formData, setFormData] = useState({
    Devices: [],
    Details: '',
    Periods: '',
    FromDate: '',
    ToDate: '',
    Columns: [],
  }) // Change Devices to an array
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState();
  const [groups, setGroups] = useState([]);
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const accessToken = Cookies.get('authToken')
  const [showMap, setShowMap] = useState(false) //show mapping data
  const [columns] = useState([
    'Vehicle Status',
    'Start Date Time',
    'Start Address',
    'Start Coordinates',
    'End Date Time',
    'End Address',
    'End Coordinates',
    'Total Distance',
    'Duration',
    'Driver Name',
    'Driver Phone No.',
  ])
  const [selectedColumns, setSelectedColumns] = useState([])
  const token = Cookies.get('authToken') //
  const [apiData, setApiData] = useState() //data from api
  const [distanceLoading, setDistanceLoading] = useState(false);

  const [allDates, setAllDates] = useState([])
  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA') // This formats as YYYY-MM-DD
  }

  useEffect(() => {
    // Function to generate an array of dates between startDate and endDate
    const generateDateArray = (start, end) => {
      const arr = []
      let currentDate = new Date(start)
      const lastDate = new Date(end)

      while (currentDate <= lastDate) {
        arr.push(formatDate(new Date(currentDate))) // Format date and add to array
        currentDate.setDate(currentDate.getDate() + 1) // Increment date by one day
      }

      return arr
    }

    // Ensure the dates are valid and create the date array
    if (formData.FromDate && formData.ToDate) {
      const dates = generateDateArray(formData.FromDate, formData.ToDate)
      setAllDates(dates)
      console.log('All formatted dates: ', dates)
    }
  }, [formData.FromDate, formData.ToDate])

  // Get the selected device name from the device list based on formData.Devices
  const selectedDevice = devices.find((device) => device.deviceId === formData.Devices)
  const selectedDeviceName = selectedDevice ? selectedDevice.name : ''

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

  const getGroups = async (selectedUser = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/group/${selectedUser}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data.groupsAssigned) {
        setGroups(response.data.groupsAssigned)
        setLoading(false);
        console.log("perticular user ke groups")
      } else if (response.data.groups) {
        setGroups(response.data.groups)
        setLoading(false);
        console.log("all groups")
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }


  const getUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data) {
        setUsers(response.data.users)
        setLoading(false);
        console.log("yaha tak thik hai")
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
    getGroups();
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
    setDistanceLoading(true);
    console.log('DataAll', formData)
    const fromDate = formData.FromDate ? new Date(formData.FromDate).toISOString().slice(0, 10) : '' // Change to YYYY-MM-DD
    const toDate = formData.ToDate ? new Date(formData.ToDate).toISOString().slice(0, 10) : '' // Change to YYYY-MM-DD
    const body = {
      deviceIds: formData.Devices, // Convert array to comma-separated string
      // period: formData.Periods,
      startDate: fromDate,
      endDate: toDate,
    }
    console.log(token)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/reports/distance`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        console.log(response.data.data)
        setApiData(response.data)
        setDistanceLoading(false);
      }
    } catch (error) {
      setDistanceLoading(false);
      console.error('Error submitting form:', error)
    }
  }

  return (
    <>
      <CRow className="pt-3 gutter-0">
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Distance Report</strong>
            </CCardHeader>
            <CCardBody>
              <SearchDistance
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                users={users}
                getGroups={getGroups}
                groups={groups}
                getDevices={getDevices}
                loading={loading}
                devices={devices}
                showMap={showMap}
                setShowMap={setShowMap}
                columns={columns}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {showMap && (
        <CRow className="justify-content-center mt-4 gutter-0">
          <CCol xs={12} className="px-4">
            <CCard className="p-0 mb-4 shadow-sm">
              <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
                <strong>
                  All Distance Report List {selectedDeviceName && `for ${selectedDeviceName}`}
                </strong>{' '}
                {/* Show the device name here */}
                <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                />
              </CCardHeader>
              <CCardBody>
                <ShowDistance
                  apiData={apiData}
                  distanceLoading={distanceLoading}
                  allDates={allDates}
                  devices={devices}
                  selectedColumns={selectedColumns}
                  searchQuery={searchQuery}  
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}
export default Distance
