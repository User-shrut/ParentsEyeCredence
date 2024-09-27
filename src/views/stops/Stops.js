import React, { useEffect, useState } from 'react';
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
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const CustomForm = ({ formData, handleInputChange, handleSubmit, devices, columns }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
    } else {
      handleSubmit();
    }
  };

  const handlePeriodChange = (value) => {
    handleInputChange('Periods', value);
    setShowDateInputs(value === 'Custom');
  };

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      {/* Devices Dropdown */}
      <CCol md={4}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        <CFormSelect
          id="devices"
          required
          value={formData.Devices}
          onChange={(e) => handleInputChange('Devices', e.target.value)}
        >
          <option value="">Choose a device...</option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>{device.name}</option>
          ))}
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>

      {/* Periods Dropdown */}
      <CCol md={4}>
        <CFormLabel htmlFor="periods">Periods</CFormLabel>
        <CFormSelect
          id="periods"
          required
          value={formData.Periods}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="">Choose a period...</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="This Week">This Week</option>
          <option value="Previous Week">Previous Week</option>
          <option value="This Month">This Month</option>
          <option value="Previous Month">Previous Month</option>
          <option value="Custom">Custom</option>
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid period.</CFormFeedback>
      </CCol>

      {/* Custom Date Inputs */}
      {showDateInputs && (
        <>
          <CCol md={4}>
            <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
            <CFormInput
              type="date"
              id="fromDate"
              value={formData.FromDate}
              onChange={(e) => handleInputChange('FromDate', e.target.value)}
              required
            />
            <CFormFeedback invalid>Please provide a valid from date.</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="toDate">To Date</CFormLabel>
            <CFormInput
              type="date"
              id="toDate"
              value={formData.ToDate}
              onChange={(e) => handleInputChange('ToDate', e.target.value)}
              required
            />
            <CFormFeedback invalid>Please provide a valid to date.</CFormFeedback>
          </CCol>
        </>
      )}

      {/* Show Button */}
      <CCol xs={12}>
        <div className="d-flex justify-content-end">
          <Button
            variant="outlined"
            color="secondary"
            type="submit"
            endIcon={<ArrowDropDownIcon />}
          >
            Show Now
          </Button>
        </div>
      </CCol>
    </CForm>
  );
};

const CustomTable = ({ rows, selectedColumn }) => (
  <CTable borderless className="custom-table">
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell>Sr.No</CTableHeaderCell>
        <CTableHeaderCell>Devices</CTableHeaderCell>
        <CTableHeaderCell>Fix Time</CTableHeaderCell>
        <CTableHeaderCell>{selectedColumn}</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      {rows.map((row, index) => (
        <CTableRow key={index} className="custom-row">
          <CTableDataCell>{index + 1}</CTableDataCell>
          <CTableDataCell>{row.Devices}</CTableDataCell>
          <CTableDataCell>{row.Details}</CTableDataCell>
          <CTableDataCell>{row[selectedColumn]}</CTableDataCell>
        </CTableRow>
      ))}
    </CTableBody>
  </CTable>
); 

const StopagePage = () => {
  const [formData, setFormData] = useState({ Devices: '', Periods: '', FromDate: '', ToDate: '', Columns: '' });
  const [rows, setRows] = useState([]);
  const [devices, setDevices] = useState([]);
  const [columns] = useState(['Start Date', 'Distance', 'Odometer Start', 'Odometer End', 'Average Speed', 'Maximum Speed', 'Engine Hours', 'Spent Fuel']);
  const [selectedColumn, setSelectedColumn] = useState(''); 

  useEffect(() => {
    // Fetch devices
    const fetchDevices = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGM1ZjI4M2Q4ODRkM2E0M2U3MjMiLCJlbWFpbCI6Inlhc2hAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQkh6dDZ1NGJwNE01S3hZYXA5U2xYdTQ3clVidUtsVlQvSlFWUkxEbHFQcVY4L1A3OTlXb2kiLCJ1c2VybmFtZSI6Inlhc2giLCJjcmVhdGVkQnkiOiI2NmYyODQ3MGRlOGRkZTA1Zjc0YTdkOTgiLCJub3RpZmljYXRpb24iOnRydWUsImRldmljZXMiOnRydWUsImRyaXZlciI6dHJ1ZSwiZ3JvdXBzIjp0cnVlLCJjYXRlZ29yeSI6dHJ1ZSwibW9kZWwiOnRydWUsInVzZXJzIjp0cnVlLCJyZXBvcnQiOnRydWUsInN0b3AiOnRydWUsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOnRydWUsImhpc3RvcnkiOnRydWUsInNjaGVkdWxlcmVwb3J0cyI6dHJ1ZSwic3RhdGlzdGljcyI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJzdW1tYXJ5Ijp0cnVlLCJjdXN0b21DaGFydHMiOnRydWUsIl9fdiI6MH0sImlhdCI6MTcyNzMzMzc3OX0.np-i9Kd821Y7BBU_G6ul_RuAUACJVz8OOxO53JvRS-c';
        const response = await fetch('https://credence-tracker.onrender.com/device/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
        } else {
          throw new Error('Failed to fetch devices');
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'Columns') setSelectedColumn(value);
  };

  const handleSubmit = async () => {
    const { Devices, FromDate, ToDate } = formData;
    if (Devices && FromDate && ToDate) {
      try {
        const response = await fetch(
          `https://rocketsalestracker.com/api/stoppage?device=${Devices}&fromDate=${FromDate}&toDate=${ToDate}`,
          {
            headers: {
              'Authorization': 'Basic ' + btoa('school:123456'),
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRows(data);
        } else {
          console.error('Failed to fetch stoppage data');
        }
      } catch (error) {
        console.error('Error fetching stoppage data:', error);
      }
    }
  };

  return (
    <>
      <CRow>
        <h3>Stopage Page</h3>
        <CCol xs={12} md={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Stopage Page</strong>
            </CCardHeader>
            <CCardBody>
              <CustomForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                devices={devices}
                columns={columns}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CustomTable rows={rows} selectedColumn={selectedColumn} />
        </CCol>
      </CRow>
    </>
  );
};

export default StopagePage;
