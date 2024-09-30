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
import MapComponent from '../Map/MapComponent';

const CustomStyles = ({ formData, handleInputChange, handleSubmit, devices, showMap, setShowMap }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      handleSubmit();
      setShowMap(true); // Show the map when form is valid and submitted
    }
    setValidated(true);
  };

  const handlePeriodChange = (value) => {
    handleInputChange('Period', value);
    setShowDateInputs(value === 'Custom');
  };

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      <CCol md={6}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        <CFormSelect
          id="devices"
          required
          value={formData.Devices}
          onChange={(e) => handleInputChange('Devices', e.target.value)}
        >
          <option value="">Choose a device...</option>
          {devices.length > 0 ? (
            devices.map((device) => (
              <option key={device.id} value={device.id}>{device.name}</option>
            ))
          ) : (
            <option disabled>Loading devices...</option>
          )}
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>

      <CCol md={6}>
        <CFormLabel htmlFor="periods">Periods</CFormLabel>
        <CFormSelect
          id="periods"
          required
          value={formData.Period}
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

      {showDateInputs && (
        <>
          <CCol md={6}>
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
          <CCol md={6}>
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

      <CCol xs={12}>
        <div className="d-flex justify-content-end">
          <CButton color="primary" type="submit">
            SHOW NOW
          </CButton>
        </div>
      </CCol>
    </CForm>
  );
};

const CustomStyles1 = ({ rows }) => {
  return (
    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Sr.No</CTableHeaderCell>
          <CTableHeaderCell>Devices</CTableHeaderCell>
          <CTableHeaderCell>Fix Time</CTableHeaderCell>
          <CTableHeaderCell>Type</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {rows.map((row) => (
          <CTableRow key={row.id} className="custom-row">
            <CTableDataCell>{row.id}</CTableDataCell>
            <CTableDataCell>{row.Devices}</CTableDataCell>
            <CTableDataCell>{row.Details}</CTableDataCell>
            <CTableDataCell>{row.Type}</CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

const Validation = () => {
  const [formData, setFormData] = useState({ Devices: '', Period: '', FromDate: '', ToDate: '' });
  const [devices, setDevices] = useState([]);
  const [rows, setRows] = useState([]);
  const [showMap, setShowMap] = useState(false);  

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://credence-tracker.onrender.com/device', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGM1ZjI4M2Q4ODRkM2E0M2U3MjMiLCJlbWFpbCI6Inlhc2hAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQkh6dDZ1NGJwNE01S3hZYXA5U2xYdTQ3clVidUtsVlQvSlFWUkxEbHFQcVY4L1A3OTlXb2kiLCJ1c2VybmFtZSI6Inlhc2giLCJjcmVhdGVkQnkiOiI2NmYyODQ3MGRlOGRkZTA1Zjc0YTdkOTgiLCJub3RpZmljYXRpb24iOnRydWUsImRldmljZXMiOnRydWUsImRyaXZlciI6dHJ1ZSwiZ3JvdXBzIjp0cnVlLCJjYXRlZ29yeSI6dHJ1ZSwibW9kZWwiOnRydWUsInVzZXJzIjp0cnVlLCJyZXBvcnQiOnRydWUsInN0b3AiOnRydWUsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOnRydWUsImhpc3RvcnkiOnRydWUsInNjaGVkdWxlcmVwb3J0cyI6dHJ1ZSwic3RhdGlzdGljcyI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJzdW1tYXJ5Ijp0cnVlLCJjdXN0b21DaGFydHMiOnRydWUsIl9fdiI6MCwiZGV2aWNlbGltaXQiOmZhbHNlLCJlbnRyaWVzQ291bnQiOjZ9LCJpYXQiOjE3Mjc1MTUxNjd9.nH3Ly-ElbGjwah4r4FV0GdYE0TnZ9hBwlIqdo8Gpewc', // Replace with your actual token
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        setDevices(data.devices); // Assuming the data returned contains device info
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
  };

  const handleSubmit = async () => {

    const body = {
      deviceId: formData.Devices, // Use the device ID from the form data
      period: formData.Period, // Use the selected period from the form data
  };

    try {
      const response = await fetch('https://credence-tracker.onrender.com/reports/combined', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGM1ZjI4M2Q4ODRkM2E0M2U3MjMiLCJlbWFpbCI6Inlhc2hAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQkh6dDZ1NGJwNE01S3hZYXA5U2xYdTQ3clVidUtsVlQvSlFWUkxEbHFQcVY4L1A3OTlXb2kiLCJ1c2VybmFtZSI6Inlhc2giLCJjcmVhdGVkQnkiOiI2NmYyODQ3MGRlOGRkZTA1Zjc0YTdkOTgiLCJub3RpZmljYXRpb24iOnRydWUsImRldmljZXMiOnRydWUsImRyaXZlciI6dHJ1ZSwiZ3JvdXBzIjp0cnVlLCJjYXRlZ29yeSI6dHJ1ZSwibW9kZWwiOnRydWUsInVzZXJzIjp0cnVlLCJyZXBvcnQiOnRydWUsInN0b3AiOnRydWUsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOnRydWUsImhpc3RvcnkiOnRydWUsInNjaGVkdWxlcmVwb3J0cyI6dHJ1ZSwic3RhdGlzdGljcyI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJzdW1tYXJ5Ijp0cnVlLCJjdXN0b21DaGFydHMiOnRydWUsIl9fdiI6MCwiZGV2aWNlbGltaXQiOmZhbHNlLCJlbnRyaWVzQ291bnQiOjZ9LCJpYXQiOjE3Mjc1MTUxNjd9.nH3Ly-ElbGjwah4r4FV0GdYE0TnZ9hBwlIqdo8Gpewc', // Replace with your actual token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRows(data); // Assuming the data returned is what you want to display in the table
      console.log('Form submitted with data:', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <CRow>
        {showMap && <MapComponent />} {/* Conditionally render the MapComponent */}
        <h3>Combine Reports</h3>
        <CCol xs={12} className='mb-4'>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Status Reports</strong>
            </CCardHeader>
            <CCardBody>
              <CustomStyles
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                devices={devices}
                showMap={showMap}
                setShowMap={setShowMap}
              />
            </CCardBody>
          </CCard>
        </CCol>
        {showMap && (
          <CCol xs={12}>
            <CCard>
              <CCardHeader>
                <strong>All Status List</strong>
              </CCardHeader>
              <CCardBody>
                <CustomStyles1 rows={rows} devices={devices} />
              </CCardBody>
            </CCard>
          </CCol>
        )}
      </CRow>
    </>
  );
};

export default Validation;
