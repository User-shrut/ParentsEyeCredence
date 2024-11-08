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
const CustomStyles = ({ formData, handleInputChange, handleSubmit, devices }) => {
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

      {/* <CCol md={6}>
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
      </CCol> */}

      {/* {showDateInputs && ( */}
      <>
        <CCol md={4}>
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
        <CCol md={4}>
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
      {/* )} */}

      <CCol xs={12}>
        <div className="d-flex justify-content-end">
          <CButton color="primary" type="submit" >
            SHOW NOW
          </CButton>
        </div>
      </CCol>
    </CForm>
  );
};

const PlaybackControls = ({ rowId }) => {
  const [isPlaying, setIsPlaying] = useState(false); // State to track playback status

  const handleStart = () => {
    console.log(`Start playback for row ${rowId}`);
    setIsPlaying(true); // Set playback state to playing
    // Implement additional start logic if needed
  };

  const handleStop = () => {
    console.log(`Stop playback for row ${rowId}`);
    setIsPlaying(false); // Set playback state to stopped
    // Implement stop logic
  };

  const handleForward = () => {
    console.log(`Forward playback for row ${rowId}`);
    // Implement forward logic
  };

  const handleReverse = () => {
    console.log(`Reverse playback for row ${rowId}`);
    // Implement reverse logic
  };

  // Toggle between play and pause
  const togglePlayback = () => {
    setIsPlaying(prevState => !prevState);
  };


  return (
    <div>
      <CTooltip content='Reverse'>
        <CButton size="lg" color="primary" className="me-2" onClick={handleReverse}>
          ⏪ {/* Reverse icon */}
        </CButton>
      </CTooltip>

      <CTooltip content={isPlaying ? 'Pause' : 'Play'}>
        <CButton
          size="lg"
          color={isPlaying ? 'danger' : 'success'}
          className="me-2"
          onClick={togglePlayback}
        >
          {isPlaying ? '⏸️' : '▶️'} {/* Pause icon if playing, otherwise play icon */}
        </CButton>
      </CTooltip>

      <CTooltip content='Stop'>
        <CButton size="lg" color="danger" className="me-2" onClick={handleStop}>
          ⏹️ {/* Stop icon */}
        </CButton>
      </CTooltip>

      <CTooltip content='Forward'>
        <CButton size="lg" color="primary" className="me-2" onClick={handleForward}>
          ⏩ {/* Forward icon */}
        </CButton>
      </CTooltip>
    </div>
  );
};

// Table component for displaying status
const CustomStyles1 = ({ rows }) => {
  return (
    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Sr.No</CTableHeaderCell>
          <CTableHeaderCell>Device</CTableHeaderCell>
          <CTableHeaderCell>Device Time</CTableHeaderCell>
          <CTableHeaderCell>Speed</CTableHeaderCell>
          <CTableHeaderCell>Ignition</CTableHeaderCell>
          <CTableHeaderCell>Distance</CTableHeaderCell>
          <CTableHeaderCell>Playback</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {rows.map((row, index) => (
          <CTableRow key={row.id} className="custom-row">
            <CTableDataCell>{index + 1}</CTableDataCell>
            <CTableDataCell>{row.Devices}</CTableDataCell>
            <CTableDataCell>{row.DeviceTime}</CTableDataCell>
            <CTableDataCell>{row.Speed} km/h</CTableDataCell>
            <CTableDataCell>{row.Ignition}</CTableDataCell>
            <CTableDataCell>{row.Distance} km</CTableDataCell>
            <CTableDataCell>
              <PlaybackControls rowId={row.id} />
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

// Main validation component
const Validation = () => {
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
        const response = await fetch('https://rocketsalestracker.com/api/devices', {
          method: 'GET',
          headers: {
            Authorization: 'Basic ' + btoa('school:123456'),
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
    setShowForm(false); // Hide the form after submission
    setShowTable(true); // Show the table
  };

  return (
    <>
      <CRow className='pt-3 gutter-0'>
        <h2 className="px-4">History Reports</h2>

        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-2 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Device Tracker</strong>
            </CCardHeader>
            <CCardBody>
              <MapComponent /> {/* Always renders at the top */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {showForm && (
        <CRow className="justify-content-center mt-4 gutter-0">
          <CCol xs={12} md={12} className="px-4" >
            <CCard className="p-0 mb-4 shadow-sm">
              <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
                <strong>History Reports</strong>
              </CCardHeader>
              <CCardBody>
                <CustomStyles
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  devices={devices}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

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

export default Validation;
