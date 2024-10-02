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
// import MapComponent from '../Map/MapComponent';

import Cookies from 'js-cookie';
import axios from 'axios';

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
      handleSubmit(); // Call the submission function to fetch data
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
              <option key={device.id} value={device.deviceId}>{device.name}</option>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://credence-tracker.onrender.com/device', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
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
  
    // Convert the dates to ISO format if they're provided
    const fromDate = formData.FromDate ? new Date(formData.FromDate).toISOString() : '';
    const toDate = formData.ToDate ? new Date(formData.ToDate).toISOString() : '';
  
    // Construct the API URL using formData.Devices
    const apiUrl = `http://104.251.212.80/api/combine?deviceId=${formData.Devices}&from=${fromDate}&to=${toDate}`;
    
    
    // Log the constructed API URL
    console.log('Constructed API URL:', apiUrl);

    console.log(token);
    console.log(body);

  
    try {
      const response = await axios.get('https://credence-tracker.onrender.com/reports/combined', body , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setRows(data); // Assuming the data returned is what you want to display in the table
      console.log('Form submitted with data:', body);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  return (
    <>

      <CRow className='pt-3'>
        <h2 className="px-4">Combine Reports</h2>
        <CCol xs={12} md={12} className="px-4">
          <CCard className=" mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Combine Reports</strong>
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
      </CRow>

    
      {showMap && (
        <CRow className="justify-content-center mt-4">
          <CCol xs={12} className="px-4">
            <CCard className="p-0 mb-4 shadow-sm">
              <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
                <strong>All Combine Reports List</strong>
                <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                />
              </CCardHeader>
              <CCardBody>
                <CustomStyles1 rows={rows} /> {/* Displaying the second table */}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}



   </>
  );
};

export default Validation;
