import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
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
  FormGroup,
  FormControlLabel,
  Checkbox,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import CloseIcon from '@mui/icons-material/Close'
import { ExpandMoreOutlined } from '@mui/icons-material'
// import "./table.css";
// import { FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
const getStatusColor = (status) => (status === 'online' ? 'green' : 'red')

const Users = () => {
  const [open, setOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false) // Modal for adding a new row
  const [formData, setFormData] = useState({}) // Form data state
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalResponses, setTotalResponses] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const [filteredRows, setFilteredRows] = useState([])
  // const handleModalClose = () => setAddModalOpen(false);
  const [filteredData, setFilteredData] = useState([]) // Your initial data
  const [selectedRow, setSelectedRow] = useState(null)
  const [locationOpen, setLocationOpen] = useState(false)
  const [permissionOpen, setPermissionOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [attributesOpen, setAttributesOpen] = useState(false)
  const handleModalClose = () => {
    setEditModalOpen(false)
    setAddModalOpen(false)
    // setFormData({});
  }
  // const [editModalOpen, setEditModalOpen] = useState(false);
  // const [formData, setFormData] = useState({});
  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Password',
      accessor: 'password',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Custom Map',
      accessor: 'attributes.custommap',
    },
    {
      Header: 'Custom Overlay',
      accessor: 'attributes.customoverlay',
    },
    {
      Header: 'Default Map',
      accessor: 'map',
    },
    {
      Header: 'Coordinate Format',
      accessor: 'coordinateFormat',
    },
    {
      Header: 'Speed Unit',
      accessor: 'attributes.speedUnit',
    },
    {
      Header: 'Altitude',
      accessor: 'attributes.altitudeUnit',
    },
    {
      Header: 'Volume',
      accessor: 'attributes.volumeUnit',
    },
    {
      Header: 'Time',
      accessor: 'attributes.time',
    },
    {
      Header: 'Default Map',
      accessor: 'map',
    },

    {
      Header: 'Speed',
      accessor: 'attributes.speed',
    },
    {
      Header: 'Distance',
      accessor: 'attributes.distance',
    },

    {
      Header: 'Time',
      accessor: 'attributes.time',
    },
    {
      Header: 'Location',
      accessor: 'attributes.loc',
    },
    {
      Header: 'Permission',
      accessor: 'attributes.per',
    },
    { Header: 'File', accessor: 'attributes.file' },
    {
      Header: 'All Attri',
      accessor: 'attributes.attri',
    },

    {
      Header: 'Phone',
      accessor: 'phone',
    },
    // {
    //   Header: 'Timezone',
    //   accessor: 'attributes.timezone',
    // },
    {
      Header: 'POI Layer',
      accessor: 'attributes.poi',
    },
    {
      Header: 'Announcement',
      accessor: 'attributes.announce',
    },

    {
      Header: 'Registration',
      accessor: 'registration',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Read Only',
      accessor: 'readonly',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Device Read Only',
      accessor: 'deviceReadonly',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Map Type',
      accessor: 'map',
    },
    {
      Header: 'Latitude',
      accessor: 'latitude',
      Cell: ({ value }) => value.toFixed(5),
    },
    {
      Header: 'Longitude',
      accessor: 'longitude',
      Cell: ({ value }) => value.toFixed(5),
    },
    {
      Header: 'Zoom',
      accessor: 'zoom',
    },
    {
      Header: '12-Hour Format',
      accessor: 'twelveHourFormat',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Force Settings',
      accessor: 'forceSettings',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },

    {
      Header: 'Limit Commands',
      accessor: 'limitCommands',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Disable Reports',
      accessor: 'disableReports',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Fixed Email',
      accessor: 'fixedEmail',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'POI Layer',
      accessor: 'poiLayer',
    },
    {
      Header: 'Announcement',
      accessor: 'announcement',
    },
    {
      Header: 'Email Enabled',
      accessor: 'emailEnabled',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Geocoder Enabled',
      accessor: 'geocoderEnabled',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Text Enabled',
      accessor: 'textEnabled',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Storage Space',
      accessor: 'storageSpace',
      // Cell: ({ value }) => value.map(v => (v / (1024 ** 3)).toFixed(2) + ' GB').join(', '),
      Cell: ({ value }) =>
        Array.isArray(value)
          ? value.map((v) => (v / 1024 ** 3).toFixed(2) + ' GB').join(', ')
          : 'N/A',
    },
    {
      Header: 'New Server',
      accessor: 'newServer',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Open ID Enabled',
      accessor: 'openIdEnabled',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Open ID Force',
      accessor: 'openIdForce',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Version',
      accessor: 'version',
    },

    {
      Header: 'Expiration Time',
      accessor: 'expirationTime',
      Cell: ({ value }) => {
        if (!value) return 'N/A'
        const date = new Date(value)
        return date.toLocaleDateString() // Format as MM/DD/YYYY or your locale's format
      },
    },

    {
      Header: 'TOTP Key',
      accessor: 'totpKey',
    },
    {
      Header: 'Temporary',
      accessor: 'temporary',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    // {
    //   Header: 'Password',
    //   accessor: 'password',
    // },
    {
      Header: 'Address',
      accessor: 'attributes.address',
    },
    // {
    //   Header: 'Timezone',
    //   accessor: 'attributes.timezone',
    // },
    {
      Header: 'Company',
      accessor: 'attributes.company',
    },
    {
      Header: 'Map Follow',
      accessor: 'attributes.mapFollow',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Map Live Routes',
      accessor: 'attributes.mapLiveRoutes',
    },
    {
      Header: 'Map Direction',
      accessor: 'attributes.mapDirection',
    },
    // {
    //   Header: 'Speed Unit',
    //   accessor: 'attributes.speedUnit',
    // },
    {
      Header: 'Active Map Styles',
      accessor: 'attributes.activeMapStyles',
    },
    {
      Header: 'Device Secondary',
      accessor: 'attributes.deviceSecondary',
    },
    {
      Header: 'Sound Events',
      accessor: 'attributes.soundEvents',
    },
    {
      Header: 'Sound Alarms',
      accessor: 'attributes.soundAlarms',
    },
    {
      Header: 'Position Items',
      accessor: 'attributes.positionItems',
    },
    // {
    //   Header: 'Admin',
    //   accessor: 'administrator',
    //   Cell: ({ value }) => (value === true || value === "true" ? 'Yes' : 'No'),

    // },
    // {
    //   Header: 'Disable',
    //   accessor: 'disabled',
    //   Cell: ({ value }) => (value === true || value === "true" ? 'Yes' : 'No'),

    // }
    {
      Header: 'Admin',
      accessor: 'administrator',
      Cell: ({ value }) => {
        console.log('Administrator value:', value) // Log to see if value exists
        return value ? 'Yes' : 'No'
      },
    },
    {
      Header: 'Disable',
      accessor: 'disabled',
      Cell: ({ value }) => {
        console.log('Disabled value:', value) // Log to see if value exists
        return value ? 'Yes' : 'No'
      },
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35%',
    height: 'auto',
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
      const username = 'hbtrack'
      const password = '123456@'
      const token = btoa(`${username}:${password}`)

      const response = await axios.get('http://104.251.212.84/api/users', {
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
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleAddSubmit = async () => {
    try {
      // Define the API endpoint and credentials
      const apiUrl = 'https://rocketsalestracker.com/api/devices' // Replace with actual API endpoint
      const username = 'school' // Replace with your actual username
      const password = '123456' // Replace with your actual password
      const token = btoa(`${username}:${password}`) // Encode credentials in Base64

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

  // const handleDeleteSelected = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this record?')) {
  //     try {
  //       const username = 'school' // Replace with your actual username
  //       const password = '123456' // Replace with your actual password
  //       const token = btoa(`${username}:${password}`) // Encode credentials in Base64

  //       const response = await fetch(`https://rocketsalestracker.com/api/devices/${id}`, {
  //         method: 'DELETE',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Basic ${token}`,
  //         },
  //       })

  //       if (response.ok) {
  //         // Update the state to remove the deleted row
  //         setFilteredData(filteredData.filter((item) => item.id !== id))
  //         alert('Record deleted successfully')
  //       } else {
  //         const result = await response.json()
  //         console.error('Server responded with:', result)
  //         alert(`Unable to delete record: ${result.message || response.statusText}`)
  //       }
  //     } catch (error) {
  //       console.error('Error during DELETE request:', error)
  //       alert('Unable to delete record. Please check the console for more details.')
  //     }
  //   }
  // }
  // const handleEditSubmit = () => {
  //   // setEditModalOpen(true);
  // };

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

    const apiUrl = `http://104.251.212.84/api/users/${selectedRow.id}`
    const username = 'credenceOCT'
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

  const handlePageClick = async (e) => {
    console.log(e)
    setLoading(true) // Start loading
    try {
      const username = 'hbtrack'
      const password = '123456@'
      const token = btoa(`${username}:${password}`)

      const response = await axios.get('http://104.251.212.84/api/users', {
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

  return (
    <>
      <div className="mx-md-3 mt-3">
        <div>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <h2>Users</h2>
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
                  className="btn btn-success text-white"
                >
                  Add User
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
        </div>

        {loading ? (
          <>
            <div className="text-nowrap mb-2">
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
          <CTable align="middle" className="mb-2 border min-vh-25" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                {columns
                  .filter((column) =>
                    ['id', 'name', 'email', 'administrator', 'disabled', 'expirationTime'].includes(
                      column.accessor,
                    ),
                  )
                  .map((column, index) => (
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
              {filteredData.slice(1, 20).map((item, index) => (
                <CTableRow key={index}>
                  {columns
                    .filter((column) =>
                      [
                        'id',
                        'name',
                        'email',
                        'administrator',
                        'disabled',
                        'expirationTime',
                      ].includes(column.accessor),
                    )
                    .map((column, i) => (
                      <CTableDataCell key={i} className="text-center p-0">
                        {item[column.accessor]}
                      </CTableDataCell>
                    ))}
                  <CTableDataCell className="text-center d-flex">
                    <IconButton aria-label="edit" onClick={() => handleEditIconClick(item)}>
                      <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue' }} />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteSelected(item.id)}
                      sx={{ color: 'brown' }}
                    >
                      <AiFillDelete style={{ fontSize: '25px' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={10}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
        />
      </div>
      {/* <Modal open={addModalOpen} onClose={handleModalClose}>
  <Box sx={style}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <Typography variant="h6">Add Device</Typography>
      <IconButton onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </Box>

    {/* Group ID dropdown 
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
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

    {/* Calendar ID dropdown 
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel>Calendar ID</InputLabel>
      <Select
        name="calendarId"
        value={formData.calendarId || ''}
        onChange={handleInputChange}
        label="Calendar ID"
      >
        {calendars.map((calendar) => (
          <MenuItem key={calendar.id} value={calendar.id}>
            {calendar.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Other fields like Name, Unique ID, etc 
    {columns.slice(3, -1).map((col) => (
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
    ))}

    <Button
      variant="contained"
      color="primary"
      onClick={handleAddSubmit}
      sx={{ marginTop: 2 }}
    >
      Submit
    </Button>
  </Box>
</Modal> */}
      <Modal open={addModalOpen} onClose={handleModalClose}>
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" sx={{ color: 'black' }} component="h2">
              Add User
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>

          {/* Mapping through columns and rendering specific inputs for each accessor */}

          <TextField
            label={'User Name'}
            variant="outlined"
            name={'name'}
            onChange={handleInputChange}
            sx={{ marginBottom: '10px' }}
            fullWidth
          />
          <TextField
            label={'Email Address'}
            variant="outlined"
            name={'name'}
            onChange={handleInputChange}
            sx={{ marginBottom: '10px' }}
            fullWidth
          />
          <TextField
            label={'Password'}
            variant="outlined"
            name={'name'}
            onChange={handleInputChange}
            sx={{ marginBottom: '10px' }}
            fullWidth
          />

          <Typography id="modal-modal-title" sx={{ color: 'black', marginTop: "15px" }} component="h4">
            Permissions
          </Typography>

          <FormControlLabel
            sx={{ color: 'black' }}
            control={<Checkbox defaultChecked />}
            label="Admin"
          />

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Master
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup sx={{ color: 'black' }}>
                <FormControlLabel control={<Checkbox />} label="User" />
                <FormControlLabel control={<Checkbox />} label="Groups" />
                <FormControlLabel control={<Checkbox />} label="Devices" />
                <FormControlLabel control={<Checkbox />} label="Geofence" />
                <FormControlLabel control={<Checkbox />} label="Drivers" />
                <FormControlLabel control={<Checkbox />} label="Maintainance" />
                <FormControlLabel control={<Checkbox />} label="Notification" />
                <FormControlLabel control={<Checkbox />} label="Preferences" />
              </FormGroup>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Reports
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup sx={{ color: 'black' }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="History" />
                <FormControlLabel control={<Checkbox />} label="Stops" />
                <FormControlLabel control={<Checkbox />} label="Trips" />
                <FormControlLabel control={<Checkbox />} label="Statistics" />
                <FormControlLabel control={<Checkbox />} label="Combine Reports" />
                <FormControlLabel control={<Checkbox />} label="Custom Reports" />
                <FormControlLabel control={<Checkbox />} label="Alert" />
                <FormControlLabel control={<Checkbox />} label="Summary" />
                <FormControlLabel control={<Checkbox />} label="Schedule Reports" />
                <FormControlLabel control={<Checkbox />} label="Geofence Reports" />
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Submit button */}
          <Button
            variant="contained"
            color="primary"
            // onClick={handleAddSubmit}
            sx={{ marginTop: '20px' }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <Modal open={editModalOpen} onClose={handleModalClose}>
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Typography variant="h6" sx={{color: "black"}}>Edit User</Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label={'User Name'}
            variant="outlined"
            name={'name'}
            onChange={handleInputChange}
            sx={{ marginBottom: '10px' }}
            fullWidth
          />
          <TextField
            label={'Email Address'}
            variant="outlined"
            name={'name'}
            onChange={handleInputChange}
            sx={{ marginBottom: '10px' }}
            fullWidth
          />
          <TextField
            label={'Password'}
            variant="outlined"
            name={'name'}
            onChange={handleInputChange}
            sx={{ marginBottom: '10px' }}
            fullWidth
          />

          <Typography id="modal-modal-title" sx={{ color: 'black', marginTop: "15px" }} component="h4">
            Permissions
          </Typography>

          <FormControlLabel
            sx={{ color: 'black' }}
            control={<Checkbox defaultChecked />}
            label="Admin"
          />

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Master
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup sx={{ color: 'black' }}>
                <FormControlLabel control={<Checkbox />} label="User" />
                <FormControlLabel control={<Checkbox />} label="Groups" />
                <FormControlLabel control={<Checkbox />} label="Devices" />
                <FormControlLabel control={<Checkbox />} label="Geofence" />
                <FormControlLabel control={<Checkbox />} label="Drivers" />
                <FormControlLabel control={<Checkbox />} label="Maintainance" />
                <FormControlLabel control={<Checkbox />} label="Notification" />
                <FormControlLabel control={<Checkbox />} label="Preferences" />
              </FormGroup>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Reports
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup sx={{ color: 'black' }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="History" />
                <FormControlLabel control={<Checkbox />} label="Stops" />
                <FormControlLabel control={<Checkbox />} label="Trips" />
                <FormControlLabel control={<Checkbox />} label="Statistics" />
                <FormControlLabel control={<Checkbox />} label="Combine Reports" />
                <FormControlLabel control={<Checkbox />} label="Custom Reports" />
                <FormControlLabel control={<Checkbox />} label="Alert" />
                <FormControlLabel control={<Checkbox />} label="Summary" />
                <FormControlLabel control={<Checkbox />} label="Schedule Reports" />
                <FormControlLabel control={<Checkbox />} label="Geofence Reports" />
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Submit button */}
          <Button
            variant="contained"
            color="primary"
            // onClick={handleAddSubmit}
            sx={{ marginTop: '20px' }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  )
}

export default Users
