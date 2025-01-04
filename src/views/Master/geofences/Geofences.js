import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
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
  MenuItem,
  OutlinedInput,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete, AiOutlineUserAdd } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import Gmap from '../../Googlemap/Gmap'
import CloseIcon from '@mui/icons-material/Close'
import { GoogleMap, Marker, Polygon, useLoadScript, Circle } from '@react-google-maps/api'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import toast, { Toaster } from 'react-hot-toast'
import { IoMdAdd } from 'react-icons/io'
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import CIcon from '@coreui/icons-react'
import { cilSettings } from '@coreui/icons'
import { auto } from '@popperjs/core'
import "../../../../src/app.css";


const Geofences = () => {
  const [deviceData , setDeviceData] = useState();
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState()
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['Select Geofence', 'Geofence Info']
  const [filteredData, setFilteredData] = useState([]);


  const handleEditModalClose = () => {
    setCurrentStep(0)
    setFormData({})
    setEditModalOpen(false)}


  const handleAddModalClose = () => {
    setCurrentStep(0)
    setFormData({})
    setAddModalOpen(false)}


  const [deviceOptions, setDeviceOptions] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  // const [currentItemId, setCurrentItemId] = useState(null);


  // Go to the next step
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  // Go to the previous step
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const PlaceType = [
    { value: 'ATM', label: 'ATM' },
    { value: 'Airport', label: 'Airport' },
    { value: 'Bank', label: 'Bank' },
    { value: 'Beach', label: 'Beach' },
    { value: 'Bus_Stop', label: 'Bus Stop' },
    { value: 'Restaurant', label: 'Restaurant' },
    { value: 'Dairy', label: 'Dairy' },
    { value: 'District', label: 'District' },
    { value: 'Facility', label: 'Facility' },
    { value: 'Factory', label: 'Factory' },
    { value: 'Fuel_Station', label: 'Fuel Station' },
    { value: 'Highway_point', label: 'Highway Point' },
    { value: 'Home', label: 'Home' },
    { value: 'Hospital', label: 'Hospital' },
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Mosque', label: 'Mosque' },
    { value: 'Office', label: 'Office' },
    { value: 'Other', label: 'Other' },
    { value: 'Police_Station', label: 'Police Station' },
    { value: 'Post_Office', label: 'Post Office' },
    { value: 'Railway_Station', label: 'Railway Station' },
    { value: 'Recycle_Station', label: 'Recycle Station' },
    { value: 'School', label: 'School' },
    { value: 'Traffic_Signal', label: 'Traffic Signal' },
    { value: 'State_Border', label: 'State Border' },
    { value: 'Sub_Division', label: 'Sub Division' },
    { value: 'Temple', label: 'Temple' },
    { value: 'Theater', label: 'Theater' },
    { value: 'Theme_Park', label: 'Theme Park' },
    { value: 'Toll_Gate', label: 'Toll Gate' },
    { value: 'Tunnel', label: 'Tunnel' },
    { value: 'University', label: 'University' },
    { value: 'Way_Bridge', label: 'Way Bridge' },
    { value: 'Sensative_Points', label: 'Sensitive Points' },
    { value: 'Dumping_Yard', label: 'Dumping Yard' },
    { value: 'Mine', label: 'Mine' },
    { value: 'No_POI_Report', label: 'No POI Report' },
    { value: 'Entry_Restriction', label: 'Entry Restriction' },
    { value: 'Tyre_Shop', label: 'Tyre Shop' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Yard', label: 'Yard' },
    { value: 'Parking_Place', label: 'Parking Place' },
    { value: 'Driver_Home', label: 'Driver Home' },
    { value: 'Customer', label: 'Customer' },
    { value: 'Puspakom', label: 'Puspakom' },
    { value: 'Exit_Restriction', label: 'Exit Restriction' },
    { value: 'Gurudwara', label: 'Gurudwara' },
    { value: 'Church', label: 'Church' },
    { value: 'Distributor', label: 'Distributor' },
    { value: 'State', label: 'State' },
    { value: 'WaterFall', label: 'WaterFall' },
    { value: 'Depot', label: 'Depot' },
    { value: 'Terminal', label: 'Terminal' },
    { value: 'Port', label: 'Port' },
  ]

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: auto,
    BorderRadius: '10px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Enable vertical scrolling
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    marginTop: '8px',
  }
  if (deviceData) {
    console.log('hey bro this is device data : ', deviceData)
  } else {
    console.log('abe yaar device data nh hai')
  }


  const [selectedDevices, setSelectedDevices] = useState([])

  const handleDeviceChange = (selected) => {
    setSelectedDevices(selected)
  }

  // ############ map code #################################

  const [selectedLocation, setSelectedLocation] = useState({ lat: 21.1458, lng: 79.0882 })
  const [polygonCoords, setPolygonCoords] = useState([])

  // Load Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAvHHoPKPwRFui0undeEUrz00-8w6qFtik', // Replace with your API key
  })

  const onMapClick = (event) => {
    const newCoords = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
    setPolygonCoords((prev) => [...prev, newCoords]) // Add new coordinates to the polygon
    setSelectedLocation(newCoords)
  }

  if (polygonCoords) {
    console.log('this is selected points', polygonCoords)
  }

  // ######################### get geofences ##############################################
  const fetchGeofenceData = async (page = 1) => {
    const accessToken = Cookies.get('authToken')
    const url = `${import.meta.env.VITE_API_URL}/geofence?page=${page}&limit=${limit}&search=${searchQuery}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data.geofences) {
        setData(response.data.geofences)
        setPageCount(response.data.pagination.totalPages)
        console.log(response.data.geofences)
        console.log(response.data.pagination.totalPages)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }


  const fetchDeviceData = async () => {
    const token = Cookies.get('authToken')
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/device`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if(response.data){
      setDeviceData(response.data);

      setDeviceOptions(response.data.devices?.map((device) => ({
        value: device.deviceId,
        label: device.name,
      })))
    }
  }

  useEffect(() => {
    fetchDeviceData();
  },[])

  // ##################### Filter data by search query #######################
  const filterGeofences = () => {
    if (!searchQuery) {
      setFilteredData(data); // No query, show all drivers
    } else {
      const filtered = data.filter(
        (geofences) =>
        //fixed app crash on geofence search

        (String(geofences?.name)?.toLowerCase().includes(searchQuery?.toLowerCase()))  ||
        (String(geofences?.type)?.toLowerCase().includes(searchQuery?.toLowerCase()) )||
        (String(geofences?.deviceIds)?.toLowerCase().includes(searchQuery?.toLowerCase()))
      //     geofences.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //     geofences.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //     geofences.deviceIds.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    fetchGeofenceData()
  }, [limit, searchQuery])

  useEffect(() => {
    filterGeofences(searchQuery);
  }, [data, searchQuery]);

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchGeofenceData(page)
  }

  // ################ add geofence #########################################

  const handleAddGeofence = async (e) => {
    e.preventDefault()
    console.log(polygonCoords)
    console.log(formData)
    const updatedFormData = {
      ...formData,
      area: polygonCoords, // Add your polygonCoords here
      deviceIds: selectedDevices.map((device) => device.value),
    }

    console.log('this is updated formdata: ', updatedFormData)

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/geofence`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.status == 201) {
        toast.success('Geofence is created successfully')
        fetchGeofenceData()
        setFormData({})
        setPolygonCoords([])
        setSelectedDevices([]);
        setAddModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  // ###########################################################################
  // ######################  Edit Geofence ###################################

  const EditGeofenceSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)

    const editedData = {
      ...formData,
      area: polygonCoords, // Add your polygonCoords here
      deviceIds: selectedDevices.map((device) => device.value),
    }
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/Geofence/${formData._id}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('Geofence is edited successfully')
        fetchGeofenceData()
        setFormData({})
        setPolygonCoords([])
        setEditModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const handleEditGeofence = async (item) => {
    console.log(item)
    // setCurrentItemId(item._id);
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log('this is before edit', formData)
  }

  // #########################################################################

  // ######################## Delete Geofence ################################

  const deleteGeofenceSubmit = async (item) => {
    const confirmed = confirm('Do you want to delete this Geofence?');
    // If the user cancels, do nothing
    if (!confirmed) return;

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/Geofence/${item._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 200) {
        toast.error('Geofence is deleted successfully')
        fetchGeofenceData()
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }
  const exportToExcel = () => {
    // Map filtered data into the format required for export
    const dataToExport = filteredData.map((item, rowIndex) => {
      // Define row data for each item in the filteredData array
      const rowData = {
        SN: rowIndex + 1,               // Serial Number
        'Geofence Name': item.name || 'N/A',   // Name of the geofence
        'Type': item.type || 'N/A',     // Type of the geofence
        'Vehicles': (item.deviceIds.map( device => device.name).join( ) || "N/A"), // Number of vehicles
      };

      return rowData; // Return row data in the correct format
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport); // Convert data to worksheet format
    const workbook = XLSX.utils.book_new(); // Create a new workbook

    // Append the worksheet to the workbook with the sheet name 'Geofence Data'
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Geofence Data');

    // Write the Excel file to the client's computer
    XLSX.writeFile(workbook, 'geofence_data.xlsx');
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['SN', 'Geofence Name', 'Type', 'Vehicles'];

    // Extracting the relevant data for PDF export
    const tableRows = filteredData.map((item, index) => {
      const vehicleCount = item.deviceIds.length || '0'; // Count of vehicles
      return [
        index + 1, // Serial Number
        item.name, // Geofence Name
        item.type, // Type
        (item.deviceIds.map( device => device.name).join( ) || "N/A")
      ];
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save('geofence_data.pdf');
  };

  //  ###############################################################

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Geofence</h2>
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
              Add Geofence
            </button>
          </div>
        </div>
      </div>
      <div className="d-md-none mb-2">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="col-12 col-md-6 position-relative">
          <TableContainer  component={Paper}
              sx={{
                height: 'auto', // Set the desired height
                overflowX: 'auto', // Enable horizontal scrollbar
                overflowY: 'auto', // Enable vertical scrollbar if needed
                marginBottom: '10px',
                borderRadius: '10px',
                border: '1px solid black'
              }}>

            <CTable style={{fontFamily: "Roboto, sans-serif", fontSize: '14px',}} bordered align="middle" className="mb-2 border min-vh-25 rounded-top-3" hover responsive>
              <CTableHead className="text-nowrap">
                <CTableRow>
                <CTableHeaderCell className="text-center bg-body-secondary text-center sr-no table-cell">
                  <strong>SN</strong>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="ps-3 text-center bg-body-secondary text-center sr-no table-cell">
                   <strong>Geofence Name</strong>
                  </CTableHeaderCell>
                  <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                    <strong>Type</strong>
                  </CTableHeaderCell>
                  <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                   <strong>Vehicles</strong>
                  </CTableHeaderCell>

                  <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                    <strong>Actions</strong>
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <>
                    <div className="text-nowrap mb-2" style={{ width: '240px' }}>
                      <p className="card-text placeholder-glow">
                        <span className="placeholder col-8" />
                        <span className="placeholder col-8" />
                        <span className="placeholder col-8" />
                        <span className="placeholder col-8" />
                        <span className="placeholder col-8" />
                      </p>
                      <p className="card-text placeholder-glow">
                        <span className="placeholder col-8" />
                        <span className="placeholder col-8" />
                        <span className="placeholder col-8" />
                        <span className="placeholder col-8" />
                        <span className="placeholder col-8" />
                      </p>
                    </div>
                  </>
                ) : filteredData.length > 0 ? (
                  filteredData?.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className=" text-center"  style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2", }} >{(currentPage - 1) * limit + index+1}</CTableDataCell>
                      <CTableDataCell className=" text-center "  style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2", }} >{item.name}</CTableDataCell>
                      <CTableDataCell className="text-center "  style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2", }} >{item.type}</CTableDataCell>
                      <CTableDataCell className="text-center" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2", }}  >
                        <CFormSelect
                          id="geofence"
                          value=""
                          className=" text-center border-2 "
                          style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",}}
                        >
                          <option value="">{item.deviceIds.length || '0'}</option>
                          {Array.isArray(item.deviceIds) &&
                            item.deviceIds.map((device, index) => (
                              <option key={index} value={device.name}>
                                {device.name}
                              </option>
                            ))}
                        </CFormSelect>
                      </CTableDataCell>
                      <CTableDataCell
                        className="text-center d-flex "
                        style={{ justifyContent: 'center', alignItems: 'center' , backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2", }}

                      >
                        <IconButton aria-label="edit" onClick={() => handleEditGeofence(item)}>
                          <RiEdit2Fill
                            style={{ fontSize: '20px', color: 'lightBlue', margin: '3px' }}
                          />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => deleteGeofenceSubmit(item)}>
                          <AiFillDelete style={{ fontSize: '20px', color: 'red', margin: '3px' }} />
                        </IconButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ height: '200px' }}
                      >
                        <p className="mb-0 fw-bold">
                          "Oops! Looks like there's No Geofence Created.
                          <br /> Maybe it's time to Create New Geofence!"
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
                            Create Geofence
                          </button>
                        </div>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </TableContainer>
          <CDropdown className="position-absolute bottom-0 start-0 m-3">
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
          {pageCount > 1 && (
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
          )}
        </div>
        <div className="col-12 col-md-6">
          <div style={{ flex: 1 }}><Gmap data={data} /></div>
        </div>
      </div>

      <Modal open={addModalOpen} onClose={handleAddModalClose}>
        <Box
          sx={{
            ...style,
            backgroundColor: '#f7f9fc',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '30px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', fontSize: '24px' }}>
              <span role="img" aria-label="user">
                <AiOutlineUserAdd className="fs-2" />
              </span>{' '}
              Add New Geofence
            </Typography>
            <IconButton onClick={handleAddModalClose}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* Step-by-step form with progress indicator */}
          <div>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {currentStep === 0 && (
              <div className="mt-3">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ height: '400px', width: '100%' }}
                    center={selectedLocation}
                    zoom={13}
                    onClick={onMapClick}
                  >
                    {polygonCoords.length > 0 && (
                      <Polygon
                        paths={polygonCoords}
                        options={{
                          fillColor: 'lightblue',
                          fillOpacity: 0.5,
                          strokeColor: 'blue',
                          strokeOpacity: 1,
                          strokeWeight: 2,
                        }}
                      />
                    )}
                    <Marker position={selectedLocation} />
                  </GoogleMap>
                ) : (
                  <div>Loading Google Maps...</div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <div className="mt-3">
                <TextField
                  fullWidth
                  label="Geofence Name"
                  name="name"
                  value={formData.name !== undefined ? formData.name : ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Select
                  placeholder="Select Place Type..."
                  value={PlaceType.find((option) => option.value === formData.type) || ''}
                  onChange={(selectedOption) =>
                    setFormData({ ...formData, type: selectedOption ? selectedOption.value : '' })
                  }
                  options={PlaceType}
                  styles={{
                    container: (base) => ({
                      ...base,
                      marginTop: '20px',
                      marginBottom: '20px',
                    }),
                  }}
                />

                <Select
                  isMulti
                  options={deviceOptions}
                  onChange={handleDeviceChange}
                  value={selectedDevices}
                  placeholder="Select devices"
                  styles={{
                    container: (base) => ({
                      ...base,
                      marginTop: '20px',
                      marginBottom: '20px',
                    }),
                  }}
                />
              </div>
            )}

            {/* Navigation buttons */}
            <div className="d-flex justify-content-between" style={{ marginTop: '20px' }}>
              {currentStep > 0 && (
                <Button onClick={handleBack} variant="outlined">
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} variant="contained" color="primary">
                  Next
                </Button>
              ) : (
                <Button onClick={handleAddGeofence} variant="contained" color="primary">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit New Geofence
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleEditModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={EditGeofenceSubmit}>
              <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
                Select Geofence Location:
              </Typography>
              {/* Check if Google Maps is loaded */}
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ height: '300px', width: '100%' }}
                  center={selectedLocation}
                  zoom={13}
                  onClick={onMapClick} // Set marker on click
                >
                  {polygonCoords.length > 0 && (
                    <Polygon
                      paths={polygonCoords}
                      options={{
                        fillColor: 'lightblue',
                        fillOpacity: 0.5,
                        strokeColor: 'blue',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                      }}
                    />
                  )}
                  <Marker position={selectedLocation} />
                </GoogleMap>
              ) : (
                <div>Loading Google Maps...</div>
              )}
              <br />
              <TextField
                fullWidth
                label="Geofence Name"
                name="name"
                value={formData.name !== undefined ? formData.name : ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Select
                placeholder="Select Place Type..."
                value={PlaceType.find((option) => option.value === formData.type) || ''}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, type: selectedOption ? selectedOption.value : '' })
                }
                options={PlaceType}
                styles={{
                  container: (base) => ({
                    ...base,
                    marginTop: '20px',
                    marginBottom: '20px',
                  }),
                }}
              />

              <Select
                isMulti
                options={deviceOptions}
                onChange={handleDeviceChange}
                value={selectedDevices}
                placeholder="Select devices"
                styles={{
                  container: (base) => ({
                    ...base,
                    marginTop: '20px',
                    marginBottom: '20px',
                  }),
                }}
              />

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

export default Geofences
