import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { RiEdit2Fill, RiAddBoxFill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import SearchIcon from '@mui/icons-material/Search'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import CloseIcon from '@mui/icons-material/Close'
import Cookies from 'js-cookie'
import { IoMdAdd } from 'react-icons/io'

const getStatusColor = (status) => (status === 'online' ? 'green' : 'red')

const Devices = () => {
  const [open, setOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false) // Modal for adding a new row
  const [formData, setFormData] = useState({})
  const [anchorEl, setAnchorEl] = useState(null) // Form data state
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalResponses, setTotalResponses] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const [filteredRows, setFilteredRows] = useState([])
  // const handleModalClose = () => setAddModalOpen(false);
  const [filteredData, setFilteredData] = useState([]) // Your initial data
  const [selectedRow, setSelectedRow] = useState(null)
  const [users, setUsers] = useState([])
  const [extendedPasswordModel, setExtendedPasswordModel] = useState(false)
  const myPassword = '123456'
  const [extendedPassword, setExtendedPassword] = useState()
  const [passwordCheck, setPasswordCheck] = useState(false)
  const [drivers, setDrivers] = useState([])
  const handleModalClose = () => {
    setEditModalOpen(false)
    setAddModalOpen(false)
    setExtendedPasswordModel(false)
  }
  const [areasValue, setAreasValue] = useState('')
  const token = Cookies.get('authToken')

  const columns = [
    { Header: 'Device Id', accessor: '_id' },
    { Header: 'Device Name', accessor: 'name' }, // Maps to 'name'
    { Header: 'Imei No.', accessor: 'uniqueId' }, // Maps to 'uniqueId'
    { Header: 'Sim', accessor: 'sim' }, // Maps to 'sim'
    { Header: 'Speed', accessor: 'speed' }, // Maps to 'speed'
    { Header: 'Average', accessor: 'average' }, // Maps to 'average'
    { Header: 'Model', accessor: 'model' }, // Maps to 'model'
    { Header: 'Category', accessor: 'category' }, // Maps to 'category'
    { Header: 'Driver', accessor: 'Driver' },
    // Custom render function for nested group names
    {
      Header: 'Groups',
      accessor: 'groups',
      Cell: ({ row }) => (
        <FormControl fullWidth>
          <InputLabel>Groups</InputLabel>
          <Select
            multiple
            value={row.original.groups.map((group) => group._id)} // Extract group IDs for selected value
            onChange={(event) => {
              const selectedGroups = event.target.value
              console.log('Selected Groups:', selectedGroups) // Handle the selection if needed
            }}
            renderValue={(selected) => selected.join(', ')} // Display selected group IDs
          >
            {row.original.groups.map((group) => (
              <MenuItem key={group._id} value={group._id}>
                {group.name} // Assuming each group has a 'name' property for display
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },

    // Custom render function for nested user names
    {
      Header: 'Users',
      accessor: 'users',
      Cell: ({ value }) => (
        <FormControl fullWidth>
          <InputLabel>Users</InputLabel>
          <Select
            multiple
            value={Array.isArray(value) ? value.map((user) => user.username) : []} // Ensure value is an array
            onChange={(event) => {
              const selectedUsers = event.target.value
              console.log('Selected Users:', selectedUsers) // Handle the selection if needed
            }}
            renderValue={(selected) => selected.join(', ')} // Display selected usernames
          >
            {Array.isArray(value) &&
              value.map((user) => (
                <MenuItem key={user._id} value={user.username}>
                  {user.username}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      ),
    },

    // Directly maps to geofences array; customize as needed
    {
      Header: 'Geofences',
      accessor: 'geofences',
      Cell: ({ value }) => (
        <FormControl fullWidth>
          <InputLabel>Geofences</InputLabel>
          <Select
            multiple
            value={Array.isArray(value) ? value : []} // Ensure value is an array
            onChange={(event) => {
              const selectedGeofences = event.target.value // Get selected geofence IDs
              console.log('Selected Geofences:', selectedGeofences) // Handle the selection if needed
            }}
            renderValue={(selected) => selected.join(', ')} // Display selected geofence IDs
          >
            {Array.isArray(value) &&
              value.map((geofence) => (
                <MenuItem key={geofence} value={geofence}>
                  {geofence}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      ),
    },

    { Header: 'Installation Date', accessor: 'installationdate' }, // Maps to 'installationdate'

    { Header: 'Expiration', accessor: 'expirationdate' }, // Maps to 'expirationdate'
    { Header: 'Extend Date', accessor: 'extenddate' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Enable vertical scrolling
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    margintop: '8px',
  }
  /* Replace -ms-high-contrast with forced-colors */

  const fetchData = async () => {
    setLoading(true) // Start loading
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/device`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Access the devices array from the response
      if (response.data && Array.isArray(response.data.devices)) {
        const deviceData = response.data.devices.map((device) => ({
          _id: device._id || 'N/A',
          name: device.name || 'N/A', // Maps to 'Device Name'
          uniqueId: device.uniqueId || 'N/A', // Maps to 'Imei No.'
          sim: device.sim || 'N/A', // Maps to 'Sim'
          speed: device.speed || 'N/A', // Maps to 'Speed'
          average: device.average || 'N/A', // Maps to 'Average'
          model: device.model || 'N/A', // Maps to 'Model'
          category: device.category || 'N/A', // Maps to 'Category'
          Driver: device.Driver?.name || 'N/A',
          installationdate: device.installationdate || 'N/A',
          expirationdate: device.expirationdate || 'N/A',
          extenddate: device.extenddate || 'N/A', // Maps to 'Expiration'

          // Groups - Comma separated group names or 'N/A' if none
          groups: device.groups || [],

          // Users - Comma separated usernames or 'N/A' if none
          users: device.users || [],

          // Geofences - Comma separated geofence IDs or 'N/A' if none
          geofences: device.geofences || [],
        }))

        setData(deviceData) // Set formatted device data
        setTotalResponses(deviceData.length) // Set total responses
      } else {
        console.error('Expected an array but got:', response.data)
        alert('Unexpected data format received.')
      }
    } catch (error) {
      console.error('Fetch data error:', error)
      alert('An error occurred while fetching data.')
    } finally {
      setLoading(false) // Stop loading once data is fetched
    }
  }

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase()
    setFilteredData(
      data.filter((item) =>
        columns.some((column) =>
          item[column.accessor]?.toString().toLowerCase().includes(lowerCaseQuery),
        ),
      ),
    )
  }, [data, searchQuery, columns])

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };

  const handleEditDateInputChange = (e) => {
    const { name, value } = e.target
    setExtendedPasswordModel(true)

    if (passwordCheck) {
      setFormData((prevData) => ({ ...prevData, [name]: value }))
    }
  }
  const GroupDropdown = ({ groups, selectedGroups }) => {
    const handleSelectChange = (event) => {
      const value = Array.from(event.target.selectedOptions, (option) => option.value)
      // Handle selected groups value here
      console.log('Selected groups:', value)
    }

    return (
      <select multiple value={selectedGroups} onChange={handleSelectChange}>
        {groups.length > 0 && (
          <option value="" disabled>
            Select Groups
          </option>
        )}
        {groups.map((group) => (
          <option key={group._id} value={group._id}>
            {group.name}
          </option>
        ))}
      </select>
    )
  }

  const handleCheckPassword = () => {
    if (extendedPassword == myPassword) {
      setPasswordCheck(true)
      setExtendedPasswordModel(false)
      alert('password is correct')
    } else {
      alert('password is not correct')
    }
  }

  // const handleAddSubmit = async () => {
  //   try {
  //     const apiUrl = "https://credence-tracker.onrender.com/device/";

  //     const newRow = {
  //       name: formData.name || '',
  //       uniqueId: formData.uniqueId || '',
  //       sim: formData.sim || '',
  //       speed:formData.speed || '',
  //       average:formData.average || '',
  //       groups: Array.isArray(formData.groups) ? formData.groups : [],
  //       users: Array.isArray(formData.users) ? formData.users : [],
  //       Driver: formData.Driver || '',
  //       geofences: Array.isArray(formData.geofences) ? formData.geofences : [],
  //       model: formData.model || '',
  //       category: formData.category || '',
  //       installationdate: formData.installationdate || '',
  //       expirationdate: formData.expirationdate || '',
  //       extenddate: formData.extenddate || '',
  //     };

  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJkZXZpY2VsaW1pdCI6ZmFsc2UsIl9pZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsImVtYWlsIjoieWFzaEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRCSHp0NnU0YnA0TTVLeFlhcDlTbFh1NDdyVWJ1S2xWVC9KUVZSTERscVBxVjgvUDc5OVdvaSIsInVzZXJuYW1lIjoieWFzaCIsImNyZWF0ZWRCeSI6IjY2ZjI4NDcwZGU4ZGRlMDVmNzRhN2Q5OCIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5Ijp0cnVlLCJtb2RlbCI6dHJ1ZSwidXNlcnMiOnRydWUsInJlcG9ydCI6dHJ1ZSwic3RvcCI6dHJ1ZSwidHJpcHMiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJtYWludGVuYW5jZSI6dHJ1ZSwicHJlZmVyZW5jZXMiOnRydWUsImNvbWJpbmVkUmVwb3J0cyI6dHJ1ZSwiY3VzdG9tUmVwb3J0cyI6dHJ1ZSwiaGlzdG9yeSI6dHJ1ZSwic2NoZWR1bGVyZXBvcnRzIjp0cnVlLCJzdGF0aXN0aWNzIjp0cnVlLCJhbGVydHMiOnRydWUsInN1bW1hcnkiOnRydWUsImN1c3RvbUNoYXJ0cyI6dHJ1ZSwiX192IjowfSwiaWF0IjoxNzI3MzQ0OTc2fQ.yYjpV596hRjy4FuGzeBaUfZuNJ3LbUQL2XwyR0-6tsE',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newRow),
  //     });

  //     const result = await response.json();
  //     if (response.ok) {
  //       // Success
  //       setFilteredRows([...filteredRows, result]);
  //       handleModalClose();
  //       fetchData();
  //       console.log('Record created successfully:', result);
  //       alert('Record created successfully');
  //     } else {
  //       // Log response status and full response body for debugging
  //       console.error('Response Status:', response.status);
  //       const responseBody = await response.text();
  //       console.error('Response Body:', responseBody);

  //       if (response.status === 500) {
  //         alert('Internal Server Error: Please check server logs.');
  //       } else if (response.status === 409) {
  //         alert('Conflict: The resource already exists (e.g., uniqueId might be duplicated)');
  //       } else {
  //         alert(`Unable to create record: ${responseBody || response.statusText}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error during POST request:', error);
  //     alert('Unable to create record');
  //   }
  // };

  const handleAddSubmit = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/device`
      const newRow = {
        name: formData.name || '',
        uniqueId: formData.uniqueId.trim() || '', // Trim whitespace
        sim: formData.sim || '',
        groups: Array.isArray(formData.groups) ? formData.groups : [],
        users: Array.isArray(formData.users) ? formData.users : [],
        Driver: formData.Driver || '',
        speed: formData.speed || '',
        average: formData.average || '',
        geofences: Array.isArray(formData.geofences) ? formData.geofences : [],
        model: formData.model || '',
        category: formData.category || '',
        installationdate: formData.installationdate || '',
        expirationdate: formData.expirationdate || '',
        extenddate: formData.extenddate || '',
      }

      console.log('Payload being sent:', newRow)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      })

      console.log('Raw response:', response)

      if (response.ok) {
        const result = await response.json()
        setFilteredRows([...filteredRows, result])
        handleModalClose()
        fetchData()
        console.log('Record created successfully:', result)
        alert('Record created successfully')
      } else {
        const contentType = response.headers.get('content-type')
        let responseBody

        if (contentType && contentType.includes('application/json')) {
          responseBody = await response.json()
        } else {
          responseBody = await response.text()
        }

        console.error('Error Response:', responseBody)
        alert(`Unable to create record: ${responseBody.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error during POST request:', error)
      alert('Unable to create record')
    }
  }

  const [groups, setGroups] = useState([])
  // const [error, setError] = useState(null);
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/group`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setGroups(data.groups) // Assuming the API returns { groups: [...] }
      } catch (error) {
        setError(error.message)
      }
    }

    fetchGroups()
  }, [])

  const [calendars, setCalendars] = useState([]) // State to store calendar data
  const [calendarError, setCalendarError] = useState(null) // State to store error

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/calendars`, {
          method: 'GET',
          headers: {
            Authorization: 'Basic ' + btoa('school:123456'), // Replace with actual credentials
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setCalendars(data) // Assuming the API returns { calendars: [...] }
      } catch (error) {
        setCalendarError(error.message)
      }
    }

    fetchCalendars()
  }, [])

  const handleDeleteSelected = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this record?')
    if (!confirmed) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/device/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // If the response is OK, filter the data and remove the deleted item
        setFilteredData((prevData) => prevData.filter((item) => item._id !== id))
        alert('Record deleted successfully')
      } else {
        const result = await response.json()
        alert(`Unable to delete record: ${result.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error during DELETE request:', error)
      alert('Unable to delete record. Please check the console for more details.')
    }
    fetchData()
  }

  const handleEditIconClick = (row) => {
    setSelectedRow(row) // Set the selected row to be edited
    setFormData(row) // Populate form with the row's data
    setEditModalOpen(true) // Open the modal
  }

  // const handleEditSubmit = async () => {
  //   if (!selectedRow) {
  //     alert('No row selected for editing')
  //     return
  //   }

  //   const apiUrl = `https://credence-tracker.onrender.com/device/${selectedRow._id}`

  //   // Exclude the 'isSelected' field from formData
  //   const { isSelected, ...updatedData } = formData

  //   try {
  //     console.log('Sending request to:', apiUrl)
  //     console.log('Request payload:', JSON.stringify(updatedData, null, 2))

  //     const response = await fetch(apiUrl, {
  //       method: 'PUT',
  //       headers: {
  //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJkZXZpY2VsaW1pdCI6ZmFsc2UsIl9pZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsImVtYWlsIjoieWFzaEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRCSHp0NnU0YnA0TTVLeFlhcDlTbFh1NDdyVWJ1S2xWVC9KUVZSTERscVBxVjgvUDc5OVdvaSIsInVzZXJuYW1lIjoieWFzaCIsImNyZWF0ZWRCeSI6IjY2ZjI4NDcwZGU4ZGRlMDVmNzRhN2Q5OCIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjp0cnVlLCJncm91cHMiOnRydWUsImNhdGVnb3J5Ijp0cnVlLCJtb2RlbCI6dHJ1ZSwidXNlcnMiOnRydWUsInJlcG9ydCI6dHJ1ZSwic3RvcCI6dHJ1ZSwidHJpcHMiOnRydWUsImdlb2ZlbmNlIjp0cnVlLCJtYWludGVuYW5jZSI6dHJ1ZSwicHJlZmVyZW5jZXMiOnRydWUsImNvbWJpbmVkUmVwb3J0cyI6dHJ1ZSwiY3VzdG9tUmVwb3J0cyI6dHJ1ZSwiaGlzdG9yeSI6dHJ1ZSwic2NoZWR1bGVyZXBvcnRzIjp0cnVlLCJzdGF0aXN0aWNzIjp0cnVlLCJhbGVydHMiOnRydWUsInN1bW1hcnkiOnRydWUsImN1c3RvbUNoYXJ0cyI6dHJ1ZSwiX192IjowfSwiaWF0IjoxNzI3MzQ0OTc2fQ.yYjpV596hRjy4FuGzeBaUfZuNJ3LbUQL2XwyR0-6tsE`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedData),
  //     })

  //     if (!response.ok) {
  //       const errorResult = await response.json()
  //       throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResult.message}`)
  //     }

  //     const result = await response.json()
  //     console.log('Update successful:', result)
  //     alert('Updated successfully')

  //     // Update local state with the modified row data
  //     const updatedRows = rows.map((row) =>
  //       row.id === selectedRow.id ? { ...row, ...updatedData } : row,
  //     )
  //     // Assuming you have a setFilteredRows or similar to update the state
  //     setFilteredRows(updatedRows)

  //     setEditModalOpen(false)
  //     fetchData() // Refetch data to ensure the UI is up-to-date
  //   } catch (error) {
  //     console.error('Error updating row:', error.message)
  //     alert('Error updating data')
  //   }
  // }
  const [rows, setRows] = useState([])
  const handleEditSubmit = async () => {
    if (!selectedRow) {
      alert('No row selected for editing')
      return
    }

    const apiUrl = `${import.meta.env.VITE_API_URL}/device/${selectedRow._id}`

    // Exclude the 'isSelected' field from formData
    const { isSelected, ...updatedData } = formData

    const modifiedData = {
      ...updatedData,
      uniqueId: updatedData.uniqueId.trim() || '',
      groups: Array.isArray(updatedData.groups) ? updatedData.groups : [],
      users: Array.isArray(updatedData.users) ? updatedData.users : [],
      geofences: Array.isArray(updatedData.geofences) ? updatedData.geofences : [],
      name: updatedData.name || '',
      sim: updatedData.sim || '',
      Driver: updatedData.Driver || '',
      speed: updatedData.speed || '',
      average: updatedData.average || '', // Replace empty with null
      model: updatedData.model || '',
      category: updatedData.category || '',
      installationdate: updatedData.installationdate || '',
      expirationdate: updatedData.expirationdate || '',
      extenddate: updatedData.extenddate || '',
    }

    try {
      console.log('Sending request to:', apiUrl)
      console.log('Request payload:', JSON.stringify(modifiedData, null, 2))

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedData),
      })

      if (!response.ok) {
        const errorResult = await response.json()
        console.error('Error response from server:', errorResult)
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResult.message}`)
      }

      const result = await response.json()
      console.log('Update successful:', result)
      alert('Record updated successfully')

      // Update the local state to reflect the modified row data
      const updatedRows = rows.map((row) =>
        row.id === selectedRow.id ? { ...row, ...modifiedData } : row,
      )
      setFilteredRows(updatedRows)

      setEditModalOpen(false) // Close the modal
      fetchData() // Refetch data to refresh the UI
    } catch (error) {
      if (error.response) {
        // Log the server response
        console.error('Server response:', error.response.data)
      } else {
        console.error('Error updating row:', error.message)
      }
      alert('Error updating data')
    }
  }

  const [dropdownOptions, setDropdownOptions] = useState([])
  // const [areas, setAreas] = useState([])
  const [areas, setAreas] = useState([])
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreasData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/geofence`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        if (data.geofences) {
          const geofenceNames = data.geofences.map((item) => item.name)
          setAreas(geofenceNames)
        }
      } catch (error) {
        console.error('Error fetching areas data:', error)
      }
    }

    fetchAreasData()
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    // console.log(`Selected value: ${value}`); // Log the selected value
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  const fetchUsers = async () => {
    console.log('Fetching users...')
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Fetched users:', response.data)

      // Checking if response contains the expected structure
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(
          response.data.users.map((user) => ({
            _id: user._id,
            username: user.username,
          })),
        ) // Correct mapping
      } else {
        console.error('Unexpected response structure:', response.data)
      }
    } catch (error) {
      console.error('Fetch users error:', error)
      alert('An error occurred while fetching users.')
    }
  }

  // UseEffect to fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle year selection for expiration date

  const [showExpirationDropdown, setShowExpirationDropdown] = useState(false)

  // Handle year selection and calculate expiration date based on the number of years selected
  const handleYearSelection = (years) => {
    const currentDate = new Date()
    const expirationDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + years))
      .toISOString()
      .split('T')[0] // Format to yyyy-mm-dd
    handleInputChange({ target: { name: 'expiration', value: expirationDate } })
  }
  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/driver`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response && response.data) {
        setDrivers(response.data.drivers) // Set the driver data from the API response
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
    }
  }
  const [models, setModels] = useState([])
  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/model`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response?.data?.models) {
        setModels(response.data.models) // Store the fetched models in state
      }
    } catch (error) {
      console.error('Error fetching models:', error)
    }
  }

  // Fetch models on component mount
  useEffect(() => {
    fetchModels()
  }, [])

  const [categories, setCategories] = useState([])
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response?.data) {
        setCategories(response.data) // Store the fetched categories in state
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])
  // const handleSelectChange = (event) => {
  //   const value = event.target.value;
  //   // Handle selected users value here
  //   console.log("Selected users:", value);
  // };
  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Devices</h2>
        </div>

        <div className="d-flex">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="search here...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => setAddModalOpen(true)}
              variant="contained"
              className="btn btn-primary"
            >
              Add Device
            </button>
          </div>
        </div>
      </div>

      <div className="mb-2 d-md-none">
        <input
          type="search"
          className="form-control"
          placeholder="search here...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{
          height: '500px', // Set the desired height
          overflowX: 'auto', // Enable horizontal scrollbar
          overflowY: 'auto', // Enable vertical scrollbar if needed
        }}
      >
        {loading ? (
          <>
            <div className="text-nowrap mb-2" style={{ width: '480px' }}>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-7" />
                <span className="placeholder col-4" />
                <span className="placeholder col-4" />
                <span className="placeholder col-6" />
                <span className="placeholder col-8" />
              </p>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-7" />
                <span className="placeholder col-4" />
                <span className="placeholder col-4" />
                <span className="placeholder col-6" />
                <span className="placeholder col-8" />
              </p>
            </div>
          </>
        ) : (
          <CTable align="middle" className="mb-2 border min-vh-25 rounded-top-3" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                {/* Skip the first column */}
                {columns.slice(1).map((column, index) => (
                  <CTableHeaderCell key={index} className="text-center text-white" style={{background: "rgb(1,22,51)"}}>
                    {column.Header}
                  </CTableHeaderCell>
                ))}
                <CTableHeaderCell className="text-white text-center" style={{ background: 'rgb(1,22,51)' }}>
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
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
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <CTableRow key={item._id}>
                    {/* Skip the first field in the data row */}
                    {columns.slice(1).map((column) => (
                      <CTableDataCell key={column.accessor} className="text-center">
                        {column.accessor === 'groups' ? (
                          <FormControl fullWidth>
                            <InputLabel>Groups</InputLabel>
                            <Select
                              value={item.groups.length > 0 ? item.groups[0]._id : ''} // Default to the first group ID or empty if no groups
                              onChange={(event) => {
                                const selectedGroupId = event.target.value // Get selected group ID
                                console.log('Selected Group ID:', selectedGroupId) // Handle the selection if needed
                              }}
                              renderValue={(selected) => {
                                const selectedGroup =
                                  item.groups.find((group) => group._id === selected) || {}
                                return selectedGroup.name || 'No Group Selected' // Display the name of the selected group or a default message
                              }}
                            >
                              {item.groups.map((group) => (
                                <MenuItem key={group._id} value={group._id}>
                                  {group.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : column.accessor === 'geofences' ? ( // Add geofences dropdown
                          <FormControl fullWidth>
                            <InputLabel>Geofences</InputLabel>
                            <Select
                              value={item.geofences.length > 0 ? item.geofences[0] : ''} // Default to the first geofence ID or empty if no geofences
                              onChange={(event) => {
                                const selectedGeofenceId = event.target.value // Get selected geofence ID
                                console.log('Selected Geofence ID:', selectedGeofenceId) // Handle the selection if needed
                              }}
                              renderValue={(selected) => {
                                const selectedGeofence =
                                  item.geofences.find((geofence) => geofence === selected) || ''
                                return selectedGeofence || 'No Geofence Selected' // Display the selected geofence ID or a default message
                              }}
                            >
                              {Array.isArray(item.geofences) &&
                                item.geofences.map((geofence, index) => (
                                  <MenuItem key={index} value={geofence}>
                                    {geofence}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        ) : column.accessor === 'users' ? (
                          // Add FormControl for Users dropdown with safe array handling
                          <FormControl fullWidth>
                            <InputLabel>Users</InputLabel>
                            <Select
                              multiple
                              value={
                                Array.isArray(item.users) && item.users.length > 0
                                  ? [item.users[0].username]
                                  : []
                              } // Default to the first username or empty if no users
                              onChange={(event) => {
                                const selectedUsers = event.target.value // Get selected user usernames
                                console.log('Selected Users:', selectedUsers) // Handle selection
                              }}
                              renderValue={(selected) => {
                                return selected.length > 0
                                  ? selected.join(', ')
                                  : 'No Users Selected' // Display selected usernames or a default message
                              }}
                            >
                              {Array.isArray(item.users) &&
                                item.users.map((user) => (
                                  <MenuItem key={user._id} value={user.username}>
                                    {user.username}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        ) : (
                          item[column.accessor] // Default rendering for other columns
                        )}
                      </CTableDataCell>
                    ))}
                    <CTableDataCell className="text-center d-flex">
                      <IconButton aria-label="edit" onClick={() => handleEditIconClick(item)}>
                        <RiEdit2Fill
                          style={{ fontSize: '20px', color: 'lightBlue', margin: '2px' }}
                        />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteSelected(item._id)}
                        sx={{ marginRight: '10px', color: 'brown' }}
                      >
                        <AiFillDelete style={{ fontSize: '20px' }} />
                      </IconButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ height: '200px' }}
                    >
                      <p className="mb-0 fw-bold">
                        "Oops! Looks like there's no device available.
                        <br /> Maybe it's time to create some awesome device!"
                      </p>
                      <div>
                        <button
                          onClick={() => setAddModalOpen(true)}
                          variant="contained"
                          className="btn btn-primary m-3 text-white"
                        >
                          <span>
                            <IoMdAdd className="fs-5" />
                          </span>{' '}
                          Add User
                        </button>
                      </div>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        )}
      </TableContainer>

      <Modal open={addModalOpen} onClose={handleModalClose}>
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Typography variant="h6" className="text-dark">
              Add Device
            </Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Map through columns for dynamic form rendering */}
          {columns.map((col) => {
            if (col.accessor === '_id') {
              return null
            } else if (col.accessor === 'extenddate') {
              return null
            } else if (col.accessor === 'groups') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>Group ID</InputLabel>
                  <Select
                    name="groups"
                    value={formData.groups || []}
                    onChange={handleInputChange}
                    label="Group ID"
                    multiple // Allows multiple selections for groups
                  >
                    {groups.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'Driver') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>Driver</InputLabel>
                  <Select
                    name="Driver"
                    value={formData.Driver || ''}
                    onChange={handleInputChange}
                    label="Driver"
                  >
                    {drivers.map((driver) => (
                      <MenuItem key={driver._id} value={driver._id}>
                        {driver.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'users') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>User</InputLabel>
                  <Select
                    name="users"
                    value={formData.users || []}
                    onChange={handleInputChange}
                    label="User"
                    multiple // Allow multiple user selections
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'geofences') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id="areas-label-5">Areas</InputLabel>
                  <Select
                    labelId="areas-label-5"
                    id="areas-select-5"
                    name="areas" // Add name attribute here
                    value={formData.areas || ''}
                    onChange={handleInputChange}
                    label="Select Areas"
                  >
                    <MenuItem value="All Areas">All Areas</MenuItem>
                    {areas.map((area, index) => (
                      <MenuItem key={index} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'category') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key="category">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category.categoryName}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'model') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key="model">
                  <InputLabel>Model</InputLabel>
                  <Select
                    name="model"
                    value={formData.model || ''}
                    onChange={handleInputChange}
                    label="Model"
                  >
                    {models.map((model) => (
                      <MenuItem key={model._id} value={model.modelName}>
                        {model.modelName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'installationdate') {
              return (
                <TextField
                  key="installationdate"
                  label="Installation Date"
                  type="date"
                  name="installationdate"
                  value={formData.installationdate || ''}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ marginBottom: 2 }}
                />
              )
            }
            // else if (col.accessor === 'expirationdate') {
            //   return (
            //     <TextField
            //       key="expirationdate"
            //       label="Expiration Date"
            //       type="date"
            //       name="expirationdate"
            //       value={formData.expirationdate || ''}
            //       onChange={handleInputChange}
            //       fullWidth
            //       InputLabelProps={{ shrink: true }}
            //       sx={{ marginBottom: 2 }}
            //     />
            //   );
            // }
            else if (col.accessor === 'expirationdate') {
              // Expiration Date field with dropdown for years (1, 2, 3 years)
              return (
                <Box key={col.accessor} sx={{ marginBottom: 2 }}>
                  {/* Expiration Date TextField */}
                  <TextField
                    label="Expiration Date"
                    type="date"
                    name="expirationdate"
                    value={formData.expirationdate || ''}
                    onChange={handleInputChange}
                    onFocus={() => setShowExpirationDropdown(true)} // Show dropdown on focus
                    fullWidth
                    InputLabelProps={{
                      shrink: true, // Ensures the label is always visible
                    }}
                  />

                  {/* Dropdown for selecting 1 year, 2 years, or 3 years */}
                  {showExpirationDropdown && (
                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                      <InputLabel>Expiration Options</InputLabel>
                      <Select
                        value=""
                        onChange={(e) => {
                          handleYearSelection(parseInt(e.target.value))
                          setShowExpirationDropdown(false) // Hide dropdown after selection
                        }}
                        label="Expiration Options"
                      >
                        <MenuItem value={1}>1 Year</MenuItem>
                        <MenuItem value={2}>2 Years</MenuItem>
                        <MenuItem value={3}>3 Years</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              )
            } else {
              // Default field for any other column
              return (
                <TextField
                  key={col.accessor}
                  label={col.Header}
                  variant="outlined"
                  name={col.accessor}
                  value={formData[col.accessor] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              )
            }
          })}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSubmit}
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <Modal open={editModalOpen} onClose={handleModalClose}>
        <Box sx={style}>
          <div className="d-flex justify-content-between my-3">
            <Typography variant="h6" className="text-dark">
              Edit Device
            </Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* Conditional rendering based on col.accessor */}
          {columns.map((col) => {
            if (col.accessor === '_id') {
              return null
            } else if (col.accessor === 'extenddate') {
              return null
            } else if (col.accessor === 'groups') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>Group ID</InputLabel>
                  <Select
                    name="groups"
                    value={formData.groups || []}
                    onChange={handleInputChange}
                    label="Group ID"
                    multiple // Allows multiple selections for groups
                  >
                    {groups.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'Driver') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>Driver</InputLabel>
                  <Select
                    name="Driver"
                    value={formData.Driver || ''}
                    onChange={handleInputChange}
                    label="Driver"
                  >
                    {drivers.map((driver) => (
                      <MenuItem key={driver._id} value={driver._id}>
                        {driver.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'users') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>User</InputLabel>
                  <Select
                    name="users"
                    value={formData.users || []}
                    onChange={handleInputChange}
                    label="User"
                    multiple // Allow multiple user selections
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'geofences') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id="areas-label-5">Areas</InputLabel>
                  <Select
                    labelId="areas-label-5"
                    id="areas-select-5"
                    name="areas" // Add name attribute here
                    value={formData.areas || ''}
                    onChange={handleInputChange}
                    label="Select Areas"
                  >
                    <MenuItem value="All Areas">All Areas</MenuItem>
                    {areas.map((area, index) => (
                      <MenuItem key={index} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'category') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key="category">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category.categoryName}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'model') {
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key="model">
                  <InputLabel>Model</InputLabel>
                  <Select
                    name="model"
                    value={formData.model || ''}
                    onChange={handleInputChange}
                    label="Model"
                  >
                    {models.map((model) => (
                      <MenuItem key={model._id} value={model.modelName}>
                        {model.modelName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'installationdate') {
              return (
                <TextField
                  key="installationdate"
                  label="Installation Date"
                  type="date"
                  name="installationdate"
                  value={formData.installationdate || ''}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ marginBottom: 2 }}
                />
              )
            } else if (col.accessor === 'expirationdate') {
              // Expiration Date field with dropdown for years (1, 2, 3 years)
              return (
                <Box key={col.accessor} sx={{ marginBottom: 2 }}>
                  {/* Expiration Date TextField */}
                  <TextField
                    label="Extended Date"
                    type="date"
                    name="expiration"
                    value={formData.expiration || ''}
                    onChange={handleEditDateInputChange}
                    onFocus={() => setShowExpirationDropdown(true)} // Show dropdown on focus
                    fullWidth
                    InputLabelProps={{
                      shrink: true, // Ensures the label is always visible
                    }}
                  />

                  {/* Dropdown for selecting 1 year, 2 years, or 3 years */}
                  {showExpirationDropdown && (
                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                      <InputLabel>Expiration Options</InputLabel>
                      <Select
                        value=""
                        onChange={(e) => {
                          handleYearSelection(parseInt(e.target.value))
                          setShowExpirationDropdown(false) // Hide dropdown after selection
                        }}
                        label="Expiration Options"
                      >
                        <MenuItem value={1}>1 Year</MenuItem>
                        <MenuItem value={2}>2 Years</MenuItem>
                        <MenuItem value={3}>3 Years</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              )
            } else {
              // Default TextField for other columns
              return (
                <TextField
                  key={col.accessor}
                  label={col.Header}
                  variant="outlined"
                  name={col.accessor}
                  value={formData[col.accessor] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              )
            }
          })}

          <Button
            variant="contained"
            color="primary"
            onClick={handleEditSubmit}
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <Modal open={extendedPasswordModel} onClose={handleModalClose}>
        <Box sx={style} style={{ height: '30%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Typography variant="h6">Enter Password</Typography>
            <IconButton onClick={() => setExtendedPasswordModel(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Conditional rendering based on col.accessor */}
          <input
            type="password"
            name=""
            id=""
            value={extendedPassword}
            onChange={(e) => setExtendedPassword(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckPassword}
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default Devices
