// import React, { useEffect, useState } from 'react'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CRow,
//   CFormLabel,
//   CFormFeedback,
//   CTooltip,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
// } from '@coreui/react'
// import Select from 'react-select'
// import Cookies from 'js-cookie'
// import axios from 'axios'
// import CIcon from '@coreui/icons-react'
// import { cilSettings } from '@coreui/icons'
// import * as XLSX from 'xlsx' // For Excel export
// import jsPDF from 'jspdf' // For PDF export
// import { saveAs } from 'file-saver';
// import autoTable from 'jspdf-autotable'
// import { auto } from '@popperjs/core'
// import Loader from '../../../components/Loader/Loader'
// import '../style/remove-gutter.css';

// const SearchGeofence = ({
//   formData,
//   handleInputChange,
//   handleSubmit,
//   users,
//   getGroups,
//   groups,
//   devices,
//   loading,
//   getDevices,
//   setShowMap,
// }) => {
//   const [validated, setValidated] = useState(false)
//   const [showDateInputs, setShowDateInputs] = useState(false) // State to manage button text
//   const [buttonText, setButtonText] = useState('SHOW NOW')
//   const [isDropdownOpen, setDropdownOpen] = useState(false) // State to manage dropdown visibility
//   const [selectedU, setSelectedU] = useState()
//   const [selectedG, setSelectedG] = useState()

//   const allDevicesOption = { value: 'all', label: 'All Devices' } // Define an option for "All Devices"

//   const convertToDesiredFormat = (inputDate) => {
//     const date = new Date(inputDate) // Create a Date object with the given input
//     // Get the timezone offset in minutes and convert to milliseconds
//     const timezoneOffset = date.getTimezoneOffset() * 60000
//     // Adjust the date object to local time by subtracting the offset
//     const localDate = new Date(date.getTime() - timezoneOffset)
//     // Convert to ISO string format and append the +00:00 offset
//     const formattedDate = localDate.toISOString().replace('Z', '+00:00')
//     console.log('Original Date:', date)
//     console.log('Local Adjusted Date:', localDate)
//     console.log('Formatted Date:', formattedDate)
//     return formattedDate
//   }

//   // Modify the existing handleInputChange function to include the format conversion
//   const handleDateChange = (field, value) => {
//     const formattedDate = convertToDesiredFormat(value) // Convert the input date
//     handleInputChange(field, formattedDate) // Call the input change handler
//     console.log('Formatted Date:', formattedDate) // Log the formatted date
//   }

//   const handleFormSubmit = (event) => {
//     const form = event.currentTarget
//     console.log('handle submit ke pass hu')
//     if (form.checkValidity() === false) {
//       event.preventDefault()
//       event.stopPropagation()
//     } else {
//       event.preventDefault()
//       handleSubmit()
//       setShowMap(true) // Show the map
//     }
//     setValidated(true)
//   }

//   const handlePeriodChange = (value) => {
//     handleInputChange('Periods', value)
//     setShowDateInputs(value === 'Custom')
//   }

//   // Function to handle dropdown item clicks
//   const handleDropdownClick = (text) => {
//     setButtonText(text) // Change button text based on the clicked item
//     setDropdownOpen(false) // Close the dropdown after selection
//     handleSubmit() // Submit form
//     setShowMap(true) // Show the map when form is valid and submitted
//   }

//   // Function to toggle dropdown visibility
//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev)
//   }

//   return (
//     <CForm
//       className="row g-3 needs-validation"
//       noValidate
//       validated={validated}
//       onSubmit={handleFormSubmit}
//     >
//       <CCol md={3}>
//         <CFormLabel htmlFor="devices">User</CFormLabel>
//         <Select
//           id="user"
//           options={
//             loading
//               ? [{ value: '', label: 'Loading Users...', isDisabled: true }]
//               : users?.length > 0
//                 ? users.map((user) => ({ value: user._id, label: user.username }))
//                 : [{ value: '', label: 'No Users in this Account', isDisabled: true }]
//           }
//           value={selectedU ? { value: selectedU, label: users.find((user) => user._id === selectedU)?.username } : null}
//           onChange={(selectedOption) => {
//             const selectedUser = selectedOption?.value;
//             setSelectedU(selectedUser);
//             console.log('Selected user:', selectedUser);
//             getGroups(selectedUser);
//           }}
//           isLoading={loading} // Optionally show a loading spinner
//           placeholder="Choose a user..."
//         />
//         <CFormFeedback invalid>Please provide a valid user.</CFormFeedback>

//       </CCol>

//       <CCol md={2}>
//         <CFormLabel htmlFor="devices">Groups</CFormLabel>
//         <Select
//           id="group"
//           options={
//             loading
//               ? [{ value: '', label: 'Loading Groups...', isDisabled: true }]
//               : groups?.length > 0
//                 ? groups.map((group) => ({ value: group._id, label: group.name }))
//                 : [{ value: '', label: 'No Groups in this User', isDisabled: true }]
//           }
//           value={selectedG ? { value: selectedG, label: groups.find((group) => group._id === selectedG)?.name } : null}
//           onChange={(selectedOption) => {
//             const selectedGroup = selectedOption?.value;
//             setSelectedG(selectedGroup);
//             console.log('Selected Group ID:', selectedGroup);
//             getDevices(selectedGroup);
//           }}
//           isLoading={loading} // Optionally show a loading spinner
//           placeholder="Choose a group..."
//         />

//         <CFormFeedback invalid>Please provide a valid group.</CFormFeedback>

//       </CCol>

//       <CCol md={3}>
//         <CFormLabel htmlFor="devices">Devices</CFormLabel>
//         <Select
//           id="devices"
//           isMulti
//           options={[allDevicesOption, ...devices.map((device) => ({ value: device.deviceId, label: device.name }))]}
//           onChange={(selectedOptions) => {
//             // Step 2: Check if "All Devices" is selected
//             if (selectedOptions.some((option) => option.value === 'all')) {
//               // If "All Devices" is selected, select all device IDs
//               const allDeviceIds = devices.map((device) => device.deviceId)
//               handleInputChange('Devices', allDeviceIds) // Store all device IDs
//             } else {
//               // Otherwise, store the selected device IDs
//               const selectedDeviceIds = selectedOptions.map((option) => option.value)
//               handleInputChange('Devices', selectedDeviceIds)
//             }
//           }}
//           placeholder="Choose devices..."
//           isClearable={true}
//         />
//         <CFormFeedback invalid>Please provide valid devices.</CFormFeedback>
//       </CCol>

//       {/* Date Inputs for From Date and To Date */}

//       <CCol md={2}>
//         <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
//         <CFormInput
//           type="datetime-local"
//           id="fromDate"
//           value={formData.FromDate ? formData.FromDate.slice(0, 16) : ''} // Display local datetime value
//           onChange={(e) => handleDateChange('FromDate', e.target.value)} // Use handleDateChange for conversion
//           required
//         />
//         <CFormFeedback invalid>Please provide a valid from date.</CFormFeedback>
//       </CCol>

//       <CCol md={2}>
//         <CFormLabel htmlFor="toDate">To Date</CFormLabel>
//         <CFormInput
//           type="datetime-local"
//           id="toDate"
//           value={formData.ToDate ? formData.ToDate.slice(0, 16) : ''} // Display local datetime value
//           onChange={(e) => handleDateChange('ToDate', e.target.value)} // Use handleDateChange for conversion
//           required
//         />
//         <CFormFeedback invalid>Please provide a valid to date.</CFormFeedback>
//       </CCol>

//       <CCol xs={12}>
//         <div className="d-flex justify-content-end">
//           <div className="btn-group">
//             <button
//               className="btn btn-secondary"
//               type="submit"
//               onClick={() => handleDropdownClick('SHOW NOW')}
//             >
//               {buttonText}
//             </button>
//           </div>
//         </div>
//       </CCol>
//     </CForm>
//   )
// }


// const ShowGeofence = ({ statusLoading, apiData, selectedColumns, columns, devices }) => {

//   const [addressCache, setAddressCache] = useState({}); // Cache addresses to avoid multiple API calls

//   // if (!apiData) return <><Loader></>; // Show loading state
//   // if (!Array.isArray(apiData) || apiData.length === 0) return <div>No Data Available</div>;

//   const renderColumnData = (data, column) => {
//     switch (column) {
//       case 'Name':
//         return data.name;
//       case 'Type':
//         return data.type;
//       case 'Message':
//         return data.message;
//       case 'Location':
//         const [lat, lng] = data.location || [];
//         if (!lat || !lng) return 'Coordinates not available';

//         const key = `${lat},${lng}`;
//         if (addressCache[key]) {
//           return addressCache[key]; // Return cached address
//         }

//         // Fetch address asynchronously and update cache
//         getAddressFromLatLng(lat, lng).then((address) => {
//           setAddressCache((prev) => ({ ...prev, [key]: address }));
//         });

//         return 'Fetching address...'; // Temporary placeholder
//       case 'Created At':
//         return new Date(data.createdAt).toLocaleString('en-IN', {
//           timeZone: 'Asia/Kolkata',
//           hour12: false, // Use 24-hour format
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//         });
//       default:
//         return '-';
//     }
//   };

//   // Address convertor

//   const getAddressFromLatLng = async (latitude, longitude) => {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

//     try {
//       const response = await axios.get(url);
//       const address = response.data?.display_name || 'Address not found';
//       return address;
//     } catch (error) {
//       console.error('Error fetching address: ', error.message);
//       return 'Address not found';
//     }
//   };


//   // Export table data to PDF
//    const exportToPDF = () => {
//     const doc = new jsPDF();
//     const tableColumns = selectedColumns.length > 0 ? selectedColumns : columns;
//     const tableRows = apiData.map((data, index) => {
//       return tableColumns.map((col) => renderColumnData(data, col));
//     });

//     doc.autoTable({
//       head: [tableColumns],
//       body: tableRows,
//     });

//     doc.save('table_data.pdf');
//   };

//    // Export table data to Excel
//    const exportToExcel = () => {
//     const tableColumns = selectedColumns.length > 0 ? selectedColumns : columns;
//     const tableRows = apiData.map((data, index) => {
//       return tableColumns.map((col) => renderColumnData(data, col));
//     });

//     // Create a worksheet and workbook
//     const worksheet = XLSX.utils.aoa_to_sheet([tableColumns, ...tableRows]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

//     // Export to Excel file
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, 'table_data.xlsx');
//   };

//   // ###################

//   const findDeviceName = (deviceId) => {
//     const device = devices.find((d) => d.deviceId === deviceId.toString())
//     return device ? device.name : 'Unknown Device'
//   };


//   return (
//     <>
//       <CTable bordered className="custom-table" style={{ overflowX: 'auto' }}>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell>SN</CTableHeaderCell>
//             {selectedColumns.length > 0
//               ? selectedColumns.map((col, index) => (
//                 <CTableHeaderCell key={index}>{col}</CTableHeaderCell>
//               ))
//               : columns.map((col, index) => (
//                 <CTableHeaderCell key={index}>{col}</CTableHeaderCell>
//               ))}
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {statusLoading ? (
//             <CTableRow style={{ position: 'relative' }}>
//               <CTableDataCell
//                 colSpan={selectedColumns.length + 1}
//                 style={{
//                   backgroundColor: '#f8f9fa',
//                   color: '#6c757d',
//                   fontStyle: 'italic',
//                   padding: '16px',
//                   textAlign: 'center',
//                   border: '1px dashed #dee2e6',
//                   height: '100px',
//                 }}
//               >
//                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
//                   <Loader />
//                 </div>
//               </CTableDataCell>
//             </CTableRow>
//           ) : (
//             apiData.length > 0 ? (
//               apiData.map((data, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }} >{index + 1}</CTableDataCell>
//                   {selectedColumns.length > 0
//                     ? selectedColumns.map((col, colIndex) => (
//                       <CTableDataCell key={colIndex} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{renderColumnData(data, col)}</CTableDataCell>
//                     ))
//                     : columns.map((col, colIndex) => (
//                       <CTableDataCell key={colIndex} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{renderColumnData(data, col)}</CTableDataCell>
//                     ))}
//                 </CTableRow>
//               ))
//             ) : (
//               <CTableRow>
//                 <CTableDataCell
//                   colSpan={allDates.length + 1}
//                   style={{
//                     backgroundColor: '#f8f9fa', // Light gray background
//                     color: '#6c757d', // Darker text color
//                     fontStyle: 'italic', // Italic font style
//                     padding: '16px', // Extra padding for emphasis
//                     textAlign: 'center', // Center the text
//                     border: '1px dashed #dee2e6', // Dashed border to highlight it
//                   }}
//                 >
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             )
//           )}
//         </CTableBody>
//       </CTable>

//       <CDropdown className="position-fixed bottom-0 end-0 m-3">
//         <CDropdownToggle color="secondary" style={{ borderRadius: '50%', padding: '10px', height: '48px', width: '48px' }}>
//           <CIcon icon={cilSettings} />
//         </CDropdownToggle>
//         <CDropdownMenu>
//           <CDropdownItem onClick={exportToPDF} >PDF</CDropdownItem>
//           <CDropdownItem onClick={exportToExcel} >Excel</CDropdownItem>
//         </CDropdownMenu>
//       </CDropdown>

//     </>
//   );
// };


// const GeofenceReports = () => {
//   const [formData, setFormData] = useState({
//     Devices: [],
//     Details: '',
//     Periods: '',
//     FromDate: '',
//     ToDate: '',
//     Columns: [],
//   });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [users, setUsers] = useState();
//   const [groups, setGroups] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showMap, setShowMap] = useState(false);

//   const [columns] = useState(['Name', 'Type', 'Message', 'Location', 'Created At']);
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [apiData, setApiData] = useState(null);
//   const [statusLoading, setStatusLoading] = useState(false);

//   const accessToken = Cookies.get('authToken');
//   const token = Cookies.get('authToken');

//   useEffect(() => {
//     getUser();
//     getGroups();
//   }, []);

//   const getUser = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       if (response.data) {
//         setUsers(response.data.users)
//         setLoading(false);
//         console.log("yaha tak thik hai")
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//       throw error
//       setLoading(false);
//     }
//   };

//   const getGroups = async (selectedUser = "") => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/group/${selectedUser}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       if (response.data.groupsAssigned) {
//         setGroups(response.data.groupsAssigned)
//         setLoading(false);
//         console.log("perticular user ke groups")
//       } else if (response.data.groups) {
//         setGroups(response.data.groups)
//         setLoading(false);
//         console.log("all groups")
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error('Error fetching data:', error)
//       throw error // Re-throw the error for further handling if needed
//     }
//   };

//   const getDevices = async (selectedGroup) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/device/getDeviceByGroup/${selectedGroup}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       if (response.data.success) {
//         setDevices(response.data.data)
//         setLoading(false)
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//       setDevices([])
//       setLoading(false)
//       throw error // Re-throw the error for further handling if needed
//     }
//   };

//   const handleInputChange = (name, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     if (name === 'Columns') {
//       setSelectedColumns(value);
//     }
//   };

//   const handleSubmit = async () => {
//     setStatusLoading(true);
//     const body = {
//       deviceId: formData.Devices,
//       fromDate: formData.FromDate ? new Date(formData.FromDate).toISOString() : null,
//       toDate: formData.ToDate ? new Date(formData.ToDate).toISOString() : null,
//     };

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/reports/geofence-by-time-range`,
//         body,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log('API response data:', response.data); // Debug log
//       setApiData(response.data.data.reverse()); // Ensure response.data is an array or contains reports
//       setStatusLoading(false);
//     } catch (error) {
//       setStatusLoading(false);
//       console.error('Error submitting form:', error);
//     }
//   };

//   return (
//     <div>
//       <CRow className="pt-3 gutter-0">
//         <CCol xs={12} md={12} className="px-4">
//           <CCard className="mb-4 p-0 shadow-lg rounded">
//             <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white" style={{ backgroundColor: '#494a43 !important', color: 'white' }}>
//               <strong>Geofence Report</strong>
//             </CCardHeader>
//             <CCardBody>
//               <SearchGeofence
//                 formData={formData}
//                 handleInputChange={handleInputChange}
//                 handleSubmit={handleSubmit}
//                 users={users}
//                 getGroups={getGroups}
//                 groups={groups}
//                 getDevices={getDevices}
//                 devices={devices}
//                 loading={loading}
//                 showMap={showMap}
//                 setShowMap={setShowMap}
//                 columns={columns}
//               />
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {showMap && (
//         <CRow className="justify-content-center mt-4 gutter-0">
//           <CCol xs={12} className="px-4">
//             <CCard className="p-0 mb-4 shadow-sm">
//               <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
//                 <strong>Geofence Report Results</strong>
//                 <CFormInput
//                   placeholder="Search..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   style={{ width: '250px' }}
//                 />
//               </CCardHeader>
//               <CCardBody>
//                 <ShowGeofence
//                   apiData={apiData}
//                   selectedColumns={selectedColumns}
//                   columns={columns}
//                   devices={devices}
//                   statusLoading={statusLoading}
//                 />
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       )}

//     </div>
//   );
// };

// export default GeofenceReports;


// #################################### NEW CODE #################################################################//




import React, { useEffect, useState } from 'react'
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
} from '@coreui/react'
import Select from 'react-select'
import Cookies from 'js-cookie'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilSettings } from '@coreui/icons'
import * as XLSX from 'xlsx' // For Excel export
import jsPDF from 'jspdf' // For PDF export
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable'
import { auto } from '@popperjs/core'
import Loader from '../../../components/Loader/Loader'
import '../style/remove-gutter.css';
import '../../../utils.css'

const SearchGeofence = ({
  formData,
  handleInputChange,
  handleSubmit,
  users,
  getGroups,
  groups,
  devices,
  loading,
  getDevices,
  setShowMap,
}) => {
  const [validated, setValidated] = useState(false)
  const [showDateInputs, setShowDateInputs] = useState(false) // State to manage button text
  const [buttonText, setButtonText] = useState('SHOW NOW')
  const [isDropdownOpen, setDropdownOpen] = useState(false) // State to manage dropdown visibility
  const [selectedU, setSelectedU] = useState()
  const [selectedG, setSelectedG] = useState()

  const allDevicesOption = { value: 'all', label: 'All Devices' } // Define an option for "All Devices"

  const convertToDesiredFormat = (inputDate) => {
    const date = new Date(inputDate) // Create a Date object with the given input
    // Get the timezone offset in minutes and convert to milliseconds
    const timezoneOffset = date.getTimezoneOffset() * 60000
    // Adjust the date object to local time by subtracting the offset
    const localDate = new Date(date.getTime() - timezoneOffset)
    // Convert to ISO string format and append the +00:00 offset
    const formattedDate = localDate.toISOString().replace('Z', '+00:00')
    console.log('Original Date:', date)
    console.log('Local Adjusted Date:', localDate)
    console.log('Formatted Date:', formattedDate)
    return formattedDate
  }

  // Modify the existing handleInputChange function to include the format conversion
  const handleDateChange = (field, value) => {
    const formattedDate = convertToDesiredFormat(value) // Convert the input date
    handleInputChange(field, formattedDate) // Call the input change handler
    console.log('Formatted Date:', formattedDate) // Log the formatted date
  }

  const handleFormSubmit = (event) => {
    const form = event.currentTarget
    console.log('handle submit ke pass hu')
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      handleSubmit()
      setShowMap(true) // Show the map
    }
    setValidated(true)
  }

  const handlePeriodChange = (value) => {
    handleInputChange('Periods', value)
    setShowDateInputs(value === 'Custom')
  }

  // Function to handle dropdown item clicks
  const handleDropdownClick = (text) => {
    setButtonText(text) // Change button text based on the clicked item
    setDropdownOpen(false) // Close the dropdown after selection
    handleSubmit() // Submit form
    setShowMap(true) // Show the map when form is valid and submitted
  }

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      <CCol md={3}>
        <CFormLabel htmlFor="devices">User</CFormLabel>
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
        <CFormFeedback invalid>Please provide a valid user.</CFormFeedback>

      </CCol>

      <CCol md={2}>
        <CFormLabel htmlFor="devices">Groups</CFormLabel>
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

        <CFormFeedback invalid>Please provide a valid group.</CFormFeedback>

      </CCol>

      <CCol md={3}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        <Select
          id="devices"
          isMulti
          options={[allDevicesOption, ...devices.map((device) => ({ value: device.deviceId, label: device.name }))]}
          onChange={(selectedOptions) => {
            // Step 2: Check if "All Devices" is selected
            if (selectedOptions.some((option) => option.value === 'all')) {
              // If "All Devices" is selected, select all device IDs
              const allDeviceIds = devices.map((device) => device.deviceId)
              handleInputChange('Devices', allDeviceIds) // Store all device IDs
            } else {
              // Otherwise, store the selected device IDs
              const selectedDeviceIds = selectedOptions.map((option) => option.value)
              handleInputChange('Devices', selectedDeviceIds)
            }
          }}
          placeholder="Choose devices..."
          isClearable={true}
        />
        <CFormFeedback invalid>Please provide valid devices.</CFormFeedback>
      </CCol>

      {/* Date Inputs for From Date and To Date */}

      <CCol md={2}>
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

      <CCol md={2}>
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
            <button
              className="btn btn-secondary"
              type="submit"
              onClick={() => handleDropdownClick('SHOW NOW')}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </CCol>
    </CForm>
  )
}


const ShowGeofence = ({ statusLoading, apiData, selectedColumns, columns, devices, searchQuery }) => {

  const [addressCache, setAddressCache] = useState({}); // Cache addresses to avoid multiple API calls

  // if (!apiData) return <><Loader></>; // Show loading state
  // if (!Array.isArray(apiData) || apiData.length === 0) return <div>No Data Available</div>;

  const renderColumnData = (data, column) => {
    switch (column) {
      case 'Name':
        return data.name;
      case 'Type':
        return data.type;
      case 'Message':
        return data.message;
      case 'Location':
        const [lat, lng] = data.location || [];
        if (!lat || !lng) return 'Coordinates not available';

        const key = `${lat},${lng}`;
        if (addressCache[key]) {
          return addressCache[key]; // Return cached address
        }

        // Fetch address asynchronously and update cache
        getAddressFromLatLng(lat, lng).then((address) => {
          setAddressCache((prev) => ({ ...prev, [key]: address }));
        });

        return 'Fetching address...'; // Temporary placeholder
      case 'Created At':
        return new Date(data.createdAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false, // Use 24-hour format
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      default:
        return '-';
    }
  };

  // Address convertor

  const getAddressFromLatLng = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    try {
      const response = await axios.get(url);
      const address = response.data?.display_name || 'Address not found';
      return address;
    } catch (error) {
      console.error('Error fetching address: ', error.message);
      return 'Address not found';
    }
  };


  // Export table data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumns = ['SN', ...selectedColumns.length > 0 ? selectedColumns : columns]; // Add 'SN' column
    const tableRows = apiData.map((data, index) => {
      const serialNumber = index + 1; // Serial number starting from 1
      const rowData = tableColumns.slice(1).map((col) => renderColumnData(data, col)); // Get the data for other columns
      return [serialNumber, ...rowData]; // Add SN as the first column in each row
    });

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      styles: {
        lineWidth: 0.5, // Thickness of cell borders
        lineColor: [0, 0, 0], // Border color (black)
      },
      tableLineWidth: 0.5, // Thickness of table outer border
      tableLineColor: [0, 0, 0], // Outer border color (black)
      margin: { top: 10 }, // Adjust the margin if needed
    });

    doc.save('Geofences.pdf');
  };


  // Export table data to Excel
  const exportToExcel = () => {
    const tableColumns = selectedColumns.length > 0 ? selectedColumns : columns;
    const tableRows = apiData.map((data, index) => {
      return tableColumns.map((col) => renderColumnData(data, col));
    });

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet([tableColumns, ...tableRows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

    // Export to Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Geofences.xlsx');
  };

  // ###################

  const findDeviceName = (deviceId) => {
    const device = devices.find((d) => d.deviceId === deviceId.toString())
    return device ? device.name : 'Unknown Device'
  };

  // Search vehicle in result portion for fillteraion

  const filteredData = (Array.isArray(apiData) ? apiData : []).filter((data) => {
    // Loop through each column in selectedColumns (or use default columns if no selected columns)
    return (selectedColumns.length > 0 ? selectedColumns : columns).some((col) => {
      // Get the value of the current column for this row
      const cellValue = renderColumnData(data, col).toString().toLowerCase();

      // Check if the cell value contains the search query (case-insensitive)
      return cellValue.includes(searchQuery.toLowerCase());
    });
  });


  return (
    <>
      <CTable bordered className="custom-table" style={{ overflowX: 'auto' }}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>SN</CTableHeaderCell>
            {selectedColumns.length > 0
              ? selectedColumns.map((col, index) => (
                <CTableHeaderCell key={index}>{col}</CTableHeaderCell>
              ))
              : columns.map((col, index) => (
                <CTableHeaderCell key={index}>{col}</CTableHeaderCell>
              ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {statusLoading ? (
            <CTableRow style={{ position: 'relative' }}>
              <CTableDataCell
                colSpan={selectedColumns.length + 6}
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
            </CTableRow>
          ) : (
            filteredData.length > 0 ? (
              filteredData.map((data, index) => (
                <CTableRow key={index}>
                  <CTableDataCell style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }} >{index + 1}</CTableDataCell>
                  {selectedColumns.length > 0
                    ? selectedColumns.map((col, colIndex) => (
                      <CTableDataCell key={colIndex} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{renderColumnData(data, col)}</CTableDataCell>
                    ))
                    : columns.map((col, colIndex) => (
                      <CTableDataCell key={colIndex} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2" }}>{renderColumnData(data, col)}</CTableDataCell>
                    ))}
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell
                  colSpan={selectedColumns.length + 6}
                  style={{
                    backgroundColor: '#f8f9fa', // Light gray background
                    color: '#6c757d', // Darker text color
                    fontStyle: 'italic', // Italic font style
                    padding: '16px', // Extra padding for emphasis
                    textAlign: 'center', // Center the text
                    border: '1px dashed #dee2e6', // Dashed border to highlight it
                  }}
                >
                  No data available
                </CTableDataCell>
              </CTableRow>
            )
          )}
        </CTableBody>
      </CTable>

      <CDropdown className="position-fixed bottom-0 end-0 m-3">
        <CDropdownToggle color="secondary" style={{ borderRadius: '50%', padding: '10px', height: '48px', width: '48px' }}>
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


const GeofenceReports = () => {
  const [formData, setFormData] = useState({
    Devices: [],
    Details: '',
    Periods: '',
    FromDate: '',
    ToDate: '',
    Columns: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState();
  const [groups, setGroups] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [columns] = useState(['Name', 'Type', 'Message', 'Location', 'Created At']);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const accessToken = Cookies.get('authToken');
  const token = Cookies.get('authToken');

  useEffect(() => {
    getUser();
    getGroups();
  }, []);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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
  };

  const getGroups = async (selectedUser = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/group/${selectedUser}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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
  };

  const getDevices = async (selectedGroup) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/device/getDeviceByGroup/${selectedGroup}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.success) {
        setDevices(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setDevices([])
      setLoading(false)
      throw error // Re-throw the error for further handling if needed
    }
  };

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
    const body = {
      deviceId: formData.Devices,
      fromDate: formData.FromDate ? new Date(formData.FromDate).toISOString() : null,
      toDate: formData.ToDate ? new Date(formData.ToDate).toISOString() : null,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reports/geofence-by-time-range`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('API response data:', response.data); // Debug log
      setApiData(response.data.data); // Ensure response.data is an array or contains reports
      setStatusLoading(false);
    } catch (error) {
      setStatusLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <CRow className="pt-3 gutter-0">
        <CCol xs={12} md={12} className="px-4">
          <CCard className="mb-4 p-0 shadow-lg rounded">
            <CCardHeader className="d-flex justify-content-between align-items-center text-white" style={{ color: 'white' }}>
              <strong>Geofence Report</strong>
            </CCardHeader>
            <CCardBody>
              <SearchGeofence
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                users={users}
                getGroups={getGroups}
                groups={groups}
                getDevices={getDevices}
                devices={devices}
                loading={loading}
                showMap={showMap}
                setShowMap={setShowMap}
                columns={columns}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {showMap && (
        <CRow className="justify-content-center mt-4 gutter-0">
          <CCol xs={12} className="px-4">
            <CCard className="p-0 mb-4 shadow-sm">
              <CCardHeader className="d-flex justify-content-between align-items-center  text-white">
                <strong>Geofence Report Results</strong>
                <CFormInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '250px' }}
                />
              </CCardHeader>
              <CCardBody>
                <ShowGeofence
                  apiData={apiData}
                  selectedColumns={selectedColumns}
                  columns={columns}
                  devices={devices}
                  statusLoading={statusLoading}
                  searchQuery={searchQuery}  // Passing searchQuery to ShowGeofence
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

    </div>
  );
};

export default GeofenceReports;
