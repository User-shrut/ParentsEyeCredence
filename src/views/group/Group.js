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
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
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
import { MdConnectWithoutContact } from 'react-icons/md'
import { AiOutlineUpload } from 'react-icons/ai'

// const getStatusColor = (status) => (status === 'online' ? 'green' : 'red');

const Group = () => {
  const [open, setOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false) // Modal for adding a new row
  const [formData, setFormData] = useState({}) // Form data state
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalResponses, setTotalResponses] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const [filteredRows, setFilteredRows] = useState([])
  const handleModalClose = () => setAddModalOpen(false)
  const [filteredData, setFilteredData] = useState([])

  // Table columns (excluding ID, Group ID, and Calendar ID)
  const columns = [
    { Header: 'Name', accessor: 'name' },
    // { Header: 'Unique ID', accessor: 'uniqueId' },
    // { Header: 'Last Update', accessor: 'lastUpdate', Cell: ({ value }) => new Date(value).toLocaleString() },
    // { Header: 'Position ID', accessor: 'positionId' },
    // { Header: 'Phone', accessor: 'phone' },
    // { Header: 'Model', accessor: 'model' },
    // { Header: 'Contact', accessor: 'contact' },
    // { Header: 'Category', accessor: 'category' },
    // { Header: 'Disabled', accessor: 'disabled', Cell: ({ value }) => (value ? 'Yes' : 'No') },
    // { Header: 'Expiration Time', accessor: 'expirationTime', Cell: ({ value }) => value ? new Date(value).toLocaleString() : 'N/A' },
    // { Header: 'Status', accessor: 'status' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '12%',
    transform: 'translate(-50%, -50%)',
    width: '25%',
    height: '101%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    margintop: '8px',
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const username = 'school'
      const password = '123456'
      const token = btoa(`${username}:${password}`)

      const response = await axios.get('https://rocketsalestracker.com/api/devices', {
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
      setLoading(false)
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
      const apiUrl = 'https://rocketsalestracker.com/api/devices'
      const username = 'school'
      const password = '123456'
      const token = btoa(`${username}:${password}`)

      const newRow = {
        name: formData.name,
        uniqueId: formData.uniqueId,
        status: formData.status,
        phone: formData.phone,
        model: formData.model,
        expirationTime: formData.expirationTime,
        contact: formData.contact,
        category: formData.category,
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      })

      const result = await response.json()

      if (response.ok) {
        setFilteredRows([...filteredRows, result])
        handleModalClose()
        fetchData()

        console.log('Record created successfully:', result)
        alert('Record created successfully')
      } else {
        console.error('Server responded with:', result)
        alert(`Unable to create record: ${result.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error during POST request:', error)
      alert('Unable to create record')
    }
  }

  const handleDeleteSelected = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const username = 'school'
        const password = '123456'
        const token = btoa(`${username}:${password}`)

        const response = await fetch(`https://rocketsalestracker.com/api/devices/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        })

        if (response.ok) {
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

  return (
    <div className="m-3">
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Groups</h2>
        </div>

        <div className="d-flex">
          {/* <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginRight: '5px', backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '5px 10px', border: '0.5px solid grey', marginTop: "7px" }}
          /> */}
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
              Add
            </button>
          </div>
        </div>
      </div>

      <TableContainer component={Paper}>
        {loading ? (
          <Loader />
        ) : (
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-start ps-5">Name</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-end " style={{paddingRight: "7vw"}}>Actions</CTableHeaderCell>
              </CTableRow>

              
            </CTableHead>
            <CTableBody>
              {filteredData.map((item, index) => (
                <CTableRow key={index}>
                  {columns.map((column, i) => (
                    <CTableDataCell key={i} className="ps-5">
                      {item[column.accessor]}
                    </CTableDataCell>
                  ))}
                  <CTableDataCell
                    className="pe-md-5 d-flex"
                    style={{ justifyContent: 'flex-end' }}
                  >
                    
                    <IconButton aria-label="upload">
                      <AiOutlineUpload
                        style={{ fontSize: '25px', color: 'orange', margin: '5.3px' }}
                      />
                    </IconButton>
                    <IconButton aria-label="edit">
                      <RiEdit2Fill
                        style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }}
                      />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteSelected(item.id)}>
                      <AiFillDelete style={{ fontSize: '25px', color: 'red', margin: '5.3px' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </TableContainer>

      {/* Add Modal */}
      <Modal
        open={addModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Device
          </Typography>
          <IconButton
            style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
            onClick={handleModalClose}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField
                label="Name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Group Id"
                name="uniqueId"
                value={formData.uniqueId || ''}
                onChange={handleInputChange}
                required
              />
              {/* <TextField label="Status" name="status" value={formData.status || ''} onChange={handleInputChange} required /> */}
              {/* <TextField label="Phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} /> */}
              {/* <TextField label="Model" name="model" value={formData.model || ''} onChange={handleInputChange} /> */}
              {/* <TextField label="Contact" name="contact" value={formData.contact || ''} onChange={handleInputChange} /> */}
              {/* <TextField label="Category" name="category" value={formData.category || ''} onChange={handleInputChange} /> */}
              {/* <TextField label="Expiration Time" name="expirationTime" value={formData.expirationTime || ''} onChange={handleInputChange} /> */}
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubmit}
              style={{ marginTop: '20px' }}
            >
              Submit
            </Button>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}

export default Group
