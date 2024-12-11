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
import * as XLSX from 'xlsx';
import upLeft from "src/direction/up-left-arrow.gif";
import upRight from "src/direction/up-right-arrow.gif";
import downLeft from "src/direction/down-left-arrow.gif";
import downRight from "src/direction/down-right-arrow.gif";
import Loader from '../../../components/Loader/Loader'
import '../style/remove-gutter.css';
// import { saveAs } from 'file-saver';

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
}) => {
  const [validated, setValidated] = useState(false)
  const [buttonText, setButtonText] = useState('SHOW NOW')
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [selectedU, setSelectedU] = useState();
  const [selectedG, setSelectedG] = useState();
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
        value={selectedG ? { value: selectedG, label: groups.find((group) => group._id === selectedG)?.name } : null}
        onChange={(selectedOption) => {
          const selectedGroup = selectedOption?.value;
          setSelectedG(selectedGroup);
          console.log('Selected Group ID:', selectedGroup);
          getDevices(selectedGroup);
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
        value={formData.Devices ? { value: formData.Devices, label: devices.find((device) => device.deviceId === formData.Devices)?.name } : null}
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

const StopTable = ({ apiData, selectedColumns }) => {
  const [locationData, setLocationData] = useState({})

  // Function to convert latitude and longitude into a location name
  const fetchLocationName = async (lat, lng, rowIndex) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`

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
      apiData.finalDeviceDataByStopage.forEach((row, index) => {
        if (row.latitude && row.longitude) {
          fetchLocationName(row.latitude, row.longitude, index)
        }
      })
    }
  }, [apiData])

  // Function to generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF()
    const tableColumn = ['Device', ...selectedColumns]
    const tableRows = []

    apiData.finalDeviceDataByStopage.forEach((row, rowIndex) => {
      const tableRow = [
        row.deviceId,
        ...selectedColumns.map((column) => {
          if (column === 'Speed') return `${(row.speed * 3.6).toFixed(2)} km/h`
          if (column === 'Ignition') return row.ignition ? 'ON' : 'OFF'
          if (column === 'Direction') {
            if (row.course < 90 && row.course > 0) return 'North East'
            if (row.course > 90 && row.course < 180) return 'North West'
            if (row.course > 180 && row.course < 270) return 'South West'
            return 'South East'
          }
          if (column === 'Location') return locationData[rowIndex] || 'Fetching location...'
          if (column === 'Arrival Time')
            return new Date(
              new Date(row.arrivalTime).setHours(
                new Date(row.arrivalTime).getHours() - 5 ,
                new Date(row.arrivalTime).getMinutes() - 30 ,
              ),
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          if (column === 'Departure Time')
            return new Date(
              new Date(row.departureTime).setHours(
                new Date(row.departureTime).getHours() - 5,
                new Date(row.departureTime).getMinutes() - 30,
              ),
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          if (column === 'Device Name') return row.device?.name || '--'
          return '--'
        }),
      ]
      tableRows.push(tableRow)
    })

    autoTable(doc, { head: [tableColumn], body: tableRows })
    doc.save('stop-table.pdf')
  }

  // Function to generate and download Excel without using file-saver
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      apiData.finalDeviceDataByStopage.map((row, rowIndex) => {
        const rowData = {
          Device: row.deviceId,
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
          if (column === 'Arrival Time')
            rowData['Arrival Time'] = new Date(
              new Date(row.arrivalTime).setHours(
                new Date(row.arrivalTime).getHours() - 5,
                new Date(row.arrivalTime).getMinutes() - 30,
              ),
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          if (column === 'Departure Time')
            rowData['Departure Time'] = new Date(
              new Date(row.departureTime).setHours(
                new Date(row.departureTime).getHours() - 5,
                new Date(row.departureTime).getMinutes() - 30,
              ),
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          if (column === 'Device Name') rowData['Device Name'] = row.device?.name || '--'
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
    link.setAttribute('download', 'stop-table.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <>
      <CTable bordered className="custom-table">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>SN</CTableHeaderCell>
            {/* Dynamically render table headers based on selected columns */}
            {selectedColumns.map((column, index) => (
              <CTableHeaderCell key={index}>{column}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {apiData?.finalDeviceDataByStopage?.length > 0 ? (
            apiData?.finalDeviceDataByStopage.map((row, rowIndex) => (
              <CTableRow key={row.id || rowIndex} className="custom-row">
                <CTableDataCell  style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{rowIndex + 1}</CTableDataCell>

                {/* Dynamically render table cells based on selected columns */}
                {selectedColumns.map((column, index) => (
                  <CTableDataCell key={index}  style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>
                    {column === 'Speed' ? (
                      // Convert speed from m/s to km/h and format to 2 decimal places
                      // (row.speed * 3.6).toFixed(2) + ' km/h'
                      row.speed.toFixed(2) + ' km/h'
                    ) : column === 'Ignition' ? (
                      // Show 'ON' or 'OFF' based on ignition status
                      row.ignition ? (
                        'ON'
                      ) : (
                        'OFF'
                      )
                    ) : column === 'Direction' ? (
                      // Show direction (course)
                      row.course < 90 && row.course > 0 ? (
                        <>
                          <img
                            src={upRight}
                            alt="North East"
                            width="30"
                            height="25"
                          />
                          <span>North East</span>
                        </>
                      ) : row.course > 90 && row.course < 180 ? (
                        <>
                          <img
                            src={upLeft}
                            alt="North West"
                            width="30"
                            height="25"
                          />
                          <span>North West</span>
                        </>
                      ) : row.course > 180 && row.course < 270 ? (
                        <>
                          <img
                            src={downLeft}
                            alt="South West"
                            width="30"
                            height="25"
                          />
                          <span>South West</span>
                        </>
                      ) : (
                        <>
                          <img
                            src={downRight}
                            alt="South East"
                            width="30"
                            height="25"
                          />
                          <span>South East</span>
                        </>
                      )
                    ) : column === 'Location' ? (
                      // Show location
                      locationData[rowIndex] || 'Fetching location...'
                    ) : column === 'Arrival Time' ? (
                      // Add 6 hours 30 minutes to arrivalTime
                      new Date(
                        new Date(row.arrivalTime).setHours(
                          new Date(row.arrivalTime).getHours() - 5 ,
                          new Date(row.arrivalTime).getMinutes() - 30 ,
                        ),
                      ).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    ) : column === 'Departure Time' ? (
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
            <CTableRow>
              <CTableDataCell
                colSpan={selectedColumns.length + 1}
                style={{
                  backgroundColor: "#f8f9fa",
                  color: "#6c757d",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "16px",
                }}
              >
                {apiData?.finalDeviceDataByStopage? (
                  "No Data Found"
                ) : (

                  <div style={{ position: "relative", height: "100px" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Loader />
                    </div>
                  </div>
                )}
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
  const [users, setUsers] = useState();
  const [groups, setGroups] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [columns] = useState([
    'Speed',
    'Ignition',
    'Direction',
    'Location',
    'Arrival Time',
    'Departure Time',
  ])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [showMap, setShowMap] = useState(false) //show mapping data
  const accessToken = Cookies.get('authToken')
  const [apiData, setApiData] = useState() //data from api

  // Get the selected device name from the device list based on formData.Devices
  const selectedDevice = devices.find(device => device.deviceId === formData.Devices);
  const selectedDeviceName = selectedDevice ? selectedDevice.name : '';

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
    setGroups([]);
    setDevices([]);
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
      }
      // Assuming the data returned is what you want to display in the table
      console.log('Form submitted with data:', body)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
  return (
    <div>
      <CRow className="pt-3 gutter-0">
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
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
                <strong>All Stop List {selectedDeviceName && `for ${selectedDeviceName}`} </strong>
                {/* <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                /> */}
              </CCardHeader>
              <CCardBody>
                <StopTable apiData={apiData} selectedColumns={selectedColumns} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </div>
  )
}
export default Stops
