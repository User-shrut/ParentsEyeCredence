import React, { useState, useEffect } from 'react'
import {
  TableContainer,
  Paper,
  IconButton,
  Typography,
  TextField,
  Button,
  Modal,
  Box,
  FormControl,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import Loader from '../../components/Loader/Loader'
import Cookies from 'js-cookie'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { IoMdAdd } from 'react-icons/io'

// Base API URL for CRUD operations

const API_URL = `${import.meta.env.VITE_API_URL}/category`;


const Category = () => {
  const [data, setData] = useState([]) // Data from API
  const [filteredData, setFilteredData] = useState([]) // Data after filtering
  const [searchQuery, setSearchQuery] = useState('') // Search input state
  const [addModalOpen, setAddModalOpen] = useState(false) // State for add modal open/close
  const [editModalOpen, setEditModalOpen] = useState(false) // State for edit modal open/close
  const [formData, setFormData] = useState({}) // Form data state
  const [currentItemId, setCurrentItemId] = useState(null) // ID of the item being edited
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [filteredRows, setFilteredRows] = useState([])
  const token = Cookies.get('authToken') // token
  // const [loading, setLoading] = useState(false)
  // Common headers for all API requests
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  //get
  const fetchData = async () => {
    setLoading(true) // Start loading
    try {
      const response = await axios.get(API_URL, { headers })
      setData(response.data)
      setFilteredData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false) // Stop loading once data is fetched
    }

    //   setData(response.data); // Set the fetched data
    //   setFilteredData(response.data); // Set the filtered data initially
    //   console.log(response.data)
    // } catch (error) {
    //   console.error('Error fetching data:', error.response ? error.response.data : error.message);
    // } finally {
    //   setLoading(false); // Stop loading once data is fetched
    // }
  }

  useEffect(() => {
    fetchData() // Call fetchData when the component mounts
  }, [])

  // Handle search query change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchQuery(value)
    filterData(value)
  }

  // Filter data based on search query
  const filterData = (query) => {
    const lowerCaseQuery = query.toLowerCase()
    const filtered = data.filter((item) => item.categoryName.toLowerCase().includes(lowerCaseQuery))
    setFilteredData(filtered)
  }

  // Handle modal open for adding
  const handleAddModalOpen = () => {
    setAddModalOpen(true)
    setFormData({}) // Reset form data
  }

  // Handle modal close for adding
  const handleAddModalClose = () => {
    setAddModalOpen(false)
    setFormData({}) // Reset form data
  }

  // Handle modal open for editing
  const handleEditModalOpen = (item) => {
    setFormData({ categoryName: item.categoryName })
    setCurrentItemId(item._id)
    setEditModalOpen(true)
    setFormData({}) // Reset form data
  }

  // Handle modal close for editing
  const handleEditModalClose = () => {
    setEditModalOpen(false)
    setFormData({}) // Reset form data
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Post
  const handleAddSubmit = async (e) => {
    e.preventDefault()

    try {
      // Send POST request to API_URL
      const response = await axios.post(API_URL, formData, { headers })
      setData((prevData) => [...prevData, response.data])
      setFilteredData((prevFilteredData) => [...prevFilteredData, response.data])

      fetchData() // Ensure the data is refreshed

      toast.success('Successfully Added Category!') // Show success alert
      handleAddModalClose() // Close add modal on success
    } catch (error) {
      console.error('Error adding category via axios:', error)
      toast.error('Error adding category  .') // Show error alert for axios request
    }


    const handleEditIconClick = (row) => {
      setSelectedRow(row) // Set the selected row to be edited
      setFormData({ categoryName: row.categoryName }) // Populate form with the row's data
      setEditModalOpen(true) // Open the modal
    }

    //edit
    const handleEditSubmit = async (e) => {
      e.preventDefault() // Prevent the default form submission
      if (!selectedRow) {
        toast.error('No row selected for editing')
        return
      }

      // Use _id instead of id if that's your identifier

      const apiUrl = `${import.meta.env.VITE_API_URL}/category/${selectedRow._id}`;

      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGM1ZjI4M2Q4ODRkM2E0M2U3MjMiLCJlbWFpbCI6Inlhc2hAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQkh6dDZ1NGJwNE01S3hZYXA5U2xYdTQ3clVidUtsVlQvSlFWUkxEbHFQcVY4L1A3OTlXb2kiLCJ1c2VybmFtZSI6Inlhc2giLCJjcmVhdGVkQnkiOiI2NmYyODQ3MGRlOGRkZTA1Zjc0YTdkOTgiLCJub3RpZmljYXRpb24iOmZhbHNlLCJkZXZpY2VzIjpmYWxzZSwiZHJpdmVyIjpmYWxzZSwiZ3JvdXBzIjpmYWxzZSwiY2F0ZWdvcnkiOmZhbHNlLCJtb2RlbCI6ZmFsc2UsInVzZXJzIjp0cnVlLCJyZXBvcnQiOmZhbHNlLCJzdG9wIjpmYWxzZSwidHJpcHMiOnRydWUsImdlb2ZlbmNlIjpmYWxzZSwibWFpbnRlbmFuY2UiOmZhbHNlLCJwcmVmZXJlbmNlcyI6ZmFsc2UsImNvbWJpbmVkUmVwb3J0cyI6ZmFsc2UsImN1c3RvbVJlcG9ydHMiOmZhbHNlLCJoaXN0b3J5IjpmYWxzZSwic2NoZWR1bGVyZXBvcnRzIjpmYWxzZSwic3RhdGlzdGljcyI6ZmFsc2UsImFsZXJ0cyI6ZmFsc2UsInN1bW1hcnkiOmZhbHNlLCJjdXN0b21DaGFydHMiOmZhbHNlLCJfX3YiOjB9LCJpYXQiOjE3MjcxNzQzMjh9.mZcaQCnOwFXUm4E91VIzo2txOxV9OQs06rZ9wgV1-V8'; // Ensure the token is correct

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

        if (!response.ok) {
          const errorResult = await response.json()
          console.error('Error response:', errorResult)
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResult.message}`)
        }

        const result = await response.json()
        console.log('Update successful:', result)
        toast.success('Successfully Edited Category!')

        // Update the local state with the modified row data
        const updatedRows = filteredRows.map((row) =>
          row._id === selectedRow._id ? { ...row, ...updatedData } : row,
        )
        setFilteredRows(updatedRows)

        handleEditModalClose() // Close the modal after submission
        fetchData() // Refetch the data to ensure the UI is up-to-date
      } catch (error) {
        console.error('Error updating row:', error.message, error.stack)
        toast.error('Error updating data')
      }
      fetchData()
    }

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
    }

    //delete
    const handleDeleteSelected = async (id) => {
      if (window.confirm('Are you sure you want to delete this record?')) {
        try {
          // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGM1ZjI4M2Q4ODRkM2E0M2U3MjMiLCJlbWFpbCI6Inlhc2hAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQkh6dDZ1NGJwNE01S3hZYXA5U2xYdTQ3clVidUtsVlQvSlFWUkxEbHFQcVY4L1A3OTlXb2kiLCJ1c2VybmFtZSI6Inlhc2giLCJjcmVhdGVkQnkiOiI2NmYyODQ3MGRlOGRkZTA1Zjc0YTdkOTgiLCJub3RpZmljYXRpb24iOmZhbHNlLCJkZXZpY2VzIjpmYWxzZSwiZHJpdmVyIjpmYWxzZSwiZ3JvdXBzIjpmYWxzZSwiY2F0ZWdvcnkiOmZhbHNlLCJtb2RlbCI6ZmFsc2UsInVzZXJzIjp0cnVlLCJyZXBvcnQiOmZhbHNlLCJzdG9wIjpmYWxzZSwidHJpcHMiOnRydWUsImdlb2ZlbmNlIjpmYWxzZSwibWFpbnRlbmFuY2UiOmZhbHNlLCJwcmVmZXJlbmNlcyI6ZmFsc2UsImNvbWJpbmVkUmVwb3J0cyI6ZmFsc2UsImN1c3RvbVJlcG9ydHMiOmZhbHNlLCJoaXN0b3J5IjpmYWxzZSwic2NoZWR1bGVyZXBvcnRzIjpmYWxzZSwic3RhdGlzdGljcyI6ZmFsc2UsImFsZXJ0cyI6ZmFsc2UsInN1bW1hcnkiOmZhbHNlLCJjdXN0b21DaGFydHMiOmZhbHNlLCJfX3YiOjB9LCJpYXQiOjE3MjcxNzQzMjh9.mZcaQCnOwFXUm4E91VIzo2txOxV9OQs06rZ9wgV1-V8'; // Encode credentials in Base64

          const response = await fetch(`${import.meta.env.VITE_API_URL}/category/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${token}`,
            },
          })

          if (response.ok) {
            // Update the state to remove the deleted row
            setFilteredData(filteredData.filter((item) => item._id !== id))
            toast.error('Record deleted successfully')
          } else {
            const result = await response.json()
            console.error('Server responded with:', result)
            toast.error(`Unable to delete record: ${result.message || response.statusText}`)
          }
        } catch (error) {
          console.error('Error during DELETE request:', error)
          toast.error('Unable to delete record. Please check the console for more details.')
        }
      }
      fetchData()
    }
    return (
      <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
        <Toaster position="top-center" reverseOrder={false} />
        {/* Header and Add Category button */}
        <div className="d-flex justify-content-between mb-2">
          <div>
            <h2>Category</h2>
          </div>
          <div className="d-flex  justify-content-center align-items-center">
            <div className="me-3 d-none d-md-block">
              <input
                type="search"
                className="form-control"
                placeholder="search here...."
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <button
              onClick={() => setAddModalOpen(true)}
              variant="contained"
              className="btn btn-primary"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Table */}
        <TableContainer
          component={Paper}
          style={{ maxHeight: '800px', overflowY: 'scroll' }} // Set the desired height and enable scroll
        >
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className=" text-center text-white bg-secondary">
                  Category Name
                </CTableHeaderCell>
                <CTableHeaderCell className=" text-center text-white bg-secondary">
                  Actions
                </CTableHeaderCell>{' '}
                {/* Actions header */}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="15" className="text-center">
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
                    <CTableDataCell className="text-center">{item.categoryName}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      {/* Display the icons in a row layout */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          gap: '10px',
                        }}
                      >
                        <IconButton aria-label="edit" onClick={() => handleEditIconClick(item)}>
                          <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue' }} />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteSelected(item._id)} // Pass the item's unique ID to handleDeleteSelected
                          sx={{ color: 'red' }} // Remove margin-top for row layout
                        >
                          <AiFillDelete style={{ fontSize: '25px' }} />
                        </IconButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="15" className="text-center">
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ height: '200px' }}
                    >
                      <p className="mb-0 fw-bold">
                        "Oops! Looks like there's No Category available.
                        <br /> Maybe it's time to create some Categories!"
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
                          Add Category
                        </button>
                      </div>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </TableContainer>

        {/* Modal for adding new category */}
        <Modal
          open={addModalOpen}
          onClose={handleAddModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="d-flex justify-content-between">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add New Category
              </Typography>
              <IconButton onClick={handleAddModalClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <form onSubmit={handleAddSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Category Name"
                  name="categoryName"
                  value={formData.categoryName || ''}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginTop: '20px' }}
                >
                  Submit
                </Button>
              </FormControl>
            </form>
          </Box>
        </Modal>

        {/* Modal for editing category */}
        <Modal
          open={editModalOpen}
          onClose={handleEditModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {' '}
            {/* Use the same style variable as your Add modal */}
            <div className="d-flex justify-content-between">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Category
              </Typography>
              <IconButton onClick={handleEditModalClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <form onSubmit={handleEditSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Category Name"
                  name="categoryName"
                  value={formData.categoryName || ''}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginTop: '20px' }}
                >
                  Submit
                </Button>
              </FormControl>
            </form>
          </Box>
        </Modal>
      </div>
    )
  }
}
export default Category