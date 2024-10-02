import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  TableContainer,
  Paper,
  IconButton,
  Typography,
  Button,
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

const Driver = () => {
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
  const [filteredData, setFilteredData] = useState([]) // Your initial data
  const [selectedRow, setSelectedRow] = useState(null)
  const [users, setUsers] = useState([])
  const handleModalClose = () => {
    setEditModalOpen(false)
    setAddModalOpen(false)
  }
  const [areasValue, setAreasValue] = useState('')

  const columns = [
    { Header: 'Device Name', accessor: 'name' },
    { Header: 'IMEI', accessor: 'identifier' },
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
    height: '97%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Enable vertical scrolling
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    margintop: '8px',
  }

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      // Use your token here, ensure it's valid
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4ZTNiYWU4Y2U3ZjhhMDQzZWViOCIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGUzYmFlOGNlN2Y4YTA0M2VlYjgiLCJlbWFpbCI6InZlZGFudEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCR4Z1RtUmdkUGVpeDdFdVlKR0t3Smx1Y3BNNHozOU04dlBZVFNOMWlHUy85b3laR3R0bVFPNiIsInVzZXJuYW1lIjoidmVkYW50IiwiY3JlYXRlZEJ5IjoiNjZmMTFhYTFkOTllZGExYTcyYWI3ODU2Iiwibm90aWZpY2F0aW9uIjpmYWxzZSwiZGV2aWNlcyI6ZmFsc2UsImRyaXZlciI6ZmFsc2UsImdyb3VwcyI6ZmFsc2UsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0IjpmYWxzZSwic3RvcCI6ZmFsc2UsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOmZhbHNlLCJoaXN0b3J5Ijp0cnVlLCJzY2hlZHVsZXJlcG9ydHMiOnRydWUsInN0YXRpc3RpY3MiOnRydWUsImFsZXJ0cyI6dHJ1ZSwic3VtbWFyeSI6dHJ1ZSwiY3VzdG9tQ2hhcnRzIjpmYWxzZSwiX192IjowfSwiaWF0IjoxNzI3MTczNTI0fQ.igpJ7TbnWXj3ki1Gkmy-hXuqwCoyQfvxd3QzR3J8UNE';

      const response = await axios.get('https://credence-tracker.onrender.com/driver/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check for the expected data structure
      if (response.data.drivers && Array.isArray(response.data.drivers)) {
        setData(response.data.drivers);
        setTotalResponses(response.data.pagination.totalDrivers);
      } else {
        console.error('Expected an array but got:', response.data);
        alert('Unexpected data format received.');
      }
    } catch (error) {
      console.error('Fetch data error:', error);
      alert('An error occurred while fetching data: ' + error.message);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };
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
      const apiUrl = 'https://credence-tracker.onrender.com/driver' // Replace with actual API endpoint
      // const username = 'school' // Replace with your actual username
      // const password = '123456' // Replace with your actual password
      // const token = btoa(`${username}:${password}`) // Encode credentials in Base64
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4ZTNiYWU4Y2U3ZjhhMDQzZWViOCIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGUzYmFlOGNlN2Y4YTA0M2VlYjgiLCJlbWFpbCI6InZlZGFudEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCR4Z1RtUmdkUGVpeDdFdVlKR0t3Smx1Y3BNNHozOU04dlBZVFNOMWlHUy85b3laR3R0bVFPNiIsInVzZXJuYW1lIjoidmVkYW50IiwiY3JlYXRlZEJ5IjoiNjZmMTFhYTFkOTllZGExYTcyYWI3ODU2Iiwibm90aWZpY2F0aW9uIjpmYWxzZSwiZGV2aWNlcyI6ZmFsc2UsImRyaXZlciI6ZmFsc2UsImdyb3VwcyI6ZmFsc2UsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0IjpmYWxzZSwic3RvcCI6ZmFsc2UsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOmZhbHNlLCJoaXN0b3J5Ijp0cnVlLCJzY2hlZHVsZXJlcG9ydHMiOnRydWUsInN0YXRpc3RpY3MiOnRydWUsImFsZXJ0cyI6dHJ1ZSwic3VtbWFyeSI6dHJ1ZSwiY3VzdG9tQ2hhcnRzIjpmYWxzZSwiX192IjowfSwiaWF0IjoxNzI3MTczNTI0fQ.igpJ7TbnWXj3ki1Gkmy-hXuqwCoyQfvxd3QzR3J8UNE';
      // Prepare the new row object based on the expected schema
      const newRow = {
        name: formData.name, // Ensure formData has 'name'
        identifier: formData.identifier, // Ensure formData has 'identifier'
      }

      // POST request to the server with Basic Auth
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Add Basic Auth header
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

  const handleDeleteSelected = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4ZTNiYWU4Y2U3ZjhhMDQzZWViOCIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGUzYmFlOGNlN2Y4YTA0M2VlYjgiLCJlbWFpbCI6InZlZGFudEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCR4Z1RtUmdkUGVpeDdFdVlKR0t3Smx1Y3BNNHozOU04dlBZVFNOMWlHUy85b3laR3R0bVFPNiIsInVzZXJuYW1lIjoidmVkYW50IiwiY3JlYXRlZEJ5IjoiNjZmMTFhYTFkOTllZGExYTcyYWI3ODU2Iiwibm90aWZpY2F0aW9uIjpmYWxzZSwiZGV2aWNlcyI6ZmFsc2UsImRyaXZlciI6ZmFsc2UsImdyb3VwcyI6ZmFsc2UsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0IjpmYWxzZSwic3RvcCI6ZmFsc2UsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOmZhbHNlLCJoaXN0b3J5Ijp0cnVlLCJzY2hlZHVsZXJlcG9ydHMiOnRydWUsInN0YXRpc3RpY3MiOnRydWUsImFsZXJ0cyI6dHJ1ZSwic3VtbWFyeSI6dHJ1ZSwiY3VzdG9tQ2hhcnRzIjpmYWxzZSwiX192IjowfSwiaWF0IjoxNzI3MTczNTI0fQ.igpJ7TbnWXj3ki1Gkmy-hXuqwCoyQfvxd3QzR3J8UNE'; // Use your actual token
        // Make sure the URL is correct according to your API setup
        const response = await fetch(`https://credence-tracker.onrender.com/driver/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the raw response to debug issues
        const responseText = await response.text();
        console.log('Response:', responseText);

        // Check if the response is OK
        if (response.ok) {
          setFilteredData(filteredData.filter((item) => item._id !== id)); // Use `_id`
          alert('Record deleted successfully');
        } else {
          console.error('Server responded with:', responseText);
          alert(`Unable to delete record: ${responseText || response.statusText}`);
        }
      } catch (error) {
        console.error('Error during DELETE request:', error);
        alert('Unable to delete record. Please check the console for more details.');
      }
    }
    fetchData();
  };

  const handleEditIconClick = (row) => {
    setSelectedRow(row) // Set the selected row to be edited
    setFormData(row) // Populate form with the row's data
    setEditModalOpen(true) // Open the modal
  }

  const handleEditSubmit = async () => {
    if (!selectedRow) {
      alert('No row selected for editing');
      return;
    }

    const apiUrl = `https://credence-tracker.onrender.com/driver/${selectedRow._id}`; // Use _id for the correct driver ID
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4ZTNiYWU4Y2U3ZjhhMDQzZWViOCIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGUzYmFlOGNlN2Y4YTA0M2VlYjgiLCJlbWFpbCI6InZlZGFudEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCR4Z1RtUmdkUGVpeDdFdVlKR0t3Smx1Y3BNNHozOU04dlBZVFNOMWlHUy85b3laR3R0bVFPNiIsInVzZXJuYW1lIjoidmVkYW50IiwiY3JlYXRlZEJ5IjoiNjZmMTFhYTFkOTllZGExYTcyYWI3ODU2Iiwibm90aWZpY2F0aW9uIjpmYWxzZSwiZGV2aWNlcyI6ZmFsc2UsImRyaXZlciI6ZmFsc2UsImdyb3VwcyI6ZmFsc2UsImNhdGVnb3J5IjpmYWxzZSwibW9kZWwiOmZhbHNlLCJ1c2VycyI6dHJ1ZSwicmVwb3J0IjpmYWxzZSwic3RvcCI6ZmFsc2UsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOmZhbHNlLCJoaXN0b3J5Ijp0cnVlLCJzY2hlZHVsZXJlcG9ydHMiOnRydWUsInN0YXRpc3RpY3MiOnRydWUsImFsZXJ0cyI6dHJ1ZSwic3VtbWFyeSI6dHJ1ZSwiY3VzdG9tQ2hhcnRzIjpmYWxzZSwiX192IjowfSwiaWF0IjoxNzI3MTczNTI0fQ.igpJ7TbnWXj3ki1Gkmy-hXuqwCoyQfvxd3QzR3J8UNE'; // Use your actual token

    // Exclude the 'isSelected' field from formData
    const { isSelected, ...updatedData } = formData;

    try {
      console.log('Sending request to:', apiUrl);
      console.log('Request payload:', JSON.stringify(updatedData, null, 2));

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // Change to Bearer token if needed
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorResult;
        try {
          errorResult = await response.json();
        } catch (error) {
          errorResult = { message: 'Failed to parse error response' };
        }
        console.error('Error response:', errorResult);
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResult.message}`);
      }

      const result = await response.json();
      console.log('Update successful:', result);
      alert('Updated successfully');

      // Update the local state with the modified row data
      const updatedRows = filteredRows.map((row) =>
        row._id === selectedRow._id ? { ...row, ...updatedData } : row, // Ensure you're checking _id
      );
      setFilteredRows(updatedRows);

      handleModalClose();
      fetchData(); // Refetch the data to ensure the UI is up-to-date
    } catch (error) {
      console.error('Error updating row:', error.message, error.stack);
      alert('Error updating data');
    }
    handleModalClose();
  };

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
      <div>
        <div className="d-flex justify-content-between mb-2">
          <div>
            <h2>Drivers</h2>
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
                Add Driver
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

      <TableContainer
        component={Paper}
        sx={{
          height: '800px', // Set the desired height
          overflow: 'auto', // Enable scrollbar when content overflows
        }}
      >
        {loading ? (
          <>
          <div className="text-nowrap mb-2" style={{width: "70vw"}}>
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
                  <CTableDataCell className="text-center d-flex justify-content-center">
                    <IconButton aria-label="edit" onClick={() => handleEditIconClick(item)}>
                      <RiEdit2Fill
                        style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }}
                      />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteSelected(item._id)} // Use item._id instead of item.id
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
    </div>
  )
}
export default Driver;