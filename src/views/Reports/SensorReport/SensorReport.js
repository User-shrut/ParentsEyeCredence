import React from 'react';
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
} from '@coreui/react';
import '../style/remove-gutter.css';
import '../../../utils.css'

const SimpleTable = ({ data }) => {
  return (
    <CTable bordered className="simple-table">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Type</CTableHeaderCell>
          <CTableHeaderCell>Description</CTableHeaderCell>
          <CTableHeaderCell>Calendar</CTableHeaderCell>
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
  );
};

const Validation = () => {
  const sampleData = [

  ];

  return (
    <>
      {/* <h3>Scheduled Reports</h3>
      <SimpleTable data={sampleData} /> */}

      <CRow className='pt-3 gutter-0'>
        <h2 className="px-4">Sensor Report</h2>

        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center text-white">
              <strong>All Schedule Reports List</strong>
            </CCardHeader>
            <SimpleTable data={sampleData} />
          </CCard>
        </CCol>
      </CRow>

    </>
  );
};

export default Validation;
