import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CFormLabel,
  CFormFeedback,
} from '@coreui/react'
import '../style/remove-gutter.css'
import '../../../utils.css'
import { TableContainer, Paper } from '@mui/material'

const SimpleTable = ({ data }) => {
  return (
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
        <CTable bordered className="simple-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ backgroundColor: '#0a2d63', color: 'white' }}>
                Type
              </CTableHeaderCell>
              <CTableHeaderCell style={{ backgroundColor: '#0a2d63', color: 'white' }}>
                Description
              </CTableHeaderCell>
              <CTableHeaderCell style={{ backgroundColor: '#0a2d63', color: 'white' }}>
                Calendar
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{item.Type}</CTableDataCell>
                <CTableDataCell>{item.Description}</CTableDataCell>
                <CTableDataCell>{item.Calendar}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </TableContainer>
  )
}

const Validation = () => {
  const sampleData = []

  return (
    <>
      {/* <h3>Scheduled Reports</h3>
      <SimpleTable data={sampleData} /> */}

      <CRow className="pt-3 gutter-0">
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="grand d-flex justify-content-between align-items-center">
              <strong>Sensor Report</strong>
            </CCardHeader>
            <SimpleTable data={sampleData} />
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Validation
