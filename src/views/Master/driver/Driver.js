import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Autocomplete, } from "@mui/material";
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
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/Loader/Loader';
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
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import CIcon from '@coreui/icons-react';
import { cilSettings } from '@coreui/icons';
import "../../../../src/app.css";


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
  const [currentPage, setCurrentPage] = useState(1);

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
    width: '70%',
    bgcolor: 'background.paper',
    color: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  //validation Functions

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phone ? phoneRegex.test(phone) : true; // Allow empty phone
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email ? emailRegex.test(email) : true; // Allow empty email
  };
  
  const validateLicenseNumber = (licenseNumber) => {
    const licenseRegex = /^[A-Za-z0-9]/; // Adjust the length as needed
    return licenseNumber ? licenseRegex.test(licenseNumber) : true; // Allow empty license number
  };
  
  const validateAadharNumber = (aadharNumber) => {
    const aadharRegex = /^[0-9]/;
    return aadharNumber ? aadharRegex.test(aadharNumber) : true; // Allow empty Aadhar
  };


  // ##################### getting data  ###################
  const fetchDriverData = async (page = 1) => {
    const accessToken = Cookies.get('authToken')
    const url = `${import.meta.env.VITE_API_URL}/driver?page=${page}&limit=${limit}&search=${searchQuery}`

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
          driver?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (String(driver?.phone)?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (String(driver?.email)?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          driver?.device?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (String(driver?.licenseNumber)?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (String(driver?.aadharNumber)?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          driver?.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchDriverData()
  }, [limit, searchQuery]);

  useEffect(() => {
    filterDrivers(searchQuery);
  }, [data, searchQuery]);

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchDriverData(page)
  }


  // #########################################################################

  //  ####################  Add Group ###########################

  const handleAddDriver = async (e) => {
    e.preventDefault()
    console.log("formData", formData)
     // Validation checks
     if (!validatePhone(formData.phone)) {
      toast.error("Invalid phone number. It should be 10 digits.");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!validateLicenseNumber(formData.licenseNumber)) {
      toast.error("Invalid license number. It should be alphanumeric and up to 15 characters.");
      return;
    }
    if (!validateAadharNumber(formData.aadharNumber)) {
      toast.error("Invalid Aadhar number. It should be exactly 12 digits.");
      return;
    }
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
    // Validation checks  
    if (!validatePhone(formData.phone)) {
      toast.error("Invalid phone number. It should be 10 digits.");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!validateLicenseNumber(formData.licenseNumber)) {
      toast.error("Invalid license number. It should be alphanumeric and up to 15 characters");
      return;
    }
    if (!validateAadharNumber(formData.aadharNumber)) {
      toast.error("Invalid Aadhar number. It should be exactly 12 digits.");
      return;
    }
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

    const confirmed = confirm('Do you want to delete this Driver?');
    // If the user cancels, do nothing
    if (!confirmed) return;
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
        const mappedDevices = data.devices.map((device) => ({
          deviceId: device.deviceId,
          name: device.name,
        }));

        setDevices(mappedDevices); // Assuming the data returned contains device info
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);
  const exportToExcel = () => {
    // Map filtered data into the format required for export
    const dataToExport = filteredData.map((item, rowIndex) => {
      const rowData = {
        'SN': rowIndex + 1, // Include row index as SN
        'Driver Name': item.name || 'N/A',
        'Mobile No.': item.phone || 'N/A',
        'Email': item.email || 'N/A',
        'Vehicle No.': item.device || 'N/A',
        'Lic. No.': item.licenseNumber || 'N/A',
        'Aadhar No.': item.aadharNumber || 'N/A',
        'Address': item.address || 'N/A',
        'Actions': '' // Actions column is usually empty in Excel
      };

      return rowData;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Drivers Data');

    // Write the Excel file
    XLSX.writeFile(workbook, 'drivers_data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });
    const tableColumn = [
      'SN',
      'Driver Name',
      'Mobile No.',
      'Email',
      'Vehicle No.',
      'Lic. No.',
      'Aadhar No.',
      'Address',
      'Actions'
    ];

    const tableRows = filteredData.map((item, index) => {
      return [
        index + 1,
        item.name || '--',
        item.phone || '--',
        item.email || '--',
        item.device || '--',
        item.licenseNumber || '--',
        item.aadharNumber || '--',
        item.address || '--',
        '' // Actions column is usually empty in PDF
      ];
    });

    doc.autoTable(tableColumn, tableRows, { startY: 15 });
    doc.save('drivers_data.pdf');
  };

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
              className="btn btn-secondary"
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
        sx={{
          height: 'auto', // Set the desired height
          overflowX: 'auto', // Enable horizontal scrollbar
          overflowY: 'auto', // Enable vertical scrollbar if needed
          marginBottom: '10px',
          borderRadius: '10px',
          border: '1px solid black'
        }}
      >
        <CTable style={{ fontFamily: "Roboto, sans-serif", fontSize: '14px', }} bordered align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow className='bg-body-tertiary'>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>SN</strong>
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Driver Name</strong>
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Mobile No.</strong>
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Email</strong>
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Vehicle no.</strong>
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Lic. No.</strong>
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Aadhar No.</strong>
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Address</strong>
              </CTableHeaderCell>
              <CTableHeaderCell
                className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Actions</strong>
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>

            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="10" className="text-center">
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
                  <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{(currentPage - 1) * limit + index + 1}</CTableDataCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{item.name}</CTableDataCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{item.phone}</CTableDataCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{item.email? item.email:"N/A"}</CTableDataCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{item.device}</CTableDataCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{item.licenseNumber}</CTableDataCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{item.aadharNumber}</CTableDataCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{item.address? item.address:"N/A"}</CTableDataCell>
                  <CTableDataCell
                    className="text-center d-flex"
                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}
                  >
                    <IconButton aria-label="edit" onClick={() => handleEditDriver(item)}>
                      <RiEdit2Fill
                        style={{ fontSize: '20px', color: 'lightBlue', margin: '5.3px' }}
                      />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => deleteDriverSubmit(item)}>
                      <AiFillDelete style={{ fontSize: '20px', color: 'red', margin: '5.3px' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))) : (
              <CTableRow>
                <CTableDataCell colSpan="9" className="text-center">
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
      <CDropdown className="position-fixed bottom-0 end-0 m-3">
        <CDropdownToggle
          color="secondary"
          style={{ borderRadius: '50%', padding: '10px', height: '48px', width: '48px' }}
        >
          <CIcon icon={cilSettings} />
        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem onClick={exportToPDF} >PDF</CDropdownItem>
          <CDropdownItem onClick={exportToExcel} >Excel</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
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
                { label: 'ALL', value: '' }
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
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ paddingLeft: "26px" }}>
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
            <form onSubmit={handleAddDriver} style={{ display: 'flex', justifyContent: "flex-end", flexDirection: "column", }}>
              <FormControl style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gridGap: '3rem 1rem' }}>
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
                  name="email"
                  value={formData.email !== undefined ? formData.email : ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutline />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* <TextField
                  select 
                  label="Vehicle List" 
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
                  fullWidth 
                >
                  {devices.length > 0 ? (
                    devices.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}> 
                        {device.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No devices available</MenuItem>
                  )}
                </TextField> */}

                <Autocomplete
                  options={devices} // List of devices
                  getOptionLabel={(option) => option.name} // Defines the label for each option
                  //onChange={(event, value) => setSelectedDevice(value)}
                  onChange={(event, value) => setFormData({ ...formData, deviceId: value.deviceId })} // Handle selection
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select or Search Vehicle"
                      placeholder='Start typing to search'
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <DirectionsCarIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      fullWidth
                    />
                  )}
                  filterOptions={(options, state) =>
                    options.filter((option) =>
                      option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                    )
                  }
                  isOptionEqualToValue={(option, value) => option.deviceId === value?.deviceId}
                />

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
                style={{ marginTop: '20px',  marginLeft: "auto" }}
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
            <form onSubmit={EditDriverSubmit} style={{ display: 'flex', justifyContent: "flex-end", flexDirection: "column", }}>
              <FormControl style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gridGap: '3rem 1rem' }}>
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
                  name="email"
                  value={formData.email !== undefined ? formData.email : ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                {/* <TextField
                  select 
                  label="Vehicle List" 
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
                  fullWidth 
                >
                  {devices.length > 0 ? (
                    devices.map((device) => (
                      <MenuItem key={device.id} value={device.name}> 
                        {device.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No devices available</MenuItem>
                  )}
                </TextField> */}
                <Autocomplete
                  options={devices} // List of devices
                  getOptionLabel={(option) => option.name} // Defines the label for each option
                  //onChange={(event, value) => setSelectedDevice(value)}
                  onChange={(event, value) => setFormData({ ...formData, deviceId: value.deviceId })} // Handle selection
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select or Search Vehicle"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <DirectionsCarIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      fullWidth
                    />
                  )}
                  filterOptions={(options, state) =>
                    options.filter((option) =>
                      option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                    )
                  }
                  isOptionEqualToValue={(option, value) => option.deviceId === value?.deviceId}
                />

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
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px',marginLeft: "auto" }}
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
