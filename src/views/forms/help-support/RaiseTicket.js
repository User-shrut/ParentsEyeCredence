/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Select from 'react-select'
import axios from 'axios'
import Cookies from 'js-cookie'
import { IconButton, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormSelect,
  CInputGroupText,
  CInputGroup,
  CFormTextarea,
  CButton,
} from '@coreui/react'
import './index.css'
import DateRangeFilter from '../../../components/DateRangeFIlter/DateRangeFIlter'
import { Pagination } from 'react-bootstrap'
import { jwtDecode } from 'jwt-decode'

const TICKET_TYPES = [
  'Vehicle Offline',
  'Account Related',
  'Software Demo',
  'Video Demo Request',
  'Explain Software Feature',
  'Software Error',
  'Other',
]

function Contact() {
  const { deviceId: urlDeviceId } = useParams()
  const navigate = useNavigate()
  const token = Cookies.get('authToken')
  let decodedToken
  if (token) {
    decodedToken = jwtDecode(token)
  }
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', decodedToken)

  // State
  const [activeButton, setActiveButton] = useState(null)
  const [vehicleData, setVehicleData] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [vehicleId, setVehicleId] = useState(urlDeviceId || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [formData, setFormData] = useState({
    vehicle: '',
    ticketType: '',
    description: '',
  })
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    answered: 0,
    closed: 0,
  })
  const [ticketData, setTicketData] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  // Fetch vehicles
  const fetchDevices = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/device`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const devices = response.data.devices.map((device) => ({
        value: device._id,
        label: device.name,
      }))
      setVehicleData(devices)
    } catch (error) {
      console.error('Error fetching devices:', error.message)
    }
  }, [token])

  // Fetch Post Raise ticket
  const fetchRaiseTicket = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/help-and-support/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        },
      )
      setVisible(false)
      setFormData({ vehicle: '', ticketType: '', description: '' })
    } catch (error) {
      console.error('Error raising ticket:', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Get Raise Ticket
  const fetchRaiseTicketGet = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/help-and-support/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('Ticket Data Response:', response.data.issues) // Check the structure
      const filteredTicketsRaisedBy = response.data.issues.filter(
        (ticket) => ticket.raisedBy === decodedToken.username,
      )
      setTicketData(filteredTicketsRaisedBy)
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    fetchRaiseTicket()
    fetchRaiseTicketGet()
    console.log('FETCH HUA')
  }

  const handleDeviceChange = (selectedOption) => {
    setVehicleId(selectedOption ? selectedOption.value : '')
    setFormData((prev) => ({ ...prev, vehicle: selectedOption ? selectedOption.value : '' }))
  }

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sortedData = [...ticketData].sort((a, b) => {
      const aValue = a[key] ?? '' // Handle null/undefined
      const bValue = b[key] ?? ''

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      } else if (aValue instanceof Date && bValue instanceof Date) {
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      } else {
        return direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      }
    })

    setTicketData(sortedData)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  const handleButtonClick = (buttonType) => {
    setActiveButton(activeButton === buttonType ? null : buttonType)
    setFilterStatus(buttonType)
  }

  const handleDateRangeChange = (startDate, endDate) => {
    console.log('Date range changed:', { startDate, endDate })
    setStartDate(startDate)
    setEndDate(endDate)
  }

  useEffect(() => {
    fetchDevices()
    fetchRaiseTicketGet()
  }, [])

  useEffect(() => {
    // Calculate counts for each status
    const counts = {
      all: ticketData.length,
      pending: ticketData.filter((ticket) => ticket.status === 'pending').length,
      answered: ticketData.filter((ticket) => ticket.status === 'answered').length,
      closed: ticketData.filter((ticket) => ticket.status === 'closed').length,
    }
    setStatusCounts(counts)
    console.log('counts', counts)
    console.log('assssssssssssssssssssssss', vehicleData)
    console.log('lllllllllllllllllllllllllllllllllllllllllllllll', decodedToken.username)
  }, [ticketData])

  //   const filteredTickets = ticketData.filter((ticket) => {
  //     if (!ticket) return false

  //     const ticketDateAdded = new Date(ticket.createdAt);
  //     const ticketDateUpdated = new Date(ticket.updatedAt);
  //     console.log("ticketDateAdded", ticketDateAdded);
  //     // console.log("ticketDateUpdated", ticketDateUpdated);

  //     const matchesSearchTerm = (
  //       ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  //     );

  //     const matchesDateRange = (
  //       (startDate ? ticketDateAdded >= startDate : true) &&
  //       (endDate ? ticketDateAdded <= new Date(endDate.setHours(23, 59, 59, 999)) : true) &&
  //       (startDate ? ticketDateUpdated >= startDate : true) &&
  //       (endDate ? ticketDateUpdated <= new Date(endDate.setHours(23, 59, 59, 999)) : true)
  //     );

  //     return matchesSearchTerm && matchesDateRange;
  // });

  // Helper function to format the date

  // Preprocess startDate and endDate

  const filteredTickets = ticketData.filter((ticket) => {
    if (!ticket) return false

    // Ticket type filter
    const matchesTicketType = formData.ticketType ? ticket.ticketType === formData.ticketType : true

    // Status filter
    const matchesStatus = filterStatus === 'all' ? true : ticket.status === filterStatus

    // Search term filter
    const matchesSearchTerm = searchTerm
      ? ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    // Date range filter
    const processedStartDate = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null
    const processedEndDate = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null
    const ticketDateAdded = new Date(ticket.createdAt)
    const ticketDateUpdated = new Date(ticket.updatedAt)

    const matchesDateRange =
      (processedStartDate ? ticketDateAdded >= processedStartDate : true) &&
      (processedEndDate ? ticketDateAdded <= processedEndDate : true) &&
      (processedStartDate ? ticketDateUpdated >= processedStartDate : true) &&
      (processedEndDate ? ticketDateUpdated <= processedEndDate : true)

    // Combine all filters
    return matchesTicketType && matchesStatus && matchesSearchTerm && matchesDateRange
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  // PAGINATION LOGIN
  const [rowsPerPage, setRowsPerPage] = useState(5) // Default to 5 rows per page

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // Change as needed
  const totalPages = rowsPerPage === 'All' ? 1 : Math.ceil(filteredTickets.length / rowsPerPage)
  const paginatedTickets =
    rowsPerPage === 'All'
      ? filteredTickets
      : filteredTickets.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div
        className="shadow d-flex align-items-center ps-3 mb-3 text-white"
        style={{ backgroundColor: '#0a2d63', height: '50px' }}
      >
        <h5 className="m-0">Raise Ticket</h5>
      </div>

      <div className="px-3">
        {/* Button Filters */}
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-2">
            {['all', 'pending', 'answered', 'closed'].map((type) => (
              <button
                key={type}
                className={`btn button-${type}-filter fw-bold ${
                  activeButton === type ? 'active' : ''
                }`}
                onClick={() => handleButtonClick(type)}
                style={{ fontSize: '14px' }}
              >
                {type.toUpperCase()} : {statusCounts[type] || 0}
              </button>
            ))}
          </div>
          <button
            className="btn border-0 back-hover fw-semibold"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
        <hr />
        {/* Table */}
        <CRow>
          <CCol xs>
            <CCard className="mb-4">
              <CCardHeader className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3">
                  <div className="d-flex align-items-center">
                    <InputBase
                      type="search"
                      className="form-control border-end-0 rounded-0"
                      style={{ height: '40px', width: '250px' }}
                      placeholder="Search for Tickets"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton
                      className="bg-white rounded-0 border disable"
                      style={{ height: '40px' }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                  {/* Filters */}
                  <div className="d-flex gap-3 align-items-center">
                    <CFormSelect
                      style={{ width: '300px', height: '40px' }}
                      value={formData.ticketType}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, ticketType: e.target.value }))
                      }
                    >
                      <option value="" disabled>
                        Ticket Types
                      </option>
                      <option value="">All</option>

                      {TICKET_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </CFormSelect>

                    <div className="d-flex gap-3">
                      <DateRangeFilter
                        onDateRangeChange={handleDateRangeChange}
                        title="Added Date Filter"
                      />
                      <DateRangeFilter
                        onDateRangeChange={handleDateRangeChange}
                        title="Update Date Filter"
                      />
                    </div>
                  </div>
                </div>
                <button className="btn add" onClick={() => setVisible(true)}>
                  <Plus size={18} /> Add
                </button>
              </CCardHeader>

              <CCardBody>
                <CTable bordered hover responsive className="mb-0 border rounded-4">
                  <CTableHead>
                    <CTableRow>
                      {[
                        'ticketId',
                        'raisedBy',
                        'vehicleNo',
                        'ticketType',
                        'status',
                        'added',
                        'updated',
                        'description',
                      ].map((key) => (
                        <CTableHeaderCell
                          style={{ backgroundColor: '#0a2d63' }}
                          key={key}
                          onClick={() => handleSort(key)}
                          className="text-center text-white cursor-pointer"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)} {getSortIcon(key)}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody style={{ fontSize: '14px' }}>
                    {loading ? (
                      <CTableRow>
                        <CTableDataCell colSpan={8} className="text-center">
                          <div className="placeholder-glow">
                            {[...Array(4)].map((_, index) => (
                              <p key={index} className="card-text placeholder-glow">
                                <span className="placeholder col-12" />
                              </p>
                            ))}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : paginatedTickets.length > 0 ? (
                      paginatedTickets.map((ticket) => (
                        <CTableRow key={ticket.id}>
                          <CTableDataCell>{ticket.ticketId}</CTableDataCell>
                          <CTableDataCell>{ticket.raisedBy || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{ticket.vehicleName || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{ticket.ticketType}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              className={`badge ${
                                ticket.status === 'pending'
                                  ? 'bg-danger'
                                  : ticket.status === 'answered'
                                    ? 'bg-warning'
                                    : ticket.status === 'closed'
                                      ? 'bg-success'
                                      : 'bg-info'
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{formatDate(ticket.createdAt)}</CTableDataCell>
                          <CTableDataCell>{formatDate(ticket.updatedAt)}</CTableDataCell>
                          <CTableDataCell>{ticket.description}</CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={8} className="text-center">
                          No Tickets Available
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                {/* Pagination */}
                {rowsPerPage !== 'All' && (
                  <div className="mt-3 d-flex justify-content-center">
                    <Pagination>
                      <Pagination.Prev
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />

                      {/* Add "First" and ellipsis if needed */}
                      {currentPage > 3 && (
                        <>
                          <Pagination.Item onClick={() => setCurrentPage(1)}>1</Pagination.Item>
                          {currentPage > 4 && <Pagination.Ellipsis />}
                        </>
                      )}

                      {/* Generate pages around the current page */}
                      {Array.from({ length: 5 }, (_, i) => {
                        const page = currentPage - 2 + i
                        if (page > 0 && page <= totalPages) {
                          return (
                            <Pagination.Item
                              key={page}
                              active={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Pagination.Item>
                          )
                        }
                        return null
                      })}

                      {/* Add ellipsis and "Last" if needed */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && <Pagination.Ellipsis />}
                          <Pagination.Item onClick={() => setCurrentPage(totalPages)}>
                            {totalPages}
                          </Pagination.Item>
                        </>
                      )}

                      <Pagination.Next
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
                {/* Rows Per Page Selector */}
                <div className="mb-3 mt-3 d-flex justify-content-center gap-3 align-items-center">
                  <span>
                    Showing {paginatedTickets.length} of {filteredTickets.length} tickets
                  </span>
                  <div className="d-flex align-items-center gap-2">
                    <CFormSelect
                      value={rowsPerPage}
                      onChange={(e) => {
                        const value =
                          e.target.value === 'Custom'
                            ? 'Custom'
                            : e.target.value === 'All'
                              ? 'All'
                              : parseInt(e.target.value, 10)
                        setRowsPerPage(value)
                        setCurrentPage(1) // Reset to first page when rows per page changes
                      }}
                      style={{ width: '80px' }}
                    >
                      <option value="All">All</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </CFormSelect>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {/* Add Ticket Modal */}
      <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>User Support Tickets</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={handleFormSubmit}>
            <CCol md={6}>
              <CFormLabel htmlFor="vehicle">Vehicle (optional)</CFormLabel>
              <Select
                id="vehicle-type"
                value={vehicleData.find((option) => option.value === formData.vehicle)}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({ ...prev, vehicle: selectedOption?.label || '' }))
                }
                options={vehicleData}
                placeholder="Search for Vehicle"
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect
                id="ticketType"
                label="Ticket Type *"
                required
                value={formData.ticketType}
                onChange={(e) => setFormData((prev) => ({ ...prev, ticketType: e.target.value }))}
              >
                <option value="">Select Ticket Type</option>
                {TICKET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CInputGroup>
              <CInputGroupText>Description</CInputGroupText>
              <CFormTextarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </CInputGroup>
            <CButton
              type="submit"
              className="text-white"
              style={{ backgroundColor: '#0a2d63' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Contact
