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
import '../style/remove-gutter.css'
import HistoryMap from './HistoryMap'

const SearchHistory = ({
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
  const [selectedU, setSelectedU] = useState()
  const [selectedG, setSelectedG] = useState()

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
      <CCol md={2}>
        <CFormLabel htmlFor="devices">User</CFormLabel>
        <CFormSelect
          id="user"
          required
          value={selectedU}
          onChange={(e) => {
            const selectedUser = e.target.value
            setSelectedU(selectedUser)
            console.log('Selected user:', selectedUser)
            getGroups(selectedUser)
          }}
        >
          <option value="">Choose a user...</option>
          {loading ? (
            <option>Loading Users...</option>
          ) : users?.length > 0 ? (
            users?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))
          ) : (
            <option disabled>No Users in this Account</option>
          )}
        </CFormSelect>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="devices">Groups</CFormLabel>
        <CFormSelect
          id="group"
          required
          value={selectedG}
          onChange={(e) => {
            const selectedGroup = e.target.value
            setSelectedG(selectedGroup)
            console.log('Selected Group ID:', selectedGroup)
            getDevices(selectedGroup)
          }}
        >
          <option value="">Choose a group...</option>

          {loading ? (
            <option>Loading Groups...</option>
          ) : groups?.length > 0 ? (
            groups?.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))
          ) : (
            <option disabled>No Groups in this User</option>
          )}
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        <CFormSelect
          id="devices"
          required
          value={formData.Devices}
          onChange={(e) => handleInputChange('Devices', e.target.value)}
        >
          <option value="">Choose a device...</option>
          {loading ? (<option disabled>Loading devices...</option>) : (
            devices?.length > 0 ? (
              devices?.map((device) => (
                <option key={device.id} value={device.deviceId}>{device.name}</option>
              ))
            ) : (
              <option disabled>No Device in this Group</option>
            )
          )
          }

        </CFormSelect>

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
      <CCol xs={2}>
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

const HistoryReport = () => {
  const [formData, setFormData] = useState({
    Devices: [],
    Details: '',
    Periods: '',
    FromDate: '',
    ToDate: '',
    Columns: [],
  }) // Change Devices to an array
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState()
  const [groups, setGroups] = useState([])
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
  const [distanceLoading, setDistanceLoading] = useState(false)

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
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data) {
        setUsers(response.data.users)
        setLoading(false)
        console.log('yaha tak thik hai')
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
    setDistanceLoading(true)
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
        setDistanceLoading(false)
      }
    } catch (error) {
      setDistanceLoading(false)
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
              <SearchHistory
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
      <CRow className="justify-content-center gutter-0">
        <CCol xs={12} className="px-4">
          <CCard className="p-0 mb-4 shadow-sm">
            <CCardBody>
              <HistoryMap />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default HistoryReport
