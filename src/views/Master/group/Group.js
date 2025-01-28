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
  InputAdornment,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
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
import * as XLSX from 'xlsx' // For Excel export
import jsPDF from 'jspdf' // For PDF export
import 'jspdf-autotable' // For table formatting in PDF
import CIcon from '@coreui/icons-react'
import GroupIcon from '@mui/icons-material/Group'
import { cilSettings } from '@coreui/icons'
import '../../../../src/app.css'
import SearchIcon from '@mui/icons-material/Search'

const Group = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState()
  // const handleEditModalClose = () => setEditModalOpen(false)
  // const handleAddModalClose = () => setAddModalOpen(false)
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const handleEditModalClose = () => {
    setFormData({})
    setEditModalOpen(false)
  }

  const handleAddModalClose = () => {
    setFormData({})
    setAddModalOpen(false)
  }

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

  // ##################### getting data  ###################
  const fetchGroupData = async (page = 1) => {
    const accessToken = Cookies.get('authToken')
    const url = `${import.meta.env.VITE_API_URL}/group?page=${page}&limit=${limit}&search=${searchQuery}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data.groups) {
        setData(response.data.groups)
        setPageCount(response.data.totalPages)
        console.log(response.data.groups)
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
  const filterGroups = () => {
    if (!searchQuery) {
      setFilteredData(data) // No query, show all drivers
    } else {
      const filtered = data.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    fetchGroupData()
  }, [limit, searchQuery])

  useEffect(() => {
    filterGroups(searchQuery)
  }, [data, searchQuery])

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchGroupData(page)
  }

  // #########################################################################

  //  ####################  Add Group ###########################

  const handleAddGroup = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/group`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        toast.success('group is created successfully')
        fetchGroupData()
        setFormData({ name: '' })
        setAddModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  // ###################################################################
  // ######################### Edit Group #########################

  const EditGroupSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/group/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('group is edited successfully')
        fetchGroupData()
        setFormData({ name: '' })
        setEditModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const handleEditGroup = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log('this is before edit', formData)
  }

  // ###################################################################

  // ###################### Delete Group ##############################

  const deleteGroupSubmit = async (item) => {
    const confirmed = confirm('Do you want to delete this user?')

    // If the user cancels, do nothing
    if (!confirmed) return

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/group/${item._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 200) {
        toast.error('group is deleted successfully') //success toast added in place of error
        fetchGroupData()
      }
    } catch (error) {
      toast.error('An error occurred')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const exportToExcel = () => {
    // Map filtered data into the format required for export
    const dataToExport = filteredData.map((item, rowIndex) => {
      const rowData = {
        SN: rowIndex + 1,
        Name: item.name || 'N/A',
      }

      return rowData
    })

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport) // Convert data to worksheet format
    const workbook = XLSX.utils.book_new() // Create a new workbook

    // Append the worksheet to the workbook with the sheet name 'User Data'
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Group Data')

    // Write the Excel file to the client's computer
    XLSX.writeFile(workbook, 'group_data.xlsx')
  }

  // PDF CODE

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    })

    // Add current date
    const today = new Date()
    const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getFullYear().toString()}`

    // Add "Credence Tracker" heading
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    const title = 'Credence Tracker'
    const pageWidth = doc.internal.pageSize.width
    const titleWidth = doc.getTextWidth(title)
    const titleX = (pageWidth - titleWidth) / 2
    doc.text(title, titleX, 15)

    // Add "Devices Reports" heading
    doc.setFontSize(16)
    const subtitle = 'Groups Reports'
    const subtitleWidth = doc.getTextWidth(subtitle)
    const subtitleX = (pageWidth - subtitleWidth) / 2
    doc.text(subtitle, subtitleX, 25)

    // Add current date at the top-right corner
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${date}`, pageWidth - 20, 15, { align: 'right' })

    // Define the table headers
    const tableColumn = ['SN', 'Group Name']

    // Map over your filteredData to create rows
    const tableRows = filteredData.map((item, rowIndex) => [
      rowIndex + 1, // Serial Number
      item.name || '--', // Group Name
    ])

    // Create table using autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Start below the headings
      theme: 'grid', // Apply a clean grid style
      headStyles: {
        fillColor: [100, 100, 255], // Blue header background
        textColor: [255, 255, 255], // White text
        fontStyle: 'bold',
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternating rows
      },
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
    })

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, {
        align: 'center',
      })
    }

    // Save the PDF
    doc.save(`group_data_${date}.pdf`)
  }

  // Add this before the return statement
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]?.toLowerCase() || ''
      const bValue = b[sortConfig.key]?.toLowerCase() || ''

      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })
  }, [filteredData, sortConfig])

  // Add this function with other handlers
  const handleHeaderClick = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }
  //  ###############################################################

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-md-none mb-2">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Group</strong>
              <div className="d-flex">
                {/* <div className="me-3 d-none d-md-block">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search for Group"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div> */}
                <div className="me-3 d-none d-md-block">
                  <div className="input-group">
                    <InputBase
                      type="search"
                      className="form-control border"
                      style={{ height: '40px' }}
                      placeholder="Search for Device"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IconButton
                      className="bg-white rounded-end border disable"
                      style={{ height: '40px' }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setAddModalOpen(true)}
                    variant="contained"
                    className="btn text-white"
                    style={{ backgroundColor: '#0a2d63' }}
                  >
                    Add Group
                  </button>
                </div>
              </div>
            </CCardHeader>
            <TableContainer
              component={Paper}
              sx={{
                height: 'auto', // Set the desired height
                overflowX: 'auto', // Enable horizontal scrollbar
                overflowY: 'auto', // Enable vertical scrollbar if needed
                // marginBottom: '10px',
                // borderRadius: '10px',
                // border: '1px solid black',
              }}
            >
              <CCardBody>
                <CTable
                  style={{ fontSize: '14px' }}
                  bordered
                  align="middle"
                  className="mb-2 border min-vh-25 rounded-top-3"
                  hover
                  responsive
                >
                  <CTableHead
                    style={{ fontSize: '14px' }}
                    bordered
                    align="middle"
                    className="mb-2 border min-vh-25 rounded-top-3"
                    hover
                    responsive
                  >
                    <CTableRow style={{ height: '6vh' }} className="text-nowrap ">
                      <CTableHeaderCell
                        className=" text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        <strong>SN</strong>
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        className=" text-center text-white text-center sr-no table-cell"
                        style={{
                          backgroundColor: '#0a2d63',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                        onClick={() => handleHeaderClick('name')}
                      >
                        <strong>Group Name</strong>
                        {sortConfig.key === 'name' &&
                          (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        className=" text-center text-white text-center sr-no table-cell"
                        style={{
                          backgroundColor: '#0a2d63',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                        onClick={() => handleHeaderClick('action')}
                      >
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
                      sortedData?.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell
                            className="text-center p-0"
                            style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                          >
                            {(currentPage - 1) * limit + index + 1}
                          </CTableDataCell>
                          <CTableDataCell
                            className="text-center p-0"
                            style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2' }}
                          >
                            {item.name}
                          </CTableDataCell>
                          <CTableDataCell
                            className="text-center d-flex p-0"
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                            }}
                          >
                            <IconButton aria-label="edit" onClick={() => handleEditGroup(item)}>
                              <RiEdit2Fill
                                style={{ fontSize: '20px', color: 'lightBlue', margin: '3px' }}
                              />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => deleteGroupSubmit(item)}>
                              <AiFillDelete
                                style={{ fontSize: '20px', color: 'red', margin: '3px' }}
                              />
                            </IconButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="3" className="text-center">
                          <div
                            className="d-flex flex-column justify-content-center align-items-center"
                            style={{ height: '200px' }}
                          >
                            <p className="mb-0 fw-bold">
                              "Oops! Looks like there's no Groups available.
                              <br /> Maybe it's time to create some Groups!"
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
                                Add Group
                              </button>
                            </div>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </TableContainer>
          </CCard>
        </CCol>
      </CRow>

      <CDropdown className="position-fixed bottom-0 end-0 m-3">
        <CDropdownToggle
          color="secondary"
          style={{ borderRadius: '50%', padding: '10px', height: '48px', width: '48px' }}
        >
          <CIcon icon={cilSettings} />
        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem onClick={exportToPDF}>PDF</CDropdownItem>
          <CDropdownItem onClick={exportToExcel}>Excel</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      <div className="d-flex justify-content-center align-items-center">
        <div className="d-flex">
          {/* Pagination */}
          <div className="me-3">
            {' '}
            {/* Adds margin to the right of pagination */}
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
          <div style={{ width: '90px' }}>
            <CFormSelect
              aria-label="Default select example"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              options={[
                { label: '10', value: '10' },
                { label: '50', value: '50' },
                { label: '500', value: '500' },
                { label: 'All', value: '' },
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
              Add New Group
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleAddModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddGroup}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Group Name"
                  name="name"
                  value={formData.name !== undefined ? formData.name : ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon
                          sx={{
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.54)',
                            color: 'white',
                            padding: '5px',
                            fontSize: '28px',
                          }}
                        />
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
            <form onSubmit={EditGroupSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Group Name"
                  name="name"
                  value={formData.name !== undefined ? formData.name : ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon
                          sx={{
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.54)',
                            color: 'white',
                            padding: '5px',
                            fontSize: '28px',
                          }}
                        />
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
                Edit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}

export default Group
