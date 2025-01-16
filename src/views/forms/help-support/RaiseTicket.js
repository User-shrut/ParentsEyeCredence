/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import './index.css'
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import DateRangeFilter from '../../../components/DateRangeFIlter/DateRangeFIlter'
import { Fullscreen } from 'lucide-react'
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
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormSelect,
  CInputGroupText,
  CInputGroup,
  CFormTextarea,
} from '@coreui/react'
import { Paper, TableContainer, IconButton, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

function Contact() {
  const [activeButton, setActiveButton] = useState(null) // State to track the active button
  const [selectedTicketType, setSelectedTicketType] = useState('') // State for selected ticket type
  const [ticket, setTicket] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const addedFilterTitle = 'Added Date Filter'
  const updateFilterTitle = 'Update Date Filter'

  const ticketTypes = [
    'Vehicle Offline',
    'Account Related',
    'Software Demo',
    'Video Demo Request',
    'Explain Software Feature',
    'Software Error',
    'Other',
  ]

  const handleChange = (event) => {
    setSelectedTicketType(event.target.value)
  }

  const handleButtonClick = (buttonType) => {
    if (activeButton === buttonType) {
      // If the button is already active, toggle it off
      setActiveButton(null)
    } else {
      // Set the clicked button as active
      setActiveButton(buttonType)
    }
  }

  const handleDateRangeChange = (startDate, endDate) => {
    console.log('Date range changed:', { startDate, endDate })
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  }

  const handleAddTicket = () => {
    setVisible(true)
  }

  return (
    <>
      <div style={containerStyle}>
        {/**HEADER */}
        <div
          className="shadow d-flex align-items-center ps-3 mb-3"
          style={{
            width: Fullscreen,
            height: '50px',
            backgroundColor: '#0a2d63',
            color: 'white',
            fontWeight: '600',
          }}
        >
          <h5>Raise Ticket</h5>
        </div>
        <div className="d-flex flex-column px-3">
          {/* BUTTON FILTERS */}
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-2">
              <button
                className={`btn button-all-filter fw-semibold ${
                  activeButton === 'all' ? 'active' : ''
                }`}
                onClick={() => handleButtonClick('all')}
              >
                All :
              </button>
              <button
                className={`btn button-pending-filter fw-semibold ${
                  activeButton === 'pending' ? 'active' : ''
                }`}
                onClick={() => handleButtonClick('pending')}
              >
                PENDING :
              </button>
              <button
                className={`btn button-answered-filter fw-semibold ${
                  activeButton === 'answered' ? 'active' : ''
                }`}
                onClick={() => handleButtonClick('answered')}
              >
                ANSWERED :
              </button>
              <button
                className={`btn button-closed-filter fw-semibold ${
                  activeButton === 'closed' ? 'active' : ''
                }`}
                onClick={() => handleButtonClick('closed')}
              >
                CLOSED :
              </button>
            </div>
            <div>
              <span
                className="btn border-0 back-hover"
                style={{ fontWeight: '600' }}
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </span>
            </div>
          </div>

          {/* DROPDOWN FILTERS */}
          <div className="d-flex gap-5 align-items-center mt-3">
            <div>
              {/**TICKET TYPES */}
              <CForm className="row g-3">
                <CCol>
                  <CFormSelect id="inputState" style={{ width: '300px', height: '40px' }}>
                    <option>Ticket Type</option>
                    {ticketTypes.map((type, key) => (
                      <option key={key}>{type}</option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CForm>
            </div>
            <div className="d-flex gap-5">
              {/**RANGE DATE ADDED FILTER */}
              <div>
                <DateRangeFilter
                  onDateRangeChange={handleDateRangeChange}
                  title={addedFilterTitle}
                />
              </div>
              {/**RANGE DATE ADDED FILTER */}
              <div>
                <DateRangeFilter
                  onDateRangeChange={handleDateRangeChange}
                  title={updateFilterTitle}
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        {/**TABLE */}
        <div className="px-3">
          <CRow>
            <CCol xs>
              <CCard className="mb-4">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InputBase
                      type="search"
                      className="form-control border-end-0 rounded-0"
                      style={{ height: '40px', width: '250px' }} // Adjust width as per your preference
                      placeholder="Search for Tickets"
                    />
                    <IconButton
                      className="bg-white rounded-0 border disable"
                      style={{ height: '40px' }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                  <div>
                    <button className="btn add" onClick={handleAddTicket}>
                      <Plus size={18} /> Add
                    </button>
                  </div>
                </CCardHeader>
                <TableContainer
                  component={Paper}
                  sx={{
                    height: 'auto',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    // marginBottom: '10px',
                    // borderRadius: '5px',
                    // border: '1px solid black',
                  }}
                >
                  <CCardBody>
                    <CTable
                      className="mb-0 border rounded-4"
                      style={{ fontSize: '14px' }}
                      bordered
                      align="middle"
                      hover
                      responsive
                    >
                      <CTableHead className="text-nowrap">
                        <CTableRow className="bg-body-tertiary">
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            SN
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Ticket Id
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Ticket Type
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Status
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Added
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Updated
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Ticket Type
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Updated
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Description
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            className="text-center text-white text-center sr-no table-cell"
                            style={{ backgroundColor: '#0a2d63' }}
                          >
                            Reopen
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableDataCell colSpan="10" className="text-center">
                            {ticket !== 0 ? (
                              <p>No Tickets Available</p>
                            ) : (
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
                                <p className="card-text placeholder-glow">
                                  <span className="placeholder col-12" />
                                </p>
                                <p className="card-text placeholder-glow">
                                  <span className="placeholder col-12" />
                                </p>
                              </div>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </TableContainer>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <CModal
          alignment="center"
          scrollable
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="UserSupportTicket"
          size="lg"
        >
          <CModalHeader>
            <CModalTitle id="UserSupportTicket">User Support Tickets</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3">
              <CCol md={4}>
                <CFormSelect id="inputState" label="Group (Optional)"></CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect id="inputState" label="Vehicle (Optional)"></CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect id="inputState" label="Ticket Type *" required>
                  <option>Ticket Type</option>
                  {ticketTypes.map((type, key) => (
                    <option key={key}>{type}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CInputGroup>
                <CInputGroupText>Description</CInputGroupText>
                <CFormTextarea aria-label="With textarea"></CFormTextarea>
              </CInputGroup>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              type="submit"
              style={{ backgroundColor: '#0a2d63', color: 'white' }}
              onClick={() => setVisible(false)}
            >
              Submit
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    </>
  )
}

export default Contact
