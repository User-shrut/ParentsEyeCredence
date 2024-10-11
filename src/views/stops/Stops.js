import React, { useEffect, useState } from 'react';
import {
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
import Cookies from 'js-cookie';
import axios from 'axios';

const SearchStop = ({ formData, handleInputChange, handleSubmit, devices, columns, showMap, setShowMap }) => {
  const [validated, setValidated] = useState(false);
  const [buttonText, setButtonText] = useState('SHOW NOW');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // Date conversion function to convert the given date to the desired format
  const convertToDesiredFormat = (inputDate) => {
    const date = new Date(inputDate); // Create a Date object with the given input
    // Get the timezone offset in minutes and convert to milliseconds
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    // Adjust the date object to local time by subtracting the offset
    const localDate = new Date(date.getTime() - timezoneOffset);
    // Convert to ISO string format and append the +00:00 offset
    const formattedDate = localDate.toISOString().replace('Z', '+00:00');
    console.log('Original Date:', date);
    console.log('Local Adjusted Date:', localDate);
    console.log('Formatted Date:', formattedDate);
    return formattedDate;
  };
  // Modify the existing handleInputChange function to include the format conversion
  const handleDateChange = (field, value) => {
    const formattedDate = convertToDesiredFormat(value); // Convert the input date
    handleInputChange(field, formattedDate); // Call the input change handler
    console.log("Formatted Date:", formattedDate); // Log the formatted date
  };
  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      handleSubmit();
      setShowMap(true); //Show data mapping
    }
    setValidated(true);
  };
  // Function to handle dropdown item clicks
  const handleDropdownClick = (text) => {
    setButtonText(text); // Change button text based on the clicked item
    setDropdownOpen(false); // Close the dropdown after selection
    setShowMap(true); // Show the map data
  };
  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  return (
    <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleFormSubmit}>
      <CCol md={3}>
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
              <option key={device.id} value={device.deviceId}>
                {device.name}
              </option>
            ))
          ) : (
            <option disabled>Loading devices...</option>
          )}
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="columns">Columns</CFormLabel>
        <Select
          isMulti
          id="columns"
          options={[
            { value: 'all', label: 'All Columns' }, // Add "All Columns" option
            ...columns.map((column) => ({ value: column, label: column })),
          ]}
          value={
            formData.Columns.length === columns.length
              ? [{ value: 'all', label: 'All Columns' }] // Show "All Columns" if all columns are selected
              : formData.Columns.map((column) => ({ value: column, label: column }))
          }
          onChange={(selectedOptions) => {
            if (selectedOptions.find(option => option.value === 'all')) {
              // If "All Columns" is selected, select all available columns
              handleInputChange('Columns', columns);
            } else {
              // Otherwise, update formData.Columns with selected values
              handleInputChange('Columns', selectedOptions.map((option) => option.value));
            }
          }}
        />
        <CFormFeedback invalid>Please select at least one column.</CFormFeedback>
      </CCol>
      {/* Date Inputs for From Date and To Date */}
      <CCol md={3}>
        <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
        <CFormInput
          type="datetime-local"
          id="fromDate"
          value={formData.FromDate ? formData.FromDate.slice(0, 16) : ''} // Display local datetime value
          onChange={(e) => handleDateChange('FromDate', e.target.value)} // Use handleDateChange for conversion
          required
        />
        <CFormFeedback invalid>Please provide a valid from date.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="toDate">To Date</CFormLabel>
        <CFormInput
          type="datetime-local"
          id="toDate"
          value={formData.ToDate ? formData.ToDate.slice(0, 16) : ''} // Display local datetime value
          onChange={(e) => handleDateChange('ToDate', e.target.value)} // Use handleDateChange for conversion
          required
        />
        <CFormFeedback invalid>Please provide a valid to date.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <div className="d-flex justify-content-end">
          <div className="btn-group">
            <button className="btn btn-primary" type="submit" onClick={() => handleDropdownClick('SHOW NOW')}>
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
            {isDropdownOpen && (
              <ul className="dropdown-menu show">
                <li>
                  <a className="dropdown-item" href="#" onClick={() => handleDropdownClick('Show Now')}>
                    Show Now
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => handleDropdownClick('Export')}>
                    Export
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => handleDropdownClick('Email Reports')}>
                    Email Reports
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => handleDropdownClick('Schedule')}>
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
const StopTable = ({ apiData, selectedColumns }) => {
  return (
    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          {/* <CTableHeaderCell>Sr.No</CTableHeaderCell> */}
          <CTableHeaderCell>Device</CTableHeaderCell>

          {/* Dynamically render table headers based on selected columns */}
          {selectedColumns.map((column, index) => (
            <CTableHeaderCell key={index}>{column}</CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {/* Check if apiData and finalDeviceDataByStopage exist and are not empty */}
        {apiData?.finalDeviceDataByStopage?.length > 0 ? (
          apiData.finalDeviceDataByStopage.map((row, rowIndex) => (
            <CTableRow key={row.id || rowIndex} className="custom-row">
              {/* Optional: Row index cell */}
              {/* <CTableDataCell>{rowIndex + 1}</CTableDataCell> */}

              <CTableDataCell>{row.deviceId}</CTableDataCell>

              {/* Dynamically render table cells based on selected columns */}
              {selectedColumns.map((column, index) => (
                <CTableDataCell key={index}>
                  {column === 'Speed' ? (
                    // Convert speed from m/s to km/h and format to 2 decimal places
                    (row.speed * 3.6).toFixed(2) + ' km/h'
                  ) : column === 'Ignition' ? (
                    // Show 'ON' or 'OFF' based on ignition status
                    row.ignition ? 'ON' : 'OFF'
                  ) : column === 'Direction' ? (
                    // Show direction (course)
                    (row.course < 90 && row.course  > 0 ) ? "north east" : (row.course > 90 && row.course  < 180 ) ? "north west" : (row.course > 180 && row.course  < 270 ) ? "south west" : "south est"
                  ) : column === 'Device Id' ? (
                    // Show Device Id
                    row.deviceId
                  ) : column === 'Arrival Time' ? (
                    // Add 6 hours 30 minutes to arrivalTime and format to HH:mm
                    new Date(new Date(row.arrivalTime).setHours(new Date(row.arrivalTime).getHours() + 6, new Date(row.arrivalTime).getMinutes() + 30))
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  ) : column === 'Departure Time' ? (
                    // Add 6 hours 30 minutes to departureTime and format to HH:mm
                    new Date(new Date(row.departureTime).setHours(new Date(row.departureTime).getHours() + 6, new Date(row.departureTime).getMinutes() + 30))
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  ) : column === 'Device Name' ? (
                    // Show device name, or '--' if not available
                    row.device?.name || '--'
                  ) : (
                    '--'
                  )}
                </CTableDataCell>

              ))}
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={selectedColumns.length + 1}
              style={{
                backgroundColor: '#f8f9fa', // Light gray background
                color: '#6c757d', // Darker text color
                fontStyle: 'italic', // Italic font style
                padding: '16px', // Extra padding for emphasis
                textAlign: 'center', // Center the text
                border: '1px dashed #dee2e6' // Dashed border to highlight it
              }}
            >
              No data available
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>

  );
};
const Stops = () => {
  const [formData, setFormData] = useState({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '', Columns: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState([]);
  const [columns] = useState(['Speed', 'Ignition', 'Direction', 'Device Id', 'Arrival Time', 'Departure Time',]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showMap, setShowMap] = useState(false); //show mapping data
  const token = Cookies.get('authToken'); //token
  const [apiData, setApiData] = useState();   //data from api
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
    if (name === 'Columns') {
      setSelectedColumns(value);
    }
  };
  const handleSubmit = async () => {
    console.log(formData);
    // Convert the dates to ISO format if they're provided
    const fromDate = formData.FromDate ? new Date(formData.FromDate).toISOString() : '';
    const toDate = formData.ToDate ? new Date(formData.ToDate).toISOString() : '';
    const body = {
      deviceId: formData.Devices, // Use the device ID from the form data
      // period: formData.Periods, // Use the selected period from the form data
      FromDate: fromDate,
      ToDate: toDate,
    };
    console.log(token);
    // console.log(body);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/history/device-stopage?deviceId=${body.deviceId}&from=${body.FromDate}&to=${body.ToDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      // console.log(response.data.deviceDataByTrips[0]);
      if (response.status == 201) {
        console.log(response.data.finalDeviceDataByStopage)
        console.log("done in all")
        console.log(response.data);
        setApiData(response.data);
      }
      // Assuming the data returned is what you want to display in the table
      console.log('Form submitted with data:', body);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div>
      <CRow className='pt-3'>
        <h2 className='px-4'>Stop</h2>
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Stop</strong>
            </CCardHeader>
            <CCardBody>
              <SearchStop
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
                <strong>All Stop List</strong>
                <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                />
              </CCardHeader>
              <CCardBody>
                <StopTable apiData={apiData} selectedColumns={selectedColumns} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </div>
  );
};
export default Stops;