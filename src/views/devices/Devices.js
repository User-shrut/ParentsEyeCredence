import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [filteredData, setFilteredData] = useState([]); // Your initial data
  const [selectedRow, setSelectedRow] = useState(null);
  const [users, setUsers] = useState([]);
  const [extendedPasswordModel , setExtendedPasswordModel] = useState(false);
  const myPassword = "123456";
  const [extendedPassword , setExtendedPassword] = useState();
  const [passwordCheck ,setPasswordCheck] = useState(false);
  const handleModalClose = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    // setExtendedPasswordModel(false);
    // setFormData({});
  }
  const [areasValue, setAreasValue] = useState('')

  const columns = [
    { Header: 'Device Name', accessor: 'name' },
    { Header: 'Imei No.', accessor: 'uniqueId' },
    { Header: 'Sim', accessor: 'Sim' },
    { Header: 'Speed', accessor: 'Speed' },
    { Header: 'Average', accessor: 'Average' },
    { Header: 'Model', accessor: 'model' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Groups', accessor: 'groupId' },
    { Header: 'User', accessor: 'User' },
    { Header: 'Geofence', accessor: 'geofence' },
    { Header: 'Expiration', accessor: 'expiration' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: "100%",
    bgcolor: "background.paper",
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
      const username = 'hbtrack';
      const password = '123456@';
      const token = btoa(`${username}:${password}`);

      const response = await axios.get('http://104.251.212.84/api/devices', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })

      if (Array.isArray(response.data)) {
        setData(response.data)
        setTotalResponses(response.data.length)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditDateInputChange = (e) => {
    const { name, value } = e.target;
    setExtendedPasswordModel(true);

    if(passwordCheck){
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    

  };

  const handleCheckPassword = () => {
    if(extendedPassword == myPassword){
      setPasswordCheck(true);
      setExtendedPasswordModel(false);
      alert("password is correct")


    }else{
      alert("password is not correct");
    }
  }

 
  const handleAddSubmit = async () => {
    try {
      // Define the API endpoint and credentials
      const apiUrl = "http://104.251.212.84/api/devices"; // Replace with actual API endpoint
      const username = "credenceOCT"; // Replace with your actual username
      const password = "123456"; // Replace with your actual password
      const token = btoa(`${username}:${password}`); // Encode credentials in Base64
  
      // Prepare the new row object based on the expected schema
      const newRow = {
        name: formData.name, // Ensure formData has 'name'
        uniqueId: formData.uniqueId, // Ensure formData has 'uniqueId'
        groupId: formData.groupId, // Ensure formData has 'groupId'
        attributes: formData.attributes || {}, // Ensure formData has 'attributes' (empty object if not provided)
        calendarId: formData.calendarId, // Ensure formData has 'calendarId'
        status: formData.status, // Ensure formData has 'status'
        phone: formData.phone, // Ensure formData has 'phone'
        model: formData.model, // Ensure formData has 'model'
        expirationTime: formData.expirationTime, // Ensure formData has 'expirationTime'
        contact: formData.contact, // Ensure formData has 'contact'
        category: formData.category, // Ensure formData has 'category'
      }

      // POST request to the server with Basic Auth
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${token}`, // Add Basic Auth header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      })

      // Parse the JSON response
      const result = await response.json()

      if (response.ok) {
        // Update the state with the new row
        setFilteredRows([...filteredRows, result])

        // Close the modal and refresh data
        handleModalClose()
        fetchData()

        console.log('Record created successfully:', result)
        alert('Record created successfully')
      } else {
        // Log and alert the specific server response in case of an error
        console.error('Server responded with:', result)
        alert(`Unable to create record: ${result.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error during POST request:', error)
      alert('Unable to create record')
      // Handle the error appropriately (e.g., show a notification to the user)
    }
    fetchData()
  }
  const [groups, setGroups] = useState([])
  // const [error, setError] = useState(null);
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/groups', {
          method: 'GET',
          headers: {
            Authorization: 'Basic ' + btoa('school:123456'), // Replace with actual credentials
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setGroups(data) // Assuming the API returns { groups: [...] }
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
        const response = await fetch('https://rocketsalestracker.com/api/calendars', {
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
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const username = 'school' // Replace with your actual username
        const password = '123456' // Replace with your actual password
        const token = btoa(`${username}:${password}`) // Encode credentials in Base64

        const response = await fetch(`https://rocketsalestracker.com/api/devices/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        })

        if (response.ok) {
          // Update the state to remove the deleted row
          setFilteredData(filteredData.filter((item) => item.id !== id))
          alert('Record deleted successfully')
        } else {
          const result = await response.json()
          console.error('Server responded with:', result)
          alert(`Unable to delete record: ${result.message || response.statusText}`)
        }
      } catch (error) {
        console.error('Error during DELETE request:', error)
        alert('Unable to delete record. Please check the console for more details.')
      }
    }
  }

  const handleEditIconClick = (row) => {
    setSelectedRow(row) // Set the selected row to be edited
    setFormData(row) // Populate form with the row's data
    setEditModalOpen(true) // Open the modal
  }

  const handleEditSubmit = async () => {
    if (!selectedRow) {
      alert('No row selected for editing')
      return
    }

    const apiUrl = `https://rocketsalestracker.com/api/devices/${selectedRow.id}`
    const username = 'school'
    const password = '123456'
    const token = btoa(`${username}:${password}`)

    // Exclude the 'isSelected' field from formData
    const { isSelected, ...updatedData } = formData

    try {
      console.log('Sending request to:', apiUrl)
      console.log('Request payload:', JSON.stringify(updatedData, null, 2))

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorResult = await response.json()
        console.error('Error response:', errorResult)
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResult.message}`)
      }

      const result = await response.json()
      console.log('Update successful:', result)
      alert('Updated successfully')

      // Update the local state with the modified row data
      const updatedRows = filteredRows.map((row) =>
        row.id === selectedRow.id ? { ...row, ...updatedData } : row,
      )
      setFilteredRows(updatedRows)

      handleModalClose()
      fetchData() // Refetch the data to ensure the UI is up-to-date
    } catch (error) {
      console.error('Error updating row:', error.message, error.stack)
      alert('Error updating data')
    }
    handleModalClose()
  }

  const [dropdownOptions, setDropdownOptions] = useState([])
  const [areas, setAreas] = useState([])
  useEffect(() => {
    const fetchAreasData = async () => {
      try {
        const username = 'hbtrack' // Replace with your actual username
        const password = '123456@' // Replace with your actual password
        const token = btoa(`${username}:${password}`) // Base64 encode the username and password

        const response = await fetch('http://104.251.212.84/api/geofences', {
          method: 'GET',
          headers: {
            Authorization: `Basic ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        console.log('Geofence data: ', data)

        // Transform data to create dropdown options
        setAreas(data.map((item) => item.name))
      } catch (error) {
        console.error('Error fetching areas data:', error)
        setError(error.message)
      }
    }

    fetchAreasData()
  }, [])

  const fetchUsers = async () => {
    console.log('Fetching users...')
    try {
      const username = 'hbtrack'
      const password = '123456@'
      const token = btoa(`${username}:${password}`)

      const response = await axios.get('http://104.251.212.84/api/users', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })

      console.log('Fetched users:', response.data)

      if (Array.isArray(response.data)) {
        setUsers(response.data.map((user) => ({ id: user.id, name: user.name })))
      } else {
        console.error('Expected an array but got:', response.data)
      }
    } catch (error) {
      console.error('Fetch users error:', error)
      alert('An error occurred while fetching users.')
    }
  }

  // Fetch users on component mount
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

  return (
    <div className='m-3'>
      

      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Devices</h2>
        </div>

        <div className="d-flex">
          <div className="me-3">
            <input
              type="search"
              className="form-control"
              placeholder="search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => setAddModalOpen(true)}
              variant="contained"
              className="btn btn-success text-white"
            >
              Add Device
            </button>
          </div>
        </div>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          height: '500px', // Set the desired height
          overflow: 'auto', // Enable scrollbar when content overflows
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                {columns.map((column, index) => (
                  <CTableHeaderCell key={index} className="bg-body-tertiary text-center">
                    {column.Header}
                  </CTableHeaderCell>
                ))}
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.map((item, index) => (
                <CTableRow key={index}>
                  {columns.map((column, i) => (
                    <CTableDataCell key={i} className="text-center">
                      {item[column.accessor]}
                    </CTableDataCell>
                  ))}
                  <CTableDataCell className="text-center d-flex">
                    <IconButton aria-label="edit" onClick={() => handleEditIconClick(item)}>
                      <RiEdit2Fill
                        style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }}
                      />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteSelected(item.id)} // Pass the item's unique ID to handleDeleteSelected
                      sx={{ marginRight: '10px', color: 'brown' }}
                    >
                      <AiFillDelete style={{ fontSize: '25px' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
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
            <Typography variant="h6" className='text-dark'>Add Device</Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Conditional rendering based on col.accessor */}
          {columns.map((col) => {
            if (col.accessor === 'groupId') {
              // Group ID dropdown
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>Group ID</InputLabel>
                  <Select
                    name="groupId"
                    value={formData.groupId || ''}
                    onChange={handleInputChange}
                    label="Group ID"
                  >
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'User') {
              // User dropdown
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>User</InputLabel>
                  <Select
                    name="user"
                    value={formData.user || ''}
                    onChange={handleInputChange}
                    label="User"
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'category') {
              // Category dropdown
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="Default">Default</MenuItem>
                    <MenuItem value="Animal">Animal</MenuItem>
                    <MenuItem value="Bicycle">Bicycle</MenuItem>
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'geofence') {
              // Geofence dropdown (Areas)
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel id="areas-label-5">Areas</InputLabel>
                  <Select
                    labelId="areas-label-5"
                    id="areas-select-5"
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
            } else if (col.accessor === 'model') {
              // Model dropdown with options v1, v2, v3, v4, v5
              return (
                <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                  <InputLabel>Model</InputLabel>
                  <Select
                    name="model"
                    value={formData.model || ''}
                    onChange={handleInputChange}
                    label="Model"
                  >
                    <MenuItem value="v1">v1</MenuItem>
                    <MenuItem value="v2">v2</MenuItem>
                    <MenuItem value="v3">v3</MenuItem>
                    <MenuItem value="v4">v4</MenuItem>
                    <MenuItem value="v5">v5</MenuItem>
                  </Select>
                </FormControl>
              )
            } else if (col.accessor === 'expiration') {
              // Expiration Date field with dropdown for years (1, 2, 3 years)
              return (
                <Box key={col.accessor} sx={{ marginBottom: 2 }}>
                  {/* Expiration Date TextField */}
                  <TextField
                    label="Expiration Date"
                    type="date"
                    name="expiration"
                    value={formData.expiration || ''}
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
       if (col.accessor === "groupId") {
        // Group ID dropdown
        return (
          <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
            <InputLabel>Group ID</InputLabel>
            <Select
              name="groupId"
              value={formData.groupId || ""}
              onChange={handleInputChange}
              label="Group ID"
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      } else if (col.accessor === 'User') {
        // User dropdown
        return (
          <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
            <InputLabel>User</InputLabel>
            <Select
              name="user"
              value={formData.user || ''}
              onChange={handleInputChange}
              label="User"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      } else if (col.accessor === "category") {
        // Category dropdown
        return (
          <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category || ""}
              onChange={handleInputChange}
              label="Category"
            >
              <MenuItem value="Default">Default</MenuItem>
              <MenuItem value="Animal">Animal</MenuItem>
              <MenuItem value="Bicycle">Bicycle</MenuItem>
            </Select>
          </FormControl>
        );
      } else if (col.accessor === "geofence") {
        // Geofence dropdown (Areas)
        return (
          <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
            <InputLabel id="areas-label-5">Areas</InputLabel>
            <Select
              labelId="areas-label-5"
              id="areas-select-5"
              value={formData.areas || ""}
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
        );
      } else if (col.accessor === "model") {
        // Model dropdown with options v1, v2, v3, v4, v5
        return (
          <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
            <InputLabel>Model</InputLabel>
            <Select
              name="model"
              value={formData.model || ""}
              onChange={handleInputChange}
              label="Model"
            >
              <MenuItem value="v1">v1</MenuItem>
              <MenuItem value="v2">v2</MenuItem>
              <MenuItem value="v3">v3</MenuItem>
              <MenuItem value="v4">v4</MenuItem>
              <MenuItem value="v5">v5</MenuItem>
            </Select>
          </FormControl>
        );
      } else if (col.accessor === "expiration") {
        // Expiration Date field with dropdown for years (1, 2, 3 years)
        return (
          <Box key={col.accessor} sx={{ marginBottom: 2 }}>
            {/* Expiration Date TextField */}
            <TextField
              label="Extended Date"
              type="date"
              name="expiration"
              value={formData.expiration || ""}
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
  <Box sx={style} style={{height:'30%'}}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <Typography variant="h6">Enter Password</Typography>
      <IconButton onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </Box>

    {/* Conditional rendering based on col.accessor */}
      <input type="password" name="" id="" value={extendedPassword} onChange={(e) => setExtendedPassword(e.target.value)} />

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
