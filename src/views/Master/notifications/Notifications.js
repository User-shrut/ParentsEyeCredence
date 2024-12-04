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
import Loader from '../../../components/Loader/Loader'
import CloseIcon from '@mui/icons-material/Close'
import { MdConnectWithoutContact } from 'react-icons/md'
import { AiOutlineUpload } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import Cookies from 'js-cookie'
import { IoMdAdd } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import CIcon from '@coreui/icons-react'
import { cilSettings } from '@coreui/icons'
import "../../../../src/app.css";


const notificationTypes = [
  'statusOnline',
  'statusOffline',
  'statusUnknown',
  'deviceActive',
  'deviceInactive',
  'deviceMoving',
  'deviceStopped',
  'speedLimitExceeded',
  'ignitionOn',
  'ignitionOff',
  'fuelDrop',
  'fuelIncrease',
  'geofenceEntered',
  'geofenceExited',
  'alarm',
  'maintenanceRequired',
]

const Notification = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState()
  const accessToken = Cookies.get('authToken')
  const [filteredData, setFilteredData] = useState([]);
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState()
  const [devices, setDevices] = useState([])
  const [selectedDevices, setSelectedDevices] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const handleEditModalClose = () => setEditModalOpen(false)
  const handleAddModalClose = () => setAddModalOpen(false)

  const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: '10px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Enable vertical scrolling
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    marginTop: '8px',
  }

  const getGroups = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/group`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data) {
        setGroups(response.data.groups)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  const getDevices = async (selectedGroup) => {
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
      } else {
        setDevices([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  useEffect(() => {
    getGroups()
  }, [limit])

  // ##################### getting data  ###################
  const fetchNotificationData = async (page = 1) => {
    const url = `${import.meta.env.VITE_API_URL}/notifications?page=${page}&limit=${limit}&search=${searchQuery}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data) {
        setData(response.data.notifications)
        setPageCount(response.data.totalPages)
        console.log(response.data.notifications)
        console.log(response.data.totalPages)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  // ##################### Filter data by search query #######################
  const filterNotifications = () => {
    if (!searchQuery) {
      setFilteredData(data); // No query, show all drivers
    } else {
      // const filtered = data.filter(
      //   (notification) =>
      //     notification.deviceId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //     notification.type?.name.toLowerCase().includes(searchQuery.toLowerCase())
      // );

      //changed the code as it was getting crashed while searching
      const filtered = data.filter((notification) => {
        const deviceName = notification.deviceId?.name || ''; // Default to empty string if undefined
        const typeName = notification.type?.name || ''; // Default to empty string if undefined
  
        return deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               typeName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredData(filtered);
      setCurrentPage(1);

    }
  };

  useEffect(() => {
    fetchNotificationData()
  }, [searchQuery])

  useEffect(() => {
    filterNotifications(searchQuery);
  }, [data, searchQuery]);

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchNotificationData(page)
  }

  // #########################################################################

  //  ####################  Add Notification ###########################

  const handleAddNotification = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/notifications`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        toast.success('Successfully Notification Created!')
        fetchNotificationData()
        setFormData({})
        setAddModalOpen(false)
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  // ###################################################################
  // ######################### Edit Group #########################

  const handleEditNotification = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('Successfully Notification Updated!')
        fetchNotificationData()
        setFormData({})
        setEditModalOpen(false)
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const handleClickNotification = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log('this is before edit', formData)
  }

  // ###################################################################

  // ###################### Delete Group ##############################

  const handleDeleteNotification = async (item) => {

    const confirmed = confirm('Do you want to delete this notification');
    // added the logic If the user cancels, do nothing
    if (!confirmed) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/${item._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
      
        fetchNotificationData()
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  //  ###############################################################

  useEffect(() => {
    console.log('this is form data...', formData)
  }, [formData])

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Define the columns based on the CTable structure
    const tableColumn = ['SN', 'Device Name', 'Notifications'];

    // Generate rows of data for the PDF
    const tableRows = filteredData.map((item, index) => {
      // Define how to extract the data for each column
      const rowData = [
        index + 1, // Serial Number
        item.deviceId?.name || '--', // Device Name
        item.type.length || '--', // Notifications (assuming type length is what you want here)
        // 'Actions' // Placeholder for Actions, you might want to define specific actions here
      ];

      return rowData;
    });

    // Use autoTable to create the table in the PDF
    doc.autoTable(tableColumn, tableRows, { startY: 20 });

    // Save the generated PDF
    doc.save('table_data.pdf');
  };

  const exportToExcel = () => {
    // Map filtered data into the format required for export
    const dataToExport = filteredData.map((item, rowIndex) => {
      const rowData = {
        SN: rowIndex + 1, // Include row index as SN
        'Device Name': item.deviceId?.name || 'N/A', // Device Name
        'Notifications': item.type.length || '0', // Notifications count
        // 'Actions': 'N/A' // Placeholder for Actions, adjust as needed
      };

      return rowData;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

    // Write the Excel file
    XLSX.writeFile(workbook, 'table_data.xlsx');
  };

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Notifications</h2>
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
              Add Notifications
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
        <CTable style={{fontFamily: "Roboto, sans-serif", fontSize: '14px',}} bordered align="middle" className="mb-2 border min-vh-25 rounded-top-3" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
            <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
               <strong>SN</strong> 
              </CTableHeaderCell>
              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Device Name</strong>
              </CTableHeaderCell>
              {/* <CTableHeaderCell className=" text-center text-white bg-secondary">
                Chennel
              </CTableHeaderCell> */}
              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
                <strong>Notification</strong>
              </CTableHeaderCell>

              <CTableHeaderCell className=" text-center bg-body-secondary text-center sr-no table-cell">
               <strong>Actions</strong>
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <>
                <CTableRow>
                  <CTableDataCell colSpan="4" className="text-center">
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
              </>
            ) : filteredData.length > 0 ? (
              filteredData?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center p-0" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2"}} >{(currentPage - 1) * limit + index + 1}</CTableDataCell>
                  <CTableDataCell className="text-center p-0" style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2"}} >{item.deviceId?.name}</CTableDataCell>
                  {/* <CTableDataCell className="text-center p-0">{item.channel}</CTableDataCell> */}
                  <CTableDataCell className="text-center p-0 " style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2"}} >
                    <CFormSelect
                      id="type"
                      value=""
                      className=" text-center border-2 "
                      style={{ width: '130px', margin: '0 auto' }}
                    >
                      <option value="">{item.type.length}</option>
                      {Array.isArray(item.type) &&
                        item.type.map((typ) => (
                          <option key={typ} value={typ}>
                            {typ}
                          </option>
                        ))}
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-center d-flex p-0"
                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}
                  >
                    <IconButton aria-label="edit" onClick={() => handleClickNotification(item)}>
                      <RiEdit2Fill
                        style={{ fontSize: '20px', color: 'lightBlue', margin: '3px' }}
                      />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteNotification(item)}>
                      <AiFillDelete style={{ fontSize: '20px', color: 'red', margin: '3px' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="4" className="text-center">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: '200px' }}
                  >
                    <p className="mb-0 fw-bold">
                      "Oops! Looks like there's no Notification you have created yet.
                      <br /> Maybe it's time to create new Notification!"
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
                        Create Notification
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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Notification
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleAddModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddNotification}>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Select Group</InputLabel>
                <Select
                  name="groups"
                  onChange={(e) => getDevices(e.target.value)}
                  label="select group..."
                >
                  {groups.map((group) => (
                    <MenuItem key={group._id} value={group._id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Devices</InputLabel>
                <Select
                  name="devices"
                  value={formData.deviceId || []}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  label="Select Devices..."
                  multiple
                >
                  {devices.length > 0 ? (
                    devices?.map((device) => (
                      <MenuItem key={device._id} value={device._id}>
                        {device.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>No device available</MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Notification Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type || []}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Select Notification Type..."
                  multiple
                >
                  {notificationTypes.map((Ntype) => (
                    <MenuItem key={Ntype} value={Ntype}>
                      {Ntype}
                    </MenuItem>
                  ))}
                </Select>
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
              Edit Notification
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleEditModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleEditNotification}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Device"
                  name="device"
                  value={formData.deviceId?.name !== undefined ? formData.deviceId?.name : ''}
                  disabled
                />
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Notification Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type || []}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Select Notification Type..."
                  multiple
                >
                  {notificationTypes.map((Ntype) => (
                    <MenuItem key={Ntype} value={Ntype}>
                      {Ntype}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Edit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}

export default Notification
