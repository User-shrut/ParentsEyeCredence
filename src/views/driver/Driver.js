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
  InputAdornment,
  FormControl,
} from '@mui/material'
import { Select, MenuItem, } from '@mui/material';
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import {
  CFormSelect,
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
import ReactPaginate from 'react-paginate'
import Cookies from 'js-cookie'
import {
  AccountCircle,
  MailOutline,
  Phone,
} from '@mui/icons-material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DialpadIcon from '@mui/icons-material/Dialpad';
import HomeIcon from '@mui/icons-material/Home';
import { IoMdAdd } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast';

const Driver = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState()
  const [filteredData, setFilteredData] = useState([]);

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setFormData({})
  }
  const handleAddModalClose = () => {
    setAddModalOpen(false)
    setFormData({});
  }


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    color: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  // ##################### getting data  ###################
  const fetchDriverData = async (page = 1) => {
    const accessToken = Cookies.get('authToken')
    const url = `${import.meta.env.VITE_API_URL}/driver?page=${page}&limit=${limit}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data.drivers) {
        setData(response.data.drivers)
        setPageCount(response.data.pagination.totalPages)
        console.log(response.data.drivers)
        console.log(response.data.pagination.totalPages)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed

    }
  }

  // ##################### Filter data by search query #######################
  const filterDrivers = () => {
    if (!searchQuery) {
      setFilteredData(data); // No query, show all drivers
    } else {
      const filtered = data.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    fetchDriverData()
  }, [limit])

  useEffect(() => {
    filterDrivers(searchQuery);
  }, [data, searchQuery]);

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setLoading(true)
    fetchDriverData(page)
  }

  // #########################################################################

  //  ####################  Add Group ###########################

  const handleAddDriver = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/driver`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status == 200) {
        toast.success('Driver is created successfully')
        fetchDriverData()
        setFormData({ name: '' })
        setAddModalOpen(false)
      }
    } catch (error) {
      toast.error("This didn't work.")
      throw error.response ? error.response.data : new Error('An error occurred')

    }
  }

  // ###################################################################
  // ######################### Edit Group #########################

  const EditDriverSubmit = async (e) => {
    e.preventDefault()
    console.log(formData);
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/Driver/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('Driver is edited successfully')
        fetchDriverData()
        setFormData({ name: '' })
        setEditModalOpen(false)
      }
    } catch (error) {
      toast.error("This didn't work.")
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const handleEditDriver = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log("this is before edit", formData)
  }


  // ###################################################################


  // ###################### Delete Group ##############################


  const deleteDriverSubmit = async (item) => {
    alert("you want to delete this Driver");
    console.log(item)

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/Driver/${item._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        },
      )

      if (response.status === 200) {
        toast.error('Driver is deleted successfully')
        fetchDriverData()
      }
    } catch (error) {
      toast.error("An error occurred")
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const [fomData, setFomData] = useState({});
  const [devices, setDevices] = useState([]);
  const token = Cookies.get('authToken'); //


  useEffect(() => {
    const fetchDevices = async () => {
      console.log("fetch device me aaya hu...");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/device`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setDevices(data.devices); // Assuming the data returned contains device info
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  //  ###############################################################

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Driver</h2>
        </div>

        <div className="d-flex">
          <div className="me-3 d-none d-md-block">
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
              className="btn btn-primary"
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
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>



      <TableContainer
        component={Paper}
        style={{ maxHeight: '800px', overflowY: 'scroll', marginBottom: '10px' }}
      >
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow className='bg-body-tertiary'>
              <CTableHeaderCell
                className=" text-center text-white bg-secondary">
                Driver Name
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center text-white bg-secondary">
                Mobile No.
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center text-white bg-secondary">
                Email
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center text-white bg-secondary">
                Vehicle no.
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center text-white bg-secondary">
                Lic. No.
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center text-white bg-secondary">
                Aadhar No.
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center text-white bg-secondary">
                Address
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center text-white bg-secondary">
                Actions
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>

            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
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
              filteredData?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center">{item.name}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.phone}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.email}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.device}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.licenseNumber}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.aadharNumber}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.address}</CTableDataCell>
                  <CTableDataCell
                    className="text-center d-flex"
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <IconButton aria-label="edit" onClick={() => handleEditDriver(item)}>
                      <RiEdit2Fill
                        style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }}
                      />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => deleteDriverSubmit(item)}>
                      <AiFillDelete style={{ fontSize: '25px', color: 'red', margin: '5.3px' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: '200px' }}
                  >
                    <p className="mb-0 fw-bold">
                      "Oops! Looks like there's nobody here yet.
                      <br /> Maybe it's time to invite some drivers!"
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
                        Add Driver
                      </button>
                    </div>
                  </div>
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </TableContainer>
      <div className='d-flex justify-content-center align-items-center'>
        <div className="d-flex">
          {/* Pagination */}
          <div className="me-3"> {/* Adds margin to the right of pagination */}
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount} // Set based on the total pages from the API
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
          {/* Form Control */}
          <div style={{ width: "90px" }}>
            <CFormSelect
              aria-label="Default select example"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              options={[
                { label: '10', value: '10' },
                { label: '50', value: '50' },
                { label: '500', value: '500' },
                { label: '5000', value: '5000' }
              ]}
            />
          </div>
        </div>
      </div>

      <Modal
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Driver
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleAddModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddDriver}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Driver Name"
                  name="name"
                  value={formData.name !== undefined ? formData.name : ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Mobile No."
                  name="mobile"
                  value={formData.phone !== undefined ? formData.phone : ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Email"
                  name="mobile"
                  value={formData.email !== undefined ? formData.email : ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutline />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  select // Set the select prop to true
                  label="Vehicle List" // This will be the label for the TextField
                  name="vehicle no."
                  value={fomData.deviceId}
                  onChange={(e) => setFomData({ ...fomData, deviceId: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DirectionsCarIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth // Optional: Makes the TextField take full width
                >
                  {devices.length > 0 ? (
                    devices.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}> {/* Replace 'device.id' and 'device.name' with actual properties */}
                        {device.deviceId}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No devices available</MenuItem>
                  )}
                </TextField>

                <TextField
                  label='Licence No.'
                  name="lic"
                  value={formData.licenseNumber !== undefined ? formData.licenseNumber : ""}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TextSnippetIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label='Aadhar No.'
                  name="aadhar"
                  value={formData.aadharNumber !== undefined ? formData.aadharNumber : ""}
                  onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DialpadIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label='Address'
                  name="Address"
                  value={formData.address !== undefined ? formData.address : ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>

      {/* edit model */}
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Group
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleEditModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={EditDriverSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Driver Name"
                  name="name"
                  value={formData.name !== undefined ? formData.name : ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <TextField
                  label="Mobile No."
                  name="mobile"
                  value={formData.phone !== undefined ? formData.phone : ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <TextField
                  label="Email"
                  name="mobile"
                  value={formData.email !== undefined ? formData.email : ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <TextField
                  select // Set the select prop to true
                  label="Vehicle List" // This will be the label for the TextField
                  name="vehicle no."
                  value={fomData.deviceId}
                  onChange={(e) => setFomData({ ...fomData, deviceId: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DirectionsCarIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth // Optional: Makes the TextField take full width
                >
                  {devices.length > 0 ? (
                    devices.map((device) => (
                      <MenuItem key={device.id} value={device.name}> {/* Replace 'device.id' and 'device.name' with actual properties */}
                        {device.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No devices available</MenuItem>
                  )}
                </TextField>

                <TextField
                  label='Lic No.'
                  name="lic"
                  value={formData.licenseNumber !== undefined ? formData.licenseNumber : ""}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  required
                />
                <TextField
                  label='Aadhar No.'
                  name="aadhar"
                  value={formData.aadharNumber !== undefined ? formData.aadharNumber : ""}
                  onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                  required
                />
                <TextField
                  label='Address'
                  name="Address"
                  value={formData.address !== undefined ? formData.address : ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>

    </div>
  )
}

export default Driver
