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
import Loader from '../../../components/Loader/Loader'
import '../style/remove-gutter.css';

const SearchTrip = ({
  formData,
  handleInputChange,
  handleSubmit,
  users,
  groups,
  getGroups,
  loading,
  devices,
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
    const timezoneOffset = date.getTimezoneOffset()

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

const TripTable = ({ apiData, selectedColumns }) => {
  const [addressData, setAddressData] = useState({})

  // Function to get address based on latitude and longitude using Nominatim API
  const getAddress = async (latitude, longitude) => {
    try {
      const apiKey = 'DG2zGt0KduHmgSi2kifd';  // Replace with your actual MapTiler API key
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`
      );

      if (response.data && response.data.features && response.data.features.length > 0) {
        const address = response.data.features[0].place_name;  // MapTiler's address field
        console.log('Fetched address:', address);  // Debugging: log the address
        return address;  // Return place_name from MapTiler response
      } else {
        console.error('Error fetching address: No data found');
        return 'Address not available';
      }
    } catch (error) {
      console.error('Error:', error.message);
      return 'Address not available';
    }
  };
  useEffect(() => {
    const fetchAddresses = async () => {
      const newAddressData = {}
      for (const trip of apiData.finalTrip) {
        const startAddress = await getAddress(trip.startLatitude, trip.startLongitude)
        const endAddress = await getAddress(trip.endLatitude, trip.endLongitude)
        newAddressData[trip.deviceId] = { startAddress, endAddress }
      }
      setAddressData(newAddressData)
    }

    if (apiData?.finalTrip?.length > 0) {
      fetchAddresses()
    }
  }, [apiData])

  // PDF Download Function
  const downloadPDF = () => { 
    const doc = new jsPDF({
      orientation: 'landscape',
    });
    const tableColumn = ['Device', ...selectedColumns];
    const tableRows = [];
  
    apiData.finalTrip.forEach((row, rowIndex) => {
      const tableRow = [
        row.name,
        ...selectedColumns.map((column) => {
          if (column === 'Start Time') {
            return new Date(
              new Date(row.startTime).setHours(
                new Date(row.startTime).getHours() - 5,
                new Date(row.startTime).getMinutes() - 30
              )
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          if (column === 'End Time') {
            return new Date(
              new Date(row.endTime).setHours(
                new Date(row.endTime).getHours() - 5,
                new Date(row.endTime).getMinutes() - 30
              )
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          if (column === 'Distance') {
            const distanceValue = parseFloat(row.distance); // Extract numeric part
            return isNaN(distanceValue) ? '--' : distanceValue.toFixed(2) + ' km';
          }
          if (column === 'Total Distance') {
            const totalDistanceValue = parseFloat(row.totalDistance); // Extract numeric part
            return isNaN(totalDistanceValue) ? '--' : totalDistanceValue.toFixed(2) + ' km';
          }
          if (column === 'Maximum Speed') {
            return (Number(row.maxSpeed) || 0).toFixed(2) + ' km/h';
          }
          if (column === 'Average Speed') {
            return (Number(row.avgSpeed) || 0).toFixed(2) + ' km/h';
          }
          if (column === 'Duration') {
            return row.duration || '--';
          }
          if (column === 'Start Address') {
            return addressData[row.deviceId]?.startAddress || 'Fetching...';
          }
          if (column === 'End Address') {
            return addressData[row.deviceId]?.endAddress || 'Fetching...';
          }
          if (column === 'Driver') {
            return row.driverName || '--';
          }
          if (column === 'Device Name') {
            return row.device?.name || '--';
          }
          return '--';
        }),
      ];
      tableRows.push(tableRow);
    });
  
    autoTable(doc, { head: [tableColumn], body: tableRows });
    doc.save('trip-table.pdf');
  };
  

  // Excel Download Function
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      apiData.finalTrip.map((row, rowIndex) => {
        const rowData = {
          Device: row.name,
        };
  
        selectedColumns.forEach((column) => {
          if (column === 'Start Time') {
            rowData['Start Time'] = new Date(
              new Date(row.startTime).setHours(
                new Date(row.startTime).getHours() - 5,
                new Date(row.startTime).getMinutes() - 30
              )
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
  
          if (column === 'End Time') {
            rowData['End Time'] = new Date(
              new Date(row.endTime).setHours(
                new Date(row.endTime).getHours() - 5,
                new Date(row.endTime).getMinutes() - 30
              )
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
  
        
        if (column === 'Distance') {
          const distanceValue = parseFloat(row.distance.replace(' KM', '')) || 0;
          rowData.Distance = distanceValue.toFixed(2) + ' km';
        }

        if (column === 'Total Distance') {
          const totalDistanceValue = parseFloat(row.totalDistance.replace(' KM', '')) || 0;
          rowData['Total Distance'] = totalDistanceValue.toFixed(2) + ' km';
        }
  
          if (column === 'Maximum Speed') {
            rowData['Maximum Speed'] = (Number(row.maxSpeed) || 0).toFixed(2) + ' km/h';
          }
  
          if (column === 'Average Speed') {
            rowData['Average Speed'] = (Number(row.avgSpeed) || 0).toFixed(2) + ' km/h';
          }
  
          if (column === 'Duration') {
            rowData.Duration = row.duration || '--';
          }
  
          if (column === 'Start Address') {
            rowData['Start Address'] = addressData[row.deviceId]?.startAddress || 'Fetching...';
          }
  
          if (column === 'End Address') {
            rowData['End Address'] = addressData[row.deviceId]?.endAddress || 'Fetching...';
          }
  
          if (column === 'Driver') {
            rowData.Driver = row.driverName || '--';
          }
  
          if (column === 'Device Name') {
            rowData['Device Name'] = row.device?.name || '--';
          }
        });
  
        return rowData;
      })
    );
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trips');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'trip-table.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <>
      <CTable bordered className="custom-table">
        <CTableHead>
          <CTableRow>
            {/* Device Header Cell */}
            <CTableHeaderCell>Device</CTableHeaderCell>

            {/* Dynamically render table headers based on selected columns */}
            {selectedColumns.map((column, index) => (
              <CTableHeaderCell key={index}>{column}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {/* Check if apiData and finalTrip exist and are not empty */}
          {apiData?.finalTrip?.length > 0 ? (
            apiData.finalTrip.map((row, rowIndex) => (
              <CTableRow key={row.id || rowIndex} className="custom-row">
                {/* Device ID Cell */}
                <CTableDataCell
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                  }}
                >
                  {row.name}
                </CTableDataCell>

                {/* Dynamically render table cells based on selected columns */}
                {selectedColumns.map((column, index) => (
                  <CTableDataCell
                    key={index}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                    }}
                  >
                    {(() => {
                      switch (column) {
                        case "Start Time":
                          return new Date(
                            new Date(row.startTime).setHours(
                              new Date(row.startTime).getHours() - 5,
                              new Date(row.startTime).getMinutes() - 30
                            )
                          ).toLocaleString([], {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          });
                        case "End Time":
                          return new Date(
                            new Date(row.endTime).setHours(
                              new Date(row.endTime).getHours() - 5,
                              new Date(row.endTime).getMinutes() - 30
                            )
                          ).toLocaleString([], {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          });
                        case "Distance":
                          return row.distance;
                        case "Total Distance":
                          return row.totalDistance;
                        case "Maximum Speed":
                          return `${row.maxSpeed.toFixed(2)} km/h`;
                        case "Average Speed":
                          return `${row.avgSpeed.toFixed(2)} km/h`;
                        case "Duration":
                          return row.duration;
                        case "Start Address":
                          return addressData[row.deviceId]?.startAddress || "Fetching...";
                        case "End Address":
                          return addressData[row.deviceId]?.endAddress || "Fetching...";
                        case "Driver":
                          return row.driverName;
                        case "Device Name":
                          return row.device?.name || "--";
                        default:
                          return "--";
                      }
                    })()}
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
                {apiData?.finalTrip ? (
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

const Trips = () => {
  const accessToken = Cookies.get('authToken')
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
    'Start Time',
    'Start Address',
    'Average Speed',
    'End Time',
    'End Address',
    'Maximum Speed',
    'Distance',
    'Total Distance',
  ])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [showMap, setShowMap] = useState(false) //show mapping data
  const token = Cookies.get('authToken') //token

  const [apiData, setApiData] = useState() //data from api

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
      throw error
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
      setLoading(false);
      console.error('Error fetching data:', error)
      throw error
    }
  }

  useEffect(() => {
    getUser();
    getGroups();
  }, [])


  const getDevices = async (selectedGroup) => {

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

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    if (name === 'Columns') {
      setSelectedColumns(value)
    }
  }

  // const handleSubmit = () => {
  //   console.log('Form submitted with data:', formData);
  // };

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

    console.log(token)
    // console.log(body);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/history/show-only-device-trips-startingpoint-endingpoint?deviceId=${body.deviceId}&from=${body.FromDate}&to=${body.ToDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      // console.log(response.data.deviceDataByTrips[0]);

      if (response.status == 200) {
        console.log(response.data.finalTrip)
        console.log('done in all')
        console.log(response.data)
        setApiData(response.data)
      }

      // Assuming the data returned is what you want to display in the table
      console.log('Form submitted with data:', body)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <>
      <CRow className="pt-3 gutter-0">

        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Travel Report</strong>
            </CCardHeader>
            <CCardBody>
              <SearchTrip
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                users={users}
                getGroups={getGroups}
                groups={groups}
                devices={devices}
                loading={loading}
                getDevices={getDevices}
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
                <strong>Travel Data</strong>
                {/* <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                /> */}
              </CCardHeader>
              <CCardBody>
                <TripTable apiData={apiData} selectedColumns={selectedColumns} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default Trips
