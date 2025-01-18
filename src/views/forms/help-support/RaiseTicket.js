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
  const statusCounts = {
    all: 100,
    pending: 20,
    answered: 50,
    closed: 30,
  }

  const [ticketData, setTicketData] = useState([])

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
      setTicketData(response.data.issues)
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
  }

  const handleDateRangeChange = (startDate, endDate) => {
    console.log('Date range changed:', { startDate, endDate })
  }

  useEffect(() => {
    fetchDevices()
    fetchRaiseTicketGet()
  }, [])

  const filteredTickets = ticketData.filter((ticket) => {
    if (!ticket) return false

    const searchLower = (searchTerm || '').toLowerCase()
    const ticketIdLower = (ticket.ticketId || '').toLowerCase()
    const ticketTypeLower = (ticket.ticketType || '').toLowerCase()
    const descriptionLower = (ticket.description || '').toLowerCase()

    return (
      ticketIdLower.includes(searchLower) ||
      ticketTypeLower.includes(searchLower) ||
      descriptionLower.includes(searchLower)
    )
  })

  // Helper function to format the date
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
                className={`btn button-${type}-filter fw-semibold ${
                  activeButton === type ? 'active' : ''
                }`}
                onClick={() => handleButtonClick(type)}
              >
                {type.toUpperCase()} :
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

        {/* Filters */}
        <div className="d-flex gap-5 align-items-center mt-3">
          <CFormSelect
            style={{ width: '300px', height: '40px' }}
            value={formData.ticketType}
            onChange={(e) => setFormData((prev) => ({ ...prev, ticketType: e.target.value }))}
          >
            <option value="">Ticket Type</option>
            {TICKET_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </CFormSelect>

          <div className="d-flex gap-5">
            <DateRangeFilter onDateRangeChange={handleDateRangeChange} title="Added Date Filter" />
            <DateRangeFilter onDateRangeChange={handleDateRangeChange} title="Update Date Filter" />
          </div>
        </div>

        <hr />

        {/* Table */}

        <CRow>
          <CCol xs>
            <CCard className="mb-4">
              <CCardHeader className="d-flex justify-content-between align-items-center">
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
                                  ? 'bg-warning'
                                  : ticket.status === 'answered'
                                    ? 'bg-success'
                                    : ticket.status === 'closed'
                                      ? 'bg-secondary'
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
                      {Array.from({ length: totalPages }, (_, index) => (
                        <Pagination.Item
                          key={index}
                          active={index + 1 === currentPage}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
                {/* Rows Per Page Selector */}
                <div className="mb-3 d-flex justify-content-center gap-3 align-items-center">
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
                id="vehicle"
                value={vehicleData.find((vehicle) => vehicle.value === vehicleId)}
                onChange={handleDeviceChange}
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
