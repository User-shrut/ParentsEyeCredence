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
  InputAdornment,
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
import 'jspdf-autotable' // For table formatting in PDF.
import CIcon from '@coreui/icons-react'
import CategoryIcon from '@mui/icons-material/Category'
import { cilSettings } from '@coreui/icons'
import '../../../../src/app.css'
import SearchIcon from '@mui/icons-material/Search'

const Category = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState()
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
  const fetchCategoryData = async (page = 1) => {
    const accessToken = Cookies.get('authToken')
    const url = `${import.meta.env.VITE_API_URL}/category`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data) {
        setData(response.data)
        setPageCount(response.data.totalPages)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  // ##################### Filter data by search query #######################
  const filterCategory = () => {
    if (!searchQuery) {
      setFilteredData(data) // No query, show all drivers
    } else {
      const filtered = data.filter((category) =>
        category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    fetchCategoryData()
  }, [])

  useEffect(() => {
    filterCategory(searchQuery)
  }, [data, searchQuery])

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchCategoryData(page)
  }

  // #########################################################################

  //  ####################  Add Group ###########################

  const handleAddCategory = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/category`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        toast.success('Category is created successfully')
        fetchCategoryData()
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

  const handleEditCategory = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/category/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('Cattegory is edited successfully')
        fetchCategoryData()
        setFormData({ name: '' })
        setEditModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const handleDeleteCategory = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log('this is before edit', formData)
  }

  // ###################################################################

  // ###################### Delete Group ##############################

  const deleteCategorySubmit = async (item) => {
    const confirmed = confirm('Do you want to delete this Category?')
    // If the user cancels, do nothing
    if (!confirmed) return

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/category/${item._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 200) {
        toast.error('category is deleted successfully')
        fetchCategoryData()
      }
    } catch (error) {
      toast.error('An error occurred')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  // /Excel download 

  const exportToExcel = () => {
    // Map filtered data into the format required for export
    const dataToExport = filteredData.map((item, rowIndex) => {
      const rowData = {
        SN: rowIndex + 1, // Serial Number
        'Category Name': item.categoryName || 'N/A', // Category Name
        // 'Actions': 'Edit, Delete'               // Actions placeholder (can be detailed if necessary)
      }

      return rowData
    })

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Category Data')

    // Write the Excel file
    XLSX.writeFile(workbook, 'category_data.xlsx')
  }

  // PDF download 

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    // Add current date
    const today = new Date();
    const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getFullYear().toString()}`;

    // Add "Credence Tracker" heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    const title = 'Credence Tracker';
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 15);

    // Add "Devices Reports" heading
    doc.setFontSize(16);
    const subtitle = 'Categorys Reports';
    const subtitleWidth = doc.getTextWidth(subtitle);
    const subtitleX = (pageWidth - subtitleWidth) / 2;
    doc.text(subtitle, subtitleX, 25);

    // Add current date at the top-right corner
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${date}`, pageWidth - 20, 15, { align: 'right' });

    // Define the table columns
    const tableColumn = ['SN', 'Category Name']; // Define the headers
    const tableRows = filteredData.map((item, index) => {
      // Add rows with category name and serial number
      return [
        index + 1, // Serial Number
        item.categoryName || '--', // Category Name with fallback
      ];
    });

    // Styling for the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30, // Table starts a bit below the headings
      theme: 'grid', // Adds grid theme for table borders
      headStyles: {
        fillColor: [100, 100, 255], // Blue background for header
        textColor: [255, 255, 255], // White text
        fontStyle: 'bold',
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5, // Add more padding for readability
        valign: 'middle',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternating rows
      },
      columnStyles: {
        0: { cellWidth: 'auto' }, // Serial Number should adjust to content
        1: { cellWidth: 'auto' }, // Category Name should adjust to content
      },
      margin: { top: 10, right: 10, bottom: 10, left: 10 }, // Adjust margins
      width: pageWidth - 20, // Ensure the table spans the full width
    });

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the generated PDF
    doc.save(`Category_Reports_${date}.pdf`);
  };


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
            <CCardHeader className="grand d-flex justify-content-between align-items-center">
              <strong>Category</strong>
              <div className="d-flex gap-3">
                {/* <div className="me-3 d-none d-md-block">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search for Category"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div> */}
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
                <div>
                  <button
                    onClick={() => setAddModalOpen(true)}
                    variant="contained"
                    className="btn text-white"
                    style={{ backgroundColor: '#0a2d63', width: '130px' }}
                  >
                    Add Category
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
                  style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px' }}
                  bordered
                  align="middle"
                  className="mb-2 border min-vh-25 rounded-top-3"
                  hover
                  responsive
                >
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell
                        className=" text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        SN
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        className=" text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        Category Name
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        className=" text-center text-white text-center sr-no table-cell"
                        style={{ backgroundColor: '#0a2d63' }}
                      >
                        Actions
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
                            {item.categoryName}
                          </CTableDataCell>
                          <CTableDataCell
                            className="text-center d-flex p-0"
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
                            }}
                          >
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleDeleteCategory(item)}
                            >
                              <RiEdit2Fill
                                style={{ fontSize: '20px', color: 'lightBlue', margin: '3px' }}
                              />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => deleteCategorySubmit(item)}
                            >
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
                              "Oops! Looks like there's no Category available.
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

      {/* Add Modal */}

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
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleAddModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddCategory}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Category Name"
                  name="name"
                  value={formData.categoryName !== undefined ? formData.categoryName : ''}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon
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
              Edit Category
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleEditModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleEditCategory}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Category Name"
                  name="name"
                  value={formData.categoryName !== undefined ? formData.categoryName : ''}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon
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

export default Category
