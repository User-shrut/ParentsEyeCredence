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
import Select from 'react-select';

const CustomStyles = ({ formData, handleInputChange, handleSubmit, devices, columns, showMap, setShowMap }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      handleSubmit();
      event.stopPropagation();
    } else {
      event.preventDefault();
      handleSubmit();
      setShowMap(true); //Show the mapping
    }
    setValidated(true);
  };

  const handlePeriodChange = (value) => {
    handleInputChange('Periods', value);
    setShowDateInputs(value === 'Custom');
  };

  // State to manage button text
  const [buttonText, setButtonText] = useState('SHOW NOW');
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  // Function to handle dropdown item clicks
  const handleDropdownClick = (text) => {
    setButtonText(text); // Change button text based on the clicked item
    setDropdownOpen(false); // Close the dropdown after selection
    handleSubmit(); // Submit form
    // setShowMap(true); // Show the map when form is valid and submitted
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
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
          // required
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
        {/* Use React-Select component for multi-select */}
        <Select
          isMulti
          id="columns"
          options={columns.map((column) => ({ value: column, label: column }))}
          value={formData.Columns.map((column) => ({ value: column, label: column }))}
          onChange={(selectedOptions) => handleInputChange('Columns', selectedOptions.map(option => option.value))}
        />
        <CFormFeedback invalid>Please select at least one column.</CFormFeedback>
      </CCol>

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

      <CCol xs={12} >
        <div className="d-flex justify-content-end">
          <div className="btn-group">
            <button className="btn btn-primary " type="button" onClick={() => handleDropdownClick('SHOW NOW')}>
              {buttonText}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split"
              onClick={toggleDropdown} // Toggle dropdown on click
              aria-expanded={isDropdownOpen} // Update aria attribute
            >
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            {isDropdownOpen && ( // Conditionally render dropdown menu
              <ul className="dropdown-menu show ">
                <li>
                  <a className="dropdown-item" href='' onClick={() => handleDropdownClick('Show Now')}>
                    Show Now
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href='' onClick={() => handleDropdownClick('Export')}>
                    Export
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href='' onClick={() => handleDropdownClick('Email Reports')}>
                    Email Reports
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href='' onClick={() => handleDropdownClick('Schedule')}>
                    Schedule
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </CCol>
    </CForm>
  );
};

const CustomStyles1 = ({ rows, selectedColumns }) => {
  return (
    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          {/* Dynamically render table headers based on selected columns */}
          {selectedColumns.map((column, index) => (
            <CTableHeaderCell key={index}>{column}</CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {rows.map((row, rowIndex) => (
          <CTableRow key={row.id} className="custom-row">
            {/* Dynamically render table cells based on selected columns */}
            {selectedColumns.map((column, index) => (
              <CTableDataCell key={index}>{row[column]}</CTableDataCell>
            ))}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

const Validation = () => {
  const [rows, setRows] = useState([
  ]);
  const [formData, setFormData] = useState({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '', Columns: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState([]);
  const [columns] = useState(['Start Time', 'Odometer', 'Address', 'End Time', 'Duration', 'Engine Hours', 'Spent Fuel']);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showMap, setShowMap] = useState(false); //show mapping data


  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://credence-tracker.onrender.com/device', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjY5NzQ5MjVjNmI3MjIyZDg3YzE0ZSIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmY2OTc0OTI1YzZiNzIyMmQ4N2MxNGUiLCJlbWFpbCI6IlBhdmFuQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGVjOGRlODg1TEpMWThUZ1A3NG5ZNmU1dkdIeTNIMnVQVnN1bE1RMzZmMFVrM242VVFVZUlTIiwidXNlcm5hbWUiOiJQYXZhbiIsImNyZWF0ZWRCeSI6IjY2ZjNlNjFmNjE4NTU5NmQxZDAwYzM4NCIsIm5vdGlmaWNhdGlvbiI6dHJ1ZSwiZGV2aWNlcyI6dHJ1ZSwiZHJpdmVyIjpmYWxzZSwiZ3JvdXBzIjpmYWxzZSwiY2F0ZWdvcnkiOmZhbHNlLCJtb2RlbCI6ZmFsc2UsInVzZXJzIjp0cnVlLCJyZXBvcnQiOnRydWUsInN0b3AiOnRydWUsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOnRydWUsImhpc3RvcnkiOnRydWUsInNjaGVkdWxlcmVwb3J0cyI6dHJ1ZSwic3RhdGlzdGljcyI6dHJ1ZSwiYWxlcnRzIjpmYWxzZSwic3VtbWFyeSI6ZmFsc2UsImN1c3RvbUNoYXJ0cyI6dHJ1ZSwiZGV2aWNlbGltaXQiOmZhbHNlLCJkYXRhTGltaXQiOjEsImVudHJpZXNDb3VudCI6MCwiX192IjowfSwiaWF0IjoxNzI3NDM4MTA5fQ.gfelNrYbAeS748DqP0K9_XeXdESFD8PD5lwLv8UiP50', // Replace with your actual token
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
      period: formData.Periods, // Use the selected period from the form data
    };
  
    // Convert the dates to ISO format if they're provided
    const fromDate = formData.FromDate ? new Date(formData.FromDate).toISOString() : '';
    const toDate = formData.ToDate ? new Date(formData.ToDate).toISOString() : '';
  
    // Construct the API URL using formData.Devices
    const apiUrl = `http://104.251.212.80/api/stop?deviceId=${formData.Devices}&from=${fromDate}&to=${toDate}`;
    
    // Log the constructed API URL
    console.log('Constructed API URL:', apiUrl);
  
    try {
      const response = await fetch('https://credence-tracker.onrender.com/history/device-stopage?deviceId=2636&from=2024-09-27T05:16:57.000+00:00&to=2024-09-27T05:16:57.000+00:00 ', {
        method: 'POST', // Use POST method to send data
        headers: {
          // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI4YzVmMjgzZDg4NGQzYTQzZTcyMyIsInVzZXJzIjp0cnVlLCJzdXBlcmFkbWluIjpmYWxzZSwidXNlciI6eyJfaWQiOiI2NmYyOGM1ZjI4M2Q4ODRkM2E0M2U3MjMiLCJlbWFpbCI6Inlhc2hAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQkh6dDZ1NGJwNE01S3hZYXA5U2xYdTQ3clVidUtsVlQvSlFWUkxEbHFQcVY4L1A3OTlXb2kiLCJ1c2VybmFtZSI6Inlhc2giLCJjcmVhdGVkQnkiOiI2NmYyODQ3MGRlOGRkZTA1Zjc0YTdkOTgiLCJub3RpZmljYXRpb24iOnRydWUsImRldmljZXMiOnRydWUsImRyaXZlciI6dHJ1ZSwiZ3JvdXBzIjp0cnVlLCJjYXRlZ29yeSI6dHJ1ZSwibW9kZWwiOnRydWUsInVzZXJzIjp0cnVlLCJyZXBvcnQiOnRydWUsInN0b3AiOnRydWUsInRyaXBzIjp0cnVlLCJnZW9mZW5jZSI6dHJ1ZSwibWFpbnRlbmFuY2UiOnRydWUsInByZWZlcmVuY2VzIjp0cnVlLCJjb21iaW5lZFJlcG9ydHMiOnRydWUsImN1c3RvbVJlcG9ydHMiOnRydWUsImhpc3RvcnkiOnRydWUsInNjaGVkdWxlcmVwb3J0cyI6dHJ1ZSwic3RhdGlzdGljcyI6dHJ1ZSwiYWxlcnRzIjp0cnVlLCJzdW1tYXJ5Ijp0cnVlLCJjdXN0b21DaGFydHMiOnRydWUsIl9fdiI6MCwiZGV2aWNlbGltaXQiOmZhbHNlLCJlbnRyaWVzQ291bnQiOjZ9LCJpYXQiOjE3Mjc1MTUxNjd9.nH3Ly-ElbGjwah4r4FV0GdYE0TnZ9hBwlIqdo8Gpewc', // Replace with your actual token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), // Send the request body with deviceId and period
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
        <h2 className='px-4'>Stop</h2>
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Stop Report</strong>
            </CCardHeader>
            <CCardBody>
              <CustomStyles
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                devices={devices}
                columns={columns}
                showMap={showMap}
                setShowMap={setShowMap}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {showMap && (
        <CRow className="justify-content-center mt-4">
          <CCol xs={12} className="px-4" >
            <CCard className='p-0 mb-4 shadow-sm'>
              <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
                <strong>All Stop Report List</strong>
                <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                />
              </CCardHeader>
              <CCardBody>
                <CustomStyles1 rows={rows} selectedColumns={selectedColumns} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  );
};
export default Validation;