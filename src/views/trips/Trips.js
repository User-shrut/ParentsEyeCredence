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

const CustomStyles = ({ formData, handleInputChange, handleSubmit, devices, columns }) => {
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
    }
    setValidated(true);
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
      <CCol md={4}>
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

      <CCol md={4}>
        <CFormLabel htmlFor="columns">Columns</CFormLabel>
        <CFormSelect
          id="columns"
          required
          value={formData.Columns}
          onChange={(e) => handleInputChange('Columns', e.target.value)}
        >
          <option value="">Choose a column...</option>
          {columns.map((column, index) => (
            <option key={index} value={column}>{column}</option>
          ))}
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid column.</CFormFeedback>
      </CCol>

      {showDateInputs && (
        <>
          <CCol md={6}>
            <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
            <CFormInput
              type="datetime-local" // Use "datetime-local" for time input
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
              type="datetime-local"
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

const Trips = () => {
  const username = 'school';
  const password = '123456';
  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState({ Devices: '', Periods: '', FromDate: '', ToDate: '', Columns: '' });
  const [devices, setDevices] = useState([]);
  const [columns] = useState(['Start Date', 'Distance', 'Odometer Start', 'Odometer End', 'Average Speed', 'Maximum Speed', 'Engine Hours', 'Spent Fuel']);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/devices', {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDevices(data); // Adjust if the structure of the response is different
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

    if (name === 'Columns') {
      setSelectedColumn(value);
    }
  };

  const handleSubmit = () => {
    const deviceId = formData.Devices;
    const fromDate = new Date(formData.FromDate).toISOString(); // Convert to ISO format
    const toDate = new Date(formData.ToDate).toISOString();     // Convert to ISO format

    // Construct the API URL
    const apiUrl = `http://104.251.212.84/api/statistics?deviceId=${deviceId}&from=${fromDate}&to=${toDate}`;
    
    console.log('Constructed API URL:', apiUrl);
    // Now you can use this apiUrl to fetch the data or handle it as needed.
  };

  return (
    <>
      <CRow className='pt-3'>
      <h2 className="px-4">Trips</h2>

        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Trips Status</strong>
            </CCardHeader>
            <CCardBody>
              <CustomStyles
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

      <CRow className="justify-content-center mt-4">
          <CCol xs={12} className="px-4">
            <CCard className="shadow-sm">
              <CCardHeader className="bg-secondary text-white d-flex justify-content-between align-items-center">
                <strong>All Status Reports List</strong>
                <CFormInput
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '250px' }}
              />
              </CCardHeader>
              <CCardBody>
                {/* <CustomStyles rows={rows} /> Displaying the second table */}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

      {/* Display results in a table, if needed */}
    </>
  );  
};

export default Trips;