import React, { useEffect, useRef, useState } from 'react';
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import Select from 'react-select';
import Cookies from 'js-cookie';
import axios from 'axios';
import CIcon from '@coreui/icons-react';
import { cilSettings } from '@coreui/icons';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { auto } from '@popperjs/core';
import idel from "src/status/idel.png";
import ignitionOff from "src/status/power-off.png";
import ignitionOn from "src/status/power-on.png";
import Loader from '../../../components/Loader/Loader';
import '../style/remove-gutter.css';
import '../../../utils.css'

const SearchStatus = ({ formData, handleInputChange, handleSubmit, users, groups, getGroups, devices, loading, getDevices, columns, showMap, setShowMap }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [buttonText, setButtonText] = useState('SHOW NOW');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedU, setSelectedU] = useState();
  const [selectedG, setSelectedG] = useState();




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
      <CCol md={3}>
        <CFormLabel htmlFor="devices">User</CFormLabel>
        {/* <CFormSelect
          id="user"
          required
          value={selectedU}
          onChange={(e) => {
            const selectedUser = e.target.value;
            setSelectedU(selectedUser)
            console.log("Selected user:", selectedUser);
            getGroups(selectedUser);
          }}
        >
          <option value="">Choose a user...</option>
          {loading ? (<option disabled>Loading Users...</option>) : (
            users?.length > 0 ? (
              users?.map((user) => (
                <option key={user._id} value={user._id}>{user.username}</option>
              ))
            ) : (
              <option disabled>No Users in this Account</option>
            )
          )
          }
        </CFormSelect> */}
        <Select
          id="user"
          options={
            loading
              ? [{ value: '', label: 'Loading Users...', isDisabled: true }]
              : users?.length > 0
                ? users.map((user) => ({ value: user._id, label: user.username }))
                : [{ value: '', label: 'No Users in this Account', isDisabled: true }]
          }
          value={selectedU ? { value: selectedU, label: users.find((user) => user._id === selectedU)?.username } : null}
          onChange={(selectedOption) => {
            const selectedUser = selectedOption?.value;
            setSelectedU(selectedUser);
            console.log('Selected user:', selectedUser);
            getGroups(selectedUser);
          }}
          isLoading={loading} // Optionally show a loading spinner
          placeholder="Choose a user..."
        />

      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="devices">Groups</CFormLabel>
        {/* <CFormSelect
          id="group"
          required
          value={selectedG}
          onChange={(e) => {
            const selectedGroup = e.target.value;
            setSelectedG(selectedGroup);
            console.log("Selected Group ID:", selectedGroup);
            getDevices(selectedGroup);
          }}
        >
          <option value="">Choose a group...</option>

          {loading ? (<option disabled>Loading Groups...</option>) : (
            groups?.length > 0 ? (
              groups?.map((group) => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))
            ) : (
              <option disabled>No Groups in this User</option>
            )
          )
          }
        </CFormSelect> */}
        <Select
          id="group"
          options={
            loading
              ? [{ value: '', label: 'Loading Groups...', isDisabled: true }]
              : groups?.length > 0
                ? groups.map((group) => ({ value: group._id, label: group.name }))
                : [{ value: '', label: 'No Groups in this User', isDisabled: true }]
          }
          value={selectedG ? { value: selectedG, label: groups.find((group) => group._id === selectedG)?.name } : null}
          onChange={(selectedOption) => {
            const selectedGroup = selectedOption?.value;
            setSelectedG(selectedGroup);
            console.log('Selected Group ID:', selectedGroup);
            getDevices(selectedGroup);
          }}
          isLoading={loading} // Optionally show a loading spinner
          placeholder="Choose a group..."
        />

        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        <CFormSelect
          id="devices"
          required
          value={formData.Devices}
          onChange={(e) => handleInputChange('Devices', e.target.value)}
        >
          <option value="">Choose a device...</option>
          {loading ? (<option disabled>Loading devices...</option>) : (
            devices?.length > 0 ? (
              devices?.map((device) => (
                <option key={device.id} value={device.deviceId}>{device.name}</option>
              ))
            ) : (
              <option disabled>No Device in this Group</option>
            )
          )
          }

        </CFormSelect>

        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>
      <CCol md={2}>
        <CFormLabel htmlFor="periods">Period</CFormLabel>
        {/* <CFormSelect
          id="periods"
          required
          value={formData.Periods}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="" disabled>Choose a period...</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="This Week">This Week</option>
          <option value="Previous Week">Previous Week</option>
          <option value="This Month">This Month</option>
          <option value="Previous Month">Previous Month</option>
          <option value="Custom">Custom</option>
        </CFormSelect> */}
        <Select
          id="periods"
          options={[
            { value: '', label: 'Choose a period...', isDisabled: true },
            { value: 'Today', label: 'Today' },
            { value: 'Yesterday', label: 'Yesterday' },
            { value: 'This Week', label: 'This Week' },
            { value: 'Previous Week', label: 'Previous Week' },
            { value: 'This Month', label: 'This Month' },
            { value: 'Previous Month', label: 'Previous Month' },
            { value: 'Custom', label: 'Custom' },
          ]}
          value={formData.Periods ? { value: formData.Periods, label: formData.Periods } : null}
          onChange={(selectedOption) => handlePeriodChange(selectedOption.value)}
          placeholder="Choose a period..." // Displayed when no value is selected
        />

        <CFormFeedback invalid>Please select a valid period.</CFormFeedback>
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
        {/* <Select
  id="columns"
  options={[
    { value: 'all', label: 'All Columns' }, // Add "All Columns" option
    ...columns.map((column) => ({ value: column, label: column })),
  ]}
  value={
    formData.Columns.length === 1 && formData.Columns[0] === 'all'
      ? { value: 'all', label: 'All Columns' } // Show "All Columns" if selected
      : formData.Columns.length === 1
      ? { value: formData.Columns[0], label: formData.Columns[0] }
      : null
  }
  onChange={(selectedOption) => {
    if (selectedOption.value === 'all') {
      // If "All Columns" is selected, set formData.Columns to 'all'
      handleInputChange('Columns', ['all']);
    } else {
      // Otherwise, set formData.Columns to the selected column
      handleInputChange('Columns', [selectedOption.value]);
    }
  }}
/> */}

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
            <button className="btn btn-secondary " type="button" onClick={() => handleDropdownClick('SHOW NOW')}>
              {buttonText}
            </button>
          </div>
        </div>
      </CCol>
    </CForm>
  );
};

const ShowStatus = ({ statusLoading, apiData, selectedDeviceName, selectedColumns }) => {
  const [addressData, setAddressData] = useState({});
  const [newAddressData, setnewAddressData] = useState()
  // Function to get address based on latitude and longitude using Nominatim API
  const getAddress = async (latitude, longitude) => {
    try {
      const apiKey = 'DG2zGt0KduHmgSi2kifd';  // Replace with your actual MapTiler API key
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`
      );

      if (response.data && response.data.features && response.data.features.length > 0) {
        const address = response.data.features[0].place_name;
        console.log('Fetched address:', address);  // Debugging: log the address
        return address; // Return place_name from the features array
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

  // Function to export table data to Excel

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new(); // Create a new workbook

    const tableColumn = ['SN', 'Vehicle Name', ...selectedColumns];
    const tableRows = apiData.data.map((row, rowIndex) => {
      const rowData = selectedColumns.map((column) => {
        if (column === 'Vehicle Name') {
          return row.selectedDeviceName
        }
        if (column === 'Vehicle Status') {
          if (row.vehicleStatus === 'Idle') return 'Idle';
          if (row.vehicleStatus === 'Ignition Off') return 'Ignition Off';
          if (row.vehicleStatus === 'Ignition On') return 'Ignition On';
          return '--';
        } else if (column === 'Start Date Time') {
          return `${row.startDateTime.slice(0, 10)} ${row.startDateTime.slice(11, 16)}`;
        } else if (column === 'End Date Time') {
          return `${row.endDateTime.slice(0, 10)} ${row.endDateTime.slice(11, 16)}`;
        } else if (column === 'Start Address') {
          return newAddressData?.startAddress || 'Fetching...';
        } else if (column === 'End Address') {
          return newAddressData?.endAddress || 'Fetching...';
        } else if (column === 'Distance') {
          return row.distance;
        } else if (column === 'Total KM') {
          return row.totalKm;
        } else if (column === 'Maximum Speed') {
          return row.maxSpeed;
        } else if (column === 'Total Distance') {
          return (row.totalKm / 1000).toFixed(2) + ' km';
        } else if (column === 'Driver Name') {
          return row.driverInfos?.driverName || '--';
        } else if (column === 'Driver Phone No.') {
          return row.device?.name || '--';
        } else if (column === 'Duration') {
          return row.time;
        } else if (column === 'Start Coordinates') {
          return `${parseFloat(row.startLocation.split(',')[0]).toFixed(5)}, ${parseFloat(row.startLocation.split(',')[1]).toFixed(5)}`;
        } else if (column === 'End Coordinates') {
          return `${parseFloat(row.endLocation.split(',')[0]).toFixed(5)}, ${parseFloat(row.endLocation.split(',')[1]).toFixed(5)}`;
        } else {
          return row[column] || '--'; // Fallback for other columns
        }
      });
      return [rowIndex + 1, selectedDeviceName, ...rowData];
    });

    const worksheetData = [tableColumn, ...tableRows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${selectedDeviceName}.xlsx`);
  };

  // Function to export table data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    doc.setFontSize(15); // Set font size for the title
    doc.text(selectedDeviceName, 14, 15);

    const tableColumn = ['SN', 'Vehicle Name', ...selectedColumns];
    const tableRows = apiData.data.map((row, rowIndex) => {
      const rowData = selectedColumns.map((column) => {
        if (column === 'Vehicle Status') {
          if (row.vehicleStatus === 'Idle') return 'Idle';
          if (row.vehicleStatus === 'Ignition Off') return 'Ignition Off';
          if (row.vehicleStatus === 'Ignition On') return 'Ignition On';
          return '--';
        } else if (column === 'Start Date Time') {
          return `${row.startDateTime.slice(0, 10)} ${row.startDateTime.slice(11, 16)}`;
        } else if (column === 'Start Address') {
          return newAddressData?.startAddress || 'Fetching...';
        } else if (column === 'Start Coordinates') {
          return `${parseFloat(row.startLocation.split(',')[0]).toFixed(5)}, ${parseFloat(row.startLocation.split(',')[1]).toFixed(5)}`;
        } else if (column === 'Distance') {
          return row.distance;
        } else if (column === 'Duration') {
          return row.time;
        } else if (column === 'Total Distance') {
          return (row.distance / 1000).toFixed(2) + ' km';
        } else if (column === 'Maximum Speed') {
          return row.maxSpeed;
        } else if (column === 'Total KM') {
          return row.totalKm;
        } else if (column === 'End Date Time') {
          return `${row.endDateTime.slice(0, 10)} ${row.startDateTime.slice(11, 16)}`;
        } else if (column === 'End Address') {
          return newAddressData?.endAddress || 'Fetching...';
        } else if (column === 'End Coordinates') {
          return `${parseFloat(row.endLocation.split(',')[0]).toFixed(5)}, ${parseFloat(row.endLocation.split(',')[1]).toFixed(5)}`;
        } else if (column === 'Driver Name') {
          return row.driverInfos?.driverName || '--';
        } else if (column === 'Driver Phone No.') {
          return row.device?.name || '--';
        } else {
          return row[column] || '--'; // Fallback for other columns
        }
      });
      return [rowIndex + 1, selectedDeviceName, ...rowData];
    });

    // Add autoTable with border settings
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        lineWidth: 0.5, // Thickness of the borders
        lineColor: [0, 0, 0], // Border color (black)
        halign: 'center', // Horizontal alignment for text
        valign: 'middle', // Vertical alignment for text
      },
      tableLineWidth: 0.5, // Outer border line width
      tableLineColor: [0, 0, 0], // Outer border color (black)
      margin: { top: 20 }, // Margin from the top
    });

    doc.save(`${selectedDeviceName}.pdf`);
  };


  return (
    <>

      <CTable bordered className="custom-table" style={{ overflowX: auto }}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>SN</CTableHeaderCell>
            <CTableHeaderCell>Vehicle Name</CTableHeaderCell>
            {/* Dynamically render table headers based on selected columns */}
            {selectedColumns.map((column, index) => (
              <CTableHeaderCell key={index}>{column}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {statusLoading ? (<CTableRow style={{ position: 'relative' }}>
            <CTableDataCell
              colSpan={selectedColumns.length + 1}
              style={{
                backgroundColor: '#f8f9fa',
                color: '#6c757d',
                fontStyle: 'italic',
                padding: '16px',
                textAlign: 'center',
                border: '1px dashed #dee2e6',
                height: '100px',
              }}
            >
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Loader />
              </div>
            </CTableDataCell>
          </CTableRow>) : (

            apiData?.data && apiData.data.length > 0 ? (
              apiData.data.map((row, rowIndex) => (
                <CTableRow key={row.id} className="custom-row">
                  <CTableDataCell style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }} >{rowIndex + 1}</CTableDataCell>
                  <CTableDataCell style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }} >{selectedDeviceName}</CTableDataCell>
                  {/* Dynamically render table cells based on selected columns */}
                  {selectedColumns.map((column, index) => (
                    <>
                      <CTableDataCell key={index} style={{ backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>
                        {column === 'Vehicle Status' ? (
                          row.vehicleStatus === 'Idle' ? (
                            <>
                              <CTooltip content="Idle">
                                <img src={idel} alt='idle' width='40' height='40' style={{ marginRight: '10px' }} />
                                {/* <span>Idle</span> */}
                              </CTooltip>
                            </>
                          ) : row.vehicleStatus === 'Ignition Off' ? (
                            <>
                              <CTooltip content="Ignition Off">
                                <img src={ignitionOff} alt='off' width='40' height='40' style={{ marginRight: '10px' }} />
                                {/* <span>Ignition Off</span> */}
                              </CTooltip>
                            </>
                          ) : row.vehicleStatus === 'Ignition On' ? (
                            <>
                              <CTooltip content="Ignition On">
                                <img src={ignitionOn} alt='on' width='40' height='40' style={{ marginRight: '10px' }} />
                                {/* <span>Ignition On</span> */}
                              </CTooltip>
                            </>
                          ) : null)
                          : column === 'Start Date Time'
                            ? `${row.startDateTime.slice(0, 10)} , ${row.startDateTime.slice(11, 16)}`
                            : column === 'Start Address'
                              ? newAddressData?.startAddress || 'Fetching...'
                              : column === 'End Date Time'
                                ? `${row.endDateTime.slice(0, 10)} , ${row.endDateTime.slice(11, 16)}`
                                : column === 'Distance'
                                  ? row.distance
                                  : column === 'Total Distance'
                                    ? (row.distance / 1000).toFixed(2) + ' km'
                                    : column === 'Maximum Speed'
                                      ? row.maxSpeed
                                      : column === 'Total KM'
                                        ? row.totalKm
                                        : column === 'End Address'
                                          ? newAddressData?.endAddress || 'Fetching...'
                                          : column === 'Driver Name'
                                            ? row.driverInfos?.driverName || '--'
                                            : column === 'Driver Phone No.'
                                              ? row.device?.name || '--'
                                              : column === 'Vehicle Status'
                                                ? row.vehicleStatus
                                                : column === 'Duration'
                                                  ? row.time
                                                  // : column === 'Average Speed'
                                                  //   ? row.averageSpeed
                                                  : column === 'Start Coordinates'
                                                    ? `${parseFloat(row.startLocation.split(',')[0]).toFixed(5)}, ${parseFloat(row.startLocation.split(',')[1]).toFixed(5)}`

                                                    : column === 'End Coordinates'
                                                      ? `${parseFloat(row.endLocation.split(',')[0]).toFixed(5)}, ${parseFloat(row.endLocation.split(',')[1]).toFixed(5)}`
                                                      : '--'}
                      </CTableDataCell>
                    </>
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
                  No data available {selectedDeviceName}
                </CTableDataCell>
              </CTableRow>
            ))}
        </CTableBody>
      </CTable>

      <CDropdown className="position-fixed bottom-0 end-0 m-3">
        <CDropdownToggle
          color="secondary"
          style={{ borderRadius: '50%', padding: '10px', height: '48px', width: '48px' }}
        >
          <CIcon icon={cilSettings} />

        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem onClick={exportToPDF} >PDF</CDropdownItem>
          <CDropdownItem onClick={exportToExcel} >Excel</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

    </>

  );
};

const Status = () => {

  const [formData, setFormData] = useState({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '', Columns: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState();
  const [groups, setGroups] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const accessToken = Cookies.get('authToken');
  const [showMap, setShowMap] = useState(false); //show mapping data
  const [columns] = useState([
    'Vehicle Status',
    'Start Date Time',
    'Start Address',
    'Start Coordinates',
    'Total Distance',
    'Total KM',
    'Maximum Speed',
    'End Date Time',
    'End Address',
    'End Coordinates',
    'Duration',
    // 'Distance',
    'Driver Name',
    'Driver Phone No.'
  ]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const token = Cookies.get('authToken'); //
  const [apiData, setApiData] = useState();   //data from api
  const [statusLoading, setStatusLoading] = useState(false);


  // Get the selected device name from the device list based on formData.Devices
  const selectedDevice = devices.find(device => device.deviceId === formData.Devices);
  const selectedDeviceName = selectedDevice ? selectedDevice.name : '';

  const getDevices = async (selectedGroup) => {
    const accessToken = Cookies.get('authToken');
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/device/getDeviceByGroup/${selectedGroup}`,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      if (response.data.success) {
        setDevices(response.data.data)
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setDevices([]);
      setLoading(false);
      throw error // Re-throw the error for further handling if needed
    }
  }

  const getGroups = async (selectedUser = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/group/${selectedUser}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data.groupsAssigned) {
        setGroups(response.data.groupsAssigned)
        setLoading(false);
        console.log("perticular user ke groups")
      } else if (response.data.groups) {
        setGroups(response.data.groups)
        setLoading(false);
        console.log("all groups")
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }
  const getUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      if (response.data) {
        setUsers(response.data.users)
        setLoading(false);
        console.log("yaha tak thik hai")
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
    getGroups();
  }, [])


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

    setStatusLoading(true);
    console.log('DataAll', formData);
    const fromDate = formData.FromDate ? new Date(formData.FromDate).toISOString() : '';
    const toDate = formData.ToDate ? new Date(formData.ToDate).toISOString() : '';
    const body = {
      deviceId: formData.Devices, // Use the device ID from the form data
      period: formData.Periods, // Use the selected period from the form data
      FromDate: fromDate,
      ToDate: toDate,
    };
    console.log(token);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/status?deviceId=${body.deviceId}&period=${body.period}&fromDate=${body.FromDate}&toDate=${body.ToDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status == 200) {
        console.log(response.data.data);
        setApiData(response.data);
        setStatusLoading(false);
      }
    } catch (error) {
      setStatusLoading(false);
      console.error('Error submitting form:', error);
    }
  };



  return (
    <>
      <CRow className="pt-3 gutter-0">
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white" style={{ background: "linear-gradient(to right, #43c6ac 5%, #f8ffae 95%) !important", color: 'white' }}>
              <strong>Status Report</strong>
            </CCardHeader>
            <CCardBody>
              <SearchStatus
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                users={users}
                getGroups={getGroups}
                groups={groups}
                getDevices={getDevices}
                loading={loading}
                devices={devices}
                showMap={showMap}
                setShowMap={setShowMap}
                columns={columns}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow >
      {showMap && (
        <>
          <CRow className="justify-content-center mt-4 gutter-0">
            <CCol xs={12} className="px-4">
              <CCard className="p-0 mb-4 shadow-sm">
                <CCardHeader className="d-flex justify-content-between align-items-center text-white">
                  <strong>Status Report {selectedDeviceName && `for ${selectedDeviceName}`}</strong> {/* Show the device name here */}
                  {/* <CFormInput
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '250px' }}
                  /> */}
                </CCardHeader>
                <CCardBody>
                  <ShowStatus apiData={apiData} statusLoading={statusLoading} selectedDeviceName={selectedDeviceName} selectedColumns={selectedColumns} />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>



        </>
      )
      }


    </>
  );
};
export default Status;
