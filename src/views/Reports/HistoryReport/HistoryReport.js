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
  CTooltip,
} from '@coreui/react';
import MapComponent from '../../Map/MapComponent';
import '../style/remove-gutter.css';

// Form component for custom styles and handling input
const SearchVehicle = ({ formData, handleInputChange, handleSubmit, devices }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      handleSubmit(); // Calls the function to handle form submission
    }
    setValidated(true);
  };

  // const handlePeriodChange = (value) => {
  //   handleInputChange('Periods', value);
  //   setShowDateInputs(value === 'Custom');
  // };

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
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))
          ) : (
            <option disabled>Loading devices...</option>
          )}
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>

      

      <>
        <CCol md={3}>
          <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
          <CFormInput
            type="datetime-local"
            id="fromDate"
            value={formData.FromDate}
            onChange={(e) => handleInputChange('FromDate', e.target.value)}
            required
          />
          <CFormFeedback invalid>Please provide a valid from date.</CFormFeedback>
        </CCol>
        <CCol md={3}>
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
        <CCol xs={2}>
        <div className="text-end mt-4">
          <CButton color="secondary" type="submit" >
            SHOW NOW
          </CButton>
        </div>
      </CCol>
      </>
      {/* )} */}

     
    </CForm>
  );
};





// Main validation component
const HistoryReport = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      Devices: 'MH43BB1234',
      DeviceTime: '2024-09-22 06:37:45 AM',
      Speed: '7.00',
      Ignition: 'No',
      Distance: '0.00',
    },
    //  //Add data temparoy

  ]);
  const [formData, setFormData] = useState({
    Devices: '',
    // Periods: '',
    FromDate: '',
    ToDate: '',
  });
  const [devices, setDevices] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch devices data
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://63.142.251.13:8082/api/devices', {
          method: 'GET',
          headers: {
            Authorization: 'Basic ' + btoa('hbtrack:123456@'),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDevices(data);
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

  const handleSubmit = () => {
    setShowTable(true); // Show the table
  };

  return (
    <>
      <CRow className='gutter-0'>

        <CRow className="justify-content-center mt-4 gutter-0">
          <CCol xs={12} md={12} className="px-4" >
            <CCard className="p-0 mb-4 shadow-sm">
              <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
                <strong>History Reports</strong>
              </CCardHeader>
              <CCardBody>
                <SearchVehicle
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  devices={devices}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CCol xs={12} md={12} className="px-4">
         
              <MapComponent />
        </CCol>
      </CRow>

     

      {showTable && (
        <CRow className="justify-content-center mt-4 gutter-0">
          <CCol xs={12} md={12} className="px-4">
            <CCard className="p-0 mb-4 shadow-sm">
              <CCardHeader className="d-flex justify-content-between align-items-center bg-warning text-white">
                <strong>Device Status</strong>
              </CCardHeader>
              <CCardBody>
                <CustomStyles1 rows={rows} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  );
};

export default HistoryReport;
