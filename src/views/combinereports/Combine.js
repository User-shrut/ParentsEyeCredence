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
import Cookies from 'js-cookie';
import axios from 'axios';

const SearchStatus = ({ formData, handleInputChange, handleSubmit, devices, columns, showMap, setShowMap }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);
  // State to manage button text
  const [buttonText, setButtonText] = useState('SHOW NOW');
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    console.log("handle submit ke pass hu");
    if (form.checkValidity() === false) {
      event.preventDefault();
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



  // Function to handle dropdown item clicks
  const handleDropdownClick = (text) => {
    setButtonText(text); // Change button text based on the clicked item
    setDropdownOpen(false); // Close the dropdown after selection
    handleSubmit(); // Submit form
    setShowMap(true); // Show the map when form is valid and submitted
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
            {/* <button
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
            )} */}
          </div>
        </div>
      </CCol>
    </CForm>
  );
};

const ShowStatus = ({ apiData, selectedColumns }) => {
  const [addressData, setAddressData] = useState({});
  const [newAddressData, setnewAddressData] = useState()

  // Function to get address based on latitude and longitude using Nominatim API
  const getAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      if (response.data) {
        console.log('Fetched address:', response.data.display_name);  // Debugging: log the address
        return response.data.display_name; // Return display_name
      } else {
        console.error("Error fetching address: No data found");
        return 'Address not available';
      }
    } catch (error) {
      console.error("Error:", error.message);
      return 'Address not available';
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {


      // Fetch all addresses concurrently
      const promises = apiData.data.map(async (data) => {
        // Split the startLocation and endLocation strings into latitudes and longitudes
        const [startLat, startLon] = data.startLocation ? data.startLocation.split(',').map(coord => coord.trim()) : [null, null];
        const [endLat, endLon] = data.endLocation ? data.endLocation.split(',').map(coord => coord.trim()) : [null, null];

        // Fetch the start and end addresses only if coordinates are valid
        const startAddress = startLat && startLon ? await getAddress(startLat, startLon) : 'Invalid start location';
        const endAddress = endLat && endLon ? await getAddress(endLat, endLon) : 'Invalid end location';

        // Store the addresses in the addressData state
        return {
          ouid: data.ouid,
          startAddress: startAddress || 'Address not found',
          endAddress: endAddress || 'Address not found'
        };
      });

      // Wait for all promises to resolve
      const results = await Promise.all(promises);

      // Update the addressData state with the fetched addresses
      results.forEach(result => {
        setnewAddressData({
          startAddress: result.startAddress,
          endAddress: result.endAddress
        })


      });

      console.log('Updated addressData:', newAddressData); // Debugging: log addressData
      setAddressData(newAddressData);
    };

    if (apiData?.data?.length > 0) {
      fetchAddresses();
    }
  }, [apiData]);


  if (newAddressData) {
    console.log(newAddressData);
  }

  return (

    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Devices</CTableHeaderCell>
          {/* Dynamically render table headers based on selected columns */}
          {selectedColumns.map((column, index) => (
            <CTableHeaderCell key={index}>{column}</CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {apiData?.data && apiData.data.length > 0 ? (
          apiData.data.map((row, rowIndex) => (
            <CTableRow key={row.id} className="custom-row">
              <CTableDataCell>{apiData.deviceId}</CTableDataCell>
              {/* Dynamically render table cells based on selected columns */}
              {selectedColumns.map((column, index) => (
                <CTableDataCell key={index}>
                  {column === 'Start Time' ? (
                    // Format Start Time, adding 6 hours 30 minutes
                    new Date(new Date(row.startDateTime).setHours(new Date(row.startDateTime).getHours() + 6, new Date(row.startDateTime).getMinutes() + 30))
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  ) : column === 'End Time' ? (
                    // Format End Time, adding 6 hours 30 minutes
                    new Date(new Date(row.endDateTime).setHours(new Date(row.endDateTime).getHours() + 6, new Date(row.endDateTime).getMinutes() + 30))
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  ) : column === 'Distance' ? (
                    // Convert distance from meters to kilometers and round to 2 decimal places
                    (row.distance / 1000).toFixed(2) + ' km'
                  ) : column === 'Total Distance' ? (
                    // Convert total distance from meters to kilometers and round to 2 decimal places
                    (row.totalKm / 1000).toFixed(2) + ' km'
                  ) : column === 'Maximum Speed' ? (
                    // Convert max speed from m/s to km/h and round to 2 decimal places
                    (row.maxSpeed * 3.6).toFixed(2) + ' km/h'
                  ) : column === 'Average Speed' ? (
                    // Convert average speed from m/s to km/h and round to 2 decimal places
                    (row.averageSpeed * 3.6).toFixed(2) + ' km/h'
                  ) : column === 'Driver' ? (
                    row.driverInfos?.driverName || '--'
                  ) : column === 'Vehicle Status' ? (
                    row.vehicleStatus
                  ) : column === 'Time' ? (
                    row.time
                  ) : column === 'Start Address' ? (
                    newAddressData?.startAddress || 'Fetching...'
                  ) : column === 'End Address' ? (
                    newAddressData?.endAddress || 'Fetching...'
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

const Status = () => {

  const [formData, setFormData] = useState({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '', Columns: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState([]);
  const [showMap, setShowMap] = useState(false); //show mapping data
  const [columns] = useState([
    'Start Time',
    'End Time',
    'Start Address',
    'End Address',
    'Distance',
    'Total Distance',
    'Maximum Speed',
    'Driver',
    'Vehicle Status',
    'Time',
    'Average Speed'
  ]);

  const [selectedColumns, setSelectedColumns] = useState([]);
  const token = Cookies.get('authToken'); //

  const [apiData, setApiData] = useState();   //data from api

  useEffect(() => {
    const fetchDevices = async () => {

      console.log("fetch device me aaya hu...")
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

    console.log('DataAll', formData)

    // Convert the dates to ISO format if they're provided
    const fromDate = formData.FromDate ? new Date(formData.FromDate).toISOString() : '';
    const toDate = formData.ToDate ? new Date(formData.ToDate).toISOString() : '';


    const body = {
      deviceId: formData.Devices, // Use the device ID from the form data
      period: formData.Periods, // Use the selected period from the form data
      FromDate: fromDate,
      ToDate: toDate,
    };

    console.log(token);
    // console.log(body);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/status?deviceId=${body.deviceId}&period=${body.period}&fromDate=${body.FromDate}&toDate=${body.ToDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Replace with your actual token
          'Content-Type': 'application/json',
        },
      });

      // console.log(response.data.deviceDataByStatus[0]);

      console.log("All Status reports");

      if (response.status == 200) {
        console.log(response.data.data)
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
    <>
      <CRow className='pt-3'>
        <h2 className='px-4'>Status Report</h2>
        <CCol xs={12} md={12} className='px-4'>
          <CCard className="mb-4 p-0 shadow-lg rounded" >
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
              <strong>Combine Report</strong>

            </CCardHeader>
            <CCardBody>
              <SearchStatus
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                devices={devices}
                showMap={showMap}
                setShowMap={setShowMap}
                columns={columns}
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
                <strong>All Combine Report List</strong>
                <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                />
              </CCardHeader>
              <CCardBody>
                <ShowStatus apiData={apiData} selectedColumns={selectedColumns} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

    </>
  );
};

export default Status;