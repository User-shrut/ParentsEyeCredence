// import React, { useState } from 'react'
// import {
//   TableContainer,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogContent,
//   Typography,
//   Button,
//   InputBase,
// } from '@mui/material'
// import { RiEdit2Fill } from 'react-icons/ri'
// import { AiFillDelete } from 'react-icons/ai'
// import SearchIcon from '@mui/icons-material/Search'
// import girl1 from './Images/girl-1.jpg'
// import girls3 from './Images/girls-3.jpg'
// import girls5 from './Images/girls-5.jpg'
// import mens1 from './Images/mens-1.jpg'
// import mens2 from './Images/mens-2.jpg'
// import mens4 from './Images/mens-4.jpg'
// import {
//   CAvatar,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CImage,
// } from '@coreui/react'
// import { useNavigate } from 'react-router-dom' // Import useNavigate

// const data = [
//   { id: 101, name: 'Vihaan Deshmukh', mobile: '123-456-7890', status: 'Present', image: girl1 },
//   { id: 102, name: 'Dom', mobile: '123-456-7449', status: 'Present', image: mens1 },
//   { id: 103, name: 'Paul', mobile: '123-456-7449', status: 'Absent', image: girls3 },
//   { id: 104, name: 'Whick', mobile: '123-456-7449', status: 'Present', image: mens2 },
//   { id: 105, name: 'Kavin', mobile: '123-456-7449', status: 'Absent', image: mens4 },
//   { id: 106, name: 'Olive', mobile: '123-456-7449', status: 'Present', image: girls5 },
// ]

// const getStatusColor = (status) => {
//   return status === 'Present' ? 'green' : 'red'
// }

// const Devices = () => {
//   const [open, setOpen] = useState(false) // Dialog state for image zoom
//   const [selectedImage, setSelectedImage] = useState(null) // Holds the currently selected image for zoom
//   const [showSearch, setShowSearch] = useState(false) // Toggles the search bar visibility
//   const [searchQuery, setSearchQuery] = useState('') // Holds the user's search input
//   const navigate = useNavigate() // Used for navigating to another page

//   const handleImageClick = (image) => {
//     setSelectedImage(image)
//     setOpen(true)
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setSelectedImage(null)
//   }

//   const handleSearchIconClick = () => {
//     setShowSearch(!showSearch)
//     if (showSearch) setSearchQuery('') // Reset the search when collapsing
//   }

//   const handleManualAttendanceClick = () => {
//     navigate('/manual-attendance') // Navigate to manual attendance page
//   }

//   // Filter data based on search query for Name, Mobile No, and ID
//   const filteredData = data.filter((item) => {
//     const searchLower = searchQuery.toLowerCase()
//     return (
//       item.name.toLowerCase().includes(searchLower) ||
//       item.mobile.toLowerCase().includes(searchLower) ||
//       item.id.toString().toLowerCase().includes(searchLower)
//     )
//   })

//   return (
//     <div>
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingBottom: '10px',
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Devices Table
//         </Typography>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           {showSearch && (
//             <InputBase
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{
//                 marginRight: '5px',
//                 backgroundColor: '#f0f0f0',
//                 borderRadius: '3px',
//                 padding: '5px 10px',
//                 transition: 'width 0.5s',
//                 width: showSearch ? '200px' : '0px',
//               }}
//             />
//           )}
//           <IconButton onClick={handleSearchIconClick} style={{ color: 'grey' }}>
//             <SearchIcon />
//           </IconButton>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{ marginLeft: '10px' }}
//             onClick={handleManualAttendanceClick} // Add onClick event to navigate
//           >
//             Manual Attendance
//           </Button>
//         </div>
//       </div>

//       <div
//         style={{
//           overflowX: 'auto',
//           backgroundColor: '#212631',
//           borderRadius: '10px',
//         }}
//       >
//         <TableContainer component={Paper} style={{ width: '100%' }}>
//           <CTable align="middle" className="mb-0 border" hover responsive>
//             <CTableHead className="text-nowrap">
//               <CTableRow>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Image</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">ID</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">
//                   Mobile No
//                 </CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">
//                   Actions
//                 </CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredData.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell className="text-center">
//                     <CImage
//                       rounded
//                       thumbnail
//                       src={item.image}
//                       onClick={() => handleImageClick(item.image)}
//                       style={{ width: '60px', height: '60px', cursor: 'pointer' }}
//                     />
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <div>{item.id}</div>
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <div>{item.name}</div>
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <div>{item.mobile}</div>
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <div
//                       style={{
//                         backgroundColor: getStatusColor(item.status),
//                         color: 'white',
//                         padding: '4px 10px',
//                         borderRadius: '10px',
//                         display: 'inline-block',
//                       }}
//                     >
//                       {item.status}
//                     </div>
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <IconButton aria-label="edit">
//                       <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue' }} />
//                     </IconButton>
//                     <IconButton aria-label="delete">
//                       <AiFillDelete style={{ fontSize: '25px', color: 'brown' }} />
//                     </IconButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         </TableContainer>
//       </div>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           style: {
//             overflow: 'hidden',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogContent style={{ padding: 0 }}>
//           {selectedImage && (
//             <img src={selectedImage} alt="Zoomed" style={{ borderRadius: '50%', height: 'auto' }} />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default Devices

// import React, { useState, useEffect } from 'react'
// import axios from 'axios' // Don't forget to import axios
// import {
//   TableContainer,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogContent,
//   Typography,
//   Button,
//   InputBase,
// } from '@mui/material'
// import { RiEdit2Fill } from 'react-icons/ri'
// import { AiFillDelete } from 'react-icons/ai'
// import SearchIcon from '@mui/icons-material/Search'
// import girl1 from './Images/girl-1.jpg'
// import girls3 from './Images/girls-3.jpg'
// import girls5 from './Images/girls-5.jpg'
// import mens1 from './Images/mens-1.jpg'
// import mens2 from './Images/mens-2.jpg'
// import mens4 from './Images/mens-4.jpg'
// import {
//   CAvatar,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CImage,
// } from '@coreui/react'
// import { useNavigate } from 'react-router-dom' // Import useNavigate

// const getStatusColor = (status) => {
//   return status === 'online' ? 'green' : 'red'
// }

// const Devices = () => {
//   const [open, setOpen] = useState(false) // Dialog state for image zoom
//   const [selectedImage, setSelectedImage] = useState(null) // Holds the currently selected image for zoom
//   const [showSearch, setShowSearch] = useState(false) // Toggles the search bar visibility
//   const [searchQuery, setSearchQuery] = useState('') // Holds the user's search input
//   const [loading, setLoading] = useState(false) // Loading state for fetch
//   const [data, setData] = useState([]) // Data state for devices
//   const [totalResponses, setTotalResponses] = useState(0) // Store total responses
//   const navigate = useNavigate() // Used for navigating to another page

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const handleImageClick = (image) => {
//     setSelectedImage(image)
//     setOpen(true)
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setSelectedImage(null)
//   }

//   const handleSearchIconClick = () => {
//     setShowSearch(!showSearch)
//     if (showSearch) setSearchQuery('') // Reset the search when collapsing
//   }

//   const handleManualAttendanceClick = () => {
//     navigate('/manual-attendance') // Navigate to manual attendance page
//   }

//   // Fetch data from the API
//   const fetchData = async () => {
//     console.log('Fetching data...')
//     setLoading(true) // Set loading to true when starting fetch
//     try {
//       const username = 'school'
//       const password = '123456'
//       const token = btoa(`${username}:${password}`)

//       const response = await axios.get('https://rocketsalestracker.com/api/devices', {
//         headers: {
//           Authorization: `Basic ${token}`,
//         },
//       })

//       console.log('fetch data', response.data)

//       if (Array.isArray(response.data)) {
//         setData(response.data) // Set fetched data to state
//         setTotalResponses(response.data.length)
//       } else {
//         console.error('Expected an array but got:', response.data)
//         alert('Unexpected data format received.')
//       }
//     } catch (error) {
//       console.error('Fetch data error:', error)
//       alert('An error occurred while fetching data.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Filter data based on search query for Name, Mobile No, and ID
//   const filteredData = data.filter((item) => {
//     const searchLower = searchQuery.toLowerCase()
//     return (
//       item.name.toLowerCase().includes(searchLower) ||
//       item.phone.toLowerCase().includes(searchLower) ||
//       item.id.toString().toLowerCase().includes(searchLower)
//     )
//   })

//   return (
//     <div>
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingBottom: '10px',
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Devices Table
//         </Typography>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           {showSearch && (
//             <InputBase
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{
//                 marginRight: '5px',
//                 backgroundColor: '#f0f0f0',
//                 borderRadius: '3px',
//                 padding: '5px 10px',
//                 transition: 'width 0.5s',
//                 width: showSearch ? '200px' : '0px',
//               }}
//             />
//           )}
//           <IconButton onClick={handleSearchIconClick} style={{ color: 'grey' }}>
//             <SearchIcon />
//           </IconButton>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{ marginLeft: '10px' }}
//             onClick={handleManualAttendanceClick}
//           >
//             Manual Attendance
//           </Button>
//         </div>
//       </div>

//       <div
//         style={{
//           overflowX: 'auto',
//           backgroundColor: '#212631',
//           borderRadius: '10px',
//         }}
//       >
//         <TableContainer component={Paper} style={{ width: '100%' }}>
//           <CTable align="middle" className="mb-0 border" hover responsive>
//             <CTableHead className="text-nowrap">
//               <CTableRow>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">ID</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Phone</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
//                 {/* <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell> */}
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredData.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell className="text-center">
//                     <div>{item.id}</div>
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <div>{item.name}</div>
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <div>{item.phone}</div>
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <div
//                       style={{
//                         backgroundColor: getStatusColor(item.status),
//                         color: 'white',
//                         padding: '4px 10px',
//                         borderRadius: '10px',
//                         display: 'inline-block',
//                       }}
//                     >
//                       {item.status}
//                     </div>
//                   </CTableDataCell>

//                   <CTableDataCell className="text-center">
//                     <IconButton aria-label="edit">
//                       <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue' }} />
//                     </IconButton>
//                     <IconButton aria-label="delete">
//                       <AiFillDelete style={{ fontSize: '25px', color: 'brown' }} />
//                     </IconButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         </TableContainer>
//       </div>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           style: {
//             overflow: 'hidden',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogContent style={{ padding: 0 }}>
//           {selectedImage && (
//             <img src={selectedImage} alt="Zoomed" style={{ borderRadius: '50%', height: 'auto' }} />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default Devices


//new
// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import {
//   TableContainer,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogContent,
//   Typography,
//   Button,
//   InputBase,
// } from '@mui/material'
// import { RiEdit2Fill } from 'react-icons/ri'
// import { RiAddBoxFill } from "react-icons/ri";
// import { AiFillDelete } from 'react-icons/ai'
// import SearchIcon from '@mui/icons-material/Search'
// import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
// import { useNavigate } from 'react-router-dom'
// import  Loader  from "../../../components/Loader/Loader";

// const getStatusColor = (status) => (status === 'online' ? 'green' : 'red');

// const Devices = () => {
//   const [open, setOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false); // Loader state
//   const [data, setData] = useState([]);
//   const [totalResponses, setTotalResponses] = useState(0);
//   const navigate = useNavigate();

//   const columns = [
//     { Header: 'ID', accessor: 'id' },
//     { Header: 'Group ID', accessor: 'groupId' },
//     { Header: 'Calendar ID', accessor: 'calendarId' },
//     { Header: 'Name', accessor: 'name' },
//     { Header: 'Unique ID', accessor: 'uniqueId' },
//     { Header: 'Last Update', accessor: 'lastUpdate', Cell: ({ value }) => new Date(value).toLocaleString() },
//     { Header: 'Position ID', accessor: 'positionId' },
//     { Header: 'Phone', accessor: 'phone' },
//     { Header: 'Model', accessor: 'model' },
//     { Header: 'Contact', accessor: 'contact' },
//     { Header: 'Category', accessor: 'category' },
//     { Header: 'Disabled', accessor: 'disabled', Cell: ({ value }) => (value ? 'Yes' : 'No') },
//     { Header: 'Expiration Time', accessor: 'expirationTime', Cell: ({ value }) => value ? new Date(value).toLocaleString() : 'N/A' },
//     { Header: 'Status', accessor: 'status' },
//   ];

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true); // Start loading
//     try {
//       const username = 'school';
//       const password = '123456';
//       const token = btoa(`${username}:${password}`);

//       const response = await axios.get('https://rocketsalestracker.com/api/devices', {
//         headers: {
//           Authorization: `Basic ${token}`,
//         },
//       });

//       if (Array.isArray(response.data)) {
//         setData(response.data);
//         setTotalResponses(response.data.length);
//       } else {
//         console.error('Expected an array but got:', response.data);
//         alert('Unexpected data format received.');
//       }
//     } catch (error) {
//       console.error('Fetch data error:', error);
//       alert('An error occurred while fetching data.');
//     } finally {
//       setLoading(false); // Stop loading once data is fetched
//     }
//   };

//   const filteredData = data.filter((item) => {
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       item.name.toLowerCase().includes(searchLower) ||
//       item.phone.toLowerCase().includes(searchLower) ||
//       item.id.toString().toLowerCase().includes(searchLower)
//     );
//   });

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
//         <Typography variant="h6" gutterBottom>
//           Devices Table
//         </Typography>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           {showSearch && (
//             <InputBase
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{
//                 marginRight: '5px',
//                 backgroundColor: '#f0f0f0',
//                 borderRadius: '3px',
//                 padding: '5px 10px',
//                 transition: 'width 0.5s',
//                 width: showSearch ? '200px' : '0px',
//               }}
//             />
//           )}
//           <IconButton onClick={() => setShowSearch(!showSearch)} style={{ color: 'grey' }}>
//             <SearchIcon />
//           </IconButton>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{ marginLeft: '10px' }}
//             onClick={() => navigate('/manual-attendance')}
//           >
//             Manual Attendance
//           </Button>
//         </div>
//       </div>

//       <div style={{ overflowX: 'auto', backgroundColor: '#212631', borderRadius: '10px' }}>
//         {loading ? ( // Show loader if loading
//           <Loader />
//         ) : (
//           <TableContainer component={Paper} style={{ width: '100%', overflowX: 'auto' }}>
//             <CTable align="middle" className="mb-0 border" hover responsive>
//               <CTableHead className="text-nowrap">
//                 <CTableRow>
//                   {columns.map((column, index) => (
//                     <CTableHeaderCell key={index} className="bg-body-tertiary text-center">
//                       {column.Header}
//                     </CTableHeaderCell>
//                   ))}
//                   <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.map((item, index) => (
//                   <CTableRow key={index}>
//                     {columns.map((column, i) => (
//                       <CTableDataCell key={i} className="text-center">
//                         {column.accessor === 'status' ? (
//                           <div
//                             style={{
//                               backgroundColor: getStatusColor(item.status),
//                               color: 'white',
//                               padding: '4px 10px',
//                               borderRadius: '10px',
//                               display: 'inline-block',
//                             }}
//                           >
//                             {item[column.accessor]}
//                           </div>
//                         ) : (
//                           item[column.accessor]
//                         )}
//                       </CTableDataCell>
//                     ))}
//                     <CTableDataCell className="text-center d-flex">
//                       <IconButton aria-label="add">
//                         <RiAddBoxFill style={{ fontSize: '25px', color: 'orange' }} />
//                       </IconButton>
//                       <IconButton aria-label="edit">
//                         <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue' }} />
//                       </IconButton>
//                       <IconButton aria-label="delete">
//                         <AiFillDelete style={{ fontSize: '25px', color: 'brown' }} />
//                       </IconButton>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>
//           </TableContainer>
//         )}
//       </div>

//       <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ style: { overflow: 'hidden', maxWidth: 'none' } }}>
//         <DialogContent style={{ padding: 0 }}>
//           {selectedImage && (
//             <img src={selectedImage} alt="Zoomed" style={{ borderRadius: '50%', height: 'auto' }} />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Devices;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { RiEdit2Fill, RiAddBoxFill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import SearchIcon from '@mui/icons-material/Search';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import Loader from "../../components/Loader/Loader";
import CloseIcon from '@mui/icons-material/Close'; 
// import { FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
const getStatusColor = (status) => (status === 'online' ? 'green' : 'red');

const Devices = () => {
  const [open, setOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false); // Modal for adding a new row
  const [formData, setFormData] = useState({}); // Form data state
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [filteredRows, setFilteredRows] = useState([]);
  const handleModalClose = () => setAddModalOpen(false);
  const [filteredData, setFilteredData] = useState([]); // Your initial data
  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Group ID', accessor: 'groupId' },
    { Header: 'Calendar ID', accessor: 'calendarId' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Unique ID', accessor: 'uniqueId' },
    { Header: 'Last Update', accessor: 'lastUpdate', Cell: ({ value }) => new Date(value).toLocaleString() },
    { Header: 'Position ID', accessor: 'positionId' },
    { Header: 'Phone', accessor: 'phone' },
    { Header: 'Model', accessor: 'model' },
    { Header: 'Contact', accessor: 'contact' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Disabled', accessor: 'disabled', Cell: ({ value }) => (value ? 'Yes' : 'No') },
    { Header: 'Expiration Time', accessor: 'expirationTime', Cell: ({ value }) => value ? new Date(value).toLocaleString() : 'N/A' },
    { Header: 'Status', accessor: 'status' },
  ];

  useEffect(() => {
    fetchData();
  }, []);
  
  const style = {
    position: "absolute",
    top: "50%",
    left: "12%",
    transform: "translate(-50%, -50%)",
    width: "25%",
    height: "101%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflowY: "auto", // Enable vertical scrolling
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    margintop:'8px'
  };
  /* Replace -ms-high-contrast with forced-colors */
// @media (forced-colors: active) {
//   /* Styles for high contrast mode */
//   body {
//     background-color: WindowText;
//     color: Window;
//   }
// }

  
  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const username = 'school';
      const password = '123456';
      const token = btoa(`${username}:${password}`);

      const response = await axios.get('https://rocketsalestracker.com/api/devices', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setData(response.data);
        setTotalResponses(response.data.length);
      } else {
        console.error('Expected an array but got:', response.data);
        alert('Unexpected data format received.');
      }
    } catch (error) {
      console.error('Fetch data error:', error);
      alert('An error occurred while fetching data.');
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // const filteredData = data.filter((item) => {
  //   const searchLower = searchQuery.toLowerCase();
  //   return (
  //     item.name.toLowerCase().includes(searchLower) ||
  //     item.phone.toLowerCase().includes(searchLower) ||
  //     item.id.toString().toLowerCase().includes(searchLower)
  //   );
  // });
  // useEffect(() => {
  //   const lowerCaseQuery = searchQuery.toLowerCase();
  //   setFilteredData(data.filter(item =>
  //     item.name.toLowerCase().includes(lowerCaseQuery) ||
  //     item.id.toString().includes(lowerCaseQuery)
  //   ));
  // }, [data, searchQuery]);


  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredData(data.filter(item =>
      columns.some(column =>
        item[column.accessor]?.toString().toLowerCase().includes(lowerCaseQuery)
      )
    ));
  }, [data, searchQuery, columns]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleAddSubmit = () => {
  //   // Logic to handle form submission (e.g., send data to API)
  //   console.log('Form Data:', formData);
  //   // Close modal after submission
  //   setAddModalOpen(false);
  // };
  const handleAddSubmit = async () => {
    try {
      // Define the API endpoint and credentials
      const apiUrl = "https://rocketsalestracker.com/api/devices"; // Replace with actual API endpoint
      const username = "school"; // Replace with your actual username
      const password = "123456"; // Replace with your actual password
      const token = btoa(`${username}:${password}`); // Encode credentials in Base64
  
      // Prepare the new row object based on the expected schema
      const newRow = {
        name: formData.name, // Ensure formData has 'name'
        uniqueId: formData.uniqueId, // Ensure formData has 'uniqueId'
        groupId: formData.groupId, // Ensure formData has 'groupId'
        attributes: formData.attributes || {}, // Ensure formData has 'attributes' (empty object if not provided)
        calendarId: formData.calendarId, // Ensure formData has 'calendarId'
        status: formData.status, // Ensure formData has 'status'
        phone: formData.phone, // Ensure formData has 'phone'
        model: formData.model, // Ensure formData has 'model'
        expirationTime: formData.expirationTime, // Ensure formData has 'expirationTime'
        contact: formData.contact, // Ensure formData has 'contact'
        category: formData.category, // Ensure formData has 'category'
      };
  
      // POST request to the server with Basic Auth
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${token}`, // Add Basic Auth header
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRow),
      });
  
      // Parse the JSON response
      const result = await response.json();
  
      if (response.ok) {
        // Update the state with the new row
        setFilteredRows([...filteredRows, result]);
  
        // Close the modal and refresh data
        handleModalClose();
        fetchData();
  
        console.log("Record created successfully:", result);
        alert("Record created successfully");
      } else {
        // Log and alert the specific server response in case of an error
        console.error("Server responded with:", result);
        alert(`Unable to create record: ${result.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      alert("Unable to create record");
      // Handle the error appropriately (e.g., show a notification to the user)
    }
  };
  const [groups, setGroups] = useState([]);
  // const [error, setError] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/groups', {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa('school:123456') // Replace with actual credentials
          }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        setGroups(data); // Assuming the API returns { groups: [...] }
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchGroups();
  }, []);
  const [calendars, setCalendars] = useState([]); // State to store calendar data
const [calendarError, setCalendarError] = useState(null); // State to store error

useEffect(() => {
  const fetchCalendars = async () => {
    try {
      const response = await fetch('https://rocketsalestracker.com/api/calendars', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('school:123456') // Replace with actual credentials
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCalendars(data); // Assuming the API returns { calendars: [...] }
    } catch (error) {
      setCalendarError(error.message);
    }
  };

  fetchCalendars();
}, []);


// const handleDeleteSelected = async (id) => {
//   if (window.confirm("Are you sure you want to delete this record?")) {
//     try {
//       const username = "school"; // Replace with your actual username
//       const password = "123456"; // Replace with your actual password
//       const token = btoa(`${username}:${password}`); // Encode credentials in Base64
  
//       const response = await fetch(`https://rocketsalestracker.com/api/items/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Basic ${token}` // Add authorization if needed
//         },
//       });

//       if (response.ok) {
//         // Update the state to remove the deleted row
//         setFilteredData(filteredData.filter((item) => item.id !== id));
//         alert("Record deleted successfully");
//       } else {
//         const result = await response.json();
//         console.error("Server responded with:", result);
//         alert(`Unable to delete record: ${result.message || response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error during DELETE request:", error);
//       alert("Unable to delete record");
//     }
//   }
//   fetchData();
// };
// const handleDeleteSelected = async (id) => {
//   if (window.confirm("Are you sure you want to delete this record?")) {
//     try {
//       const username = "school"; // Replace with your actual username
//       const password = "123456"; // Replace with your actual password
//       const token = btoa(`${username}:${password}`); // Encode credentials in Base64

//       const response = await fetch(`https://rocketsalestracker.com/api/devices/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Basic ${token}` // Add authorization if needed
//         },
//       });

//       if (response.ok) {
//         // Update the state to remove the deleted row
//         setFilteredData(filteredData.filter((item) => item.id !== id));
//         alert("Record deleted successfully");
//       } else {
//         const result = await response.json();
//         console.error("Server responded with:", result);
//         alert(`Unable to delete record: ${result.message || response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error during DELETE request:", error);
//       alert("Unable to delete record. Please check the console for more details.");
//     }
//   }
// };
const handleDeleteSelected = async (id) => {
  if (window.confirm("Are you sure you want to delete this record?")) {
    try {
      const username = "school"; // Replace with your actual username
      const password = "123456"; // Replace with your actual password
      const token = btoa(`${username}:${password}`); // Encode credentials in Base64

      const response = await fetch(`https://rocketsalestracker.com/api/devices/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${token}`
        },
      });

      if (response.ok) {
        // Update the state to remove the deleted row
        setFilteredData(filteredData.filter((item) => item.id !== id));
        alert("Record deleted successfully");
      } else {
        const result = await response.json();
        console.error("Server responded with:", result);
        alert(`Unable to delete record: ${result.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during DELETE request:", error);
      alert("Unable to delete record. Please check the console for more details.");
    }
  }
};
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
        <Typography variant="h6" gutterBottom>
          Devices Table
        </Typography>
        {/* <IconButton onClick={() => setAddModalOpen(true)}>
          <RiAddBoxFill style={{ fontSize: '25px', color: 'orange' }} />
        </IconButton>  */}

       <div style={{display:'flex',gap:'15px'}}>
       <InputBase
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: '5px', backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '5px 10px',border:'0.5px solid grey',marginTop:"7px" }}
        />
        {/* <IconButton onClick={() => setAddModalOpen(true)}>
                        <RiAddBoxFill style={{ fontSize: '25px', color: 'orange' }} />
        </IconButton> */}
        <Button 
  onClick={() => setAddModalOpen(true)} 
  variant="contained" 
  style={{ backgroundColor: '#52a052', color: 'white', fontSize: '12px',height:'43px',borderRadius:"5px",marginTop:'7px' }}
>
  Add
</Button>
       </div>
        
      </div>

      {/* <TableContainer component={Paper}>
        {loading ? (
          <Loader />
        ) : (
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                {columns.map((column, index) => (
                  <CTableHeaderCell key={index} className="bg-body-tertiary text-center">
                    {column.Header}
                  </CTableHeaderCell>
                  
                ))}
                <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.map((item, index) => (
                <CTableRow key={index}>
                  {columns.map((column, i) => (
                    <CTableDataCell key={i} className="text-center">
                      {item[column.accessor]}
                    </CTableDataCell>
                  ))}
                   <CTableDataCell className="text-center d-flex">
                      {/* <IconButton onClick={() => setAddModalOpen(true)}>
                        <RiAddBoxFill style={{ fontSize: '25px', color: 'orange' }} />
                      </IconButton> 
                      <IconButton aria-label="edit">
                        <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue',margin:'5.3px' }} />
                      </IconButton>
                      <IconButton
  aria-label="delete"
  onClick={handleDeleteSelected} // Add the click handler
  sx={{ marginRight: "10px", color: "brown" }} // Add margin and color styling
>
  <AiFillDelete style={{ fontSize: "25px" }} /> {/* Retain your icon styling 
</IconButton>

                    </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </TableContainer> */}
{/* <TableContainer component={Paper}>
  {loading ? (
    <Loader />
  ) : (
    <CTable align="middle" className="mb-0 border" hover responsive>
      <CTableHead className="text-nowrap">
        <CTableRow>
          {columns.map((column, index) => (
            <CTableHeaderCell key={index} className="bg-body-tertiary text-center">
              {column.Header}
            </CTableHeaderCell>
          ))}
          <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {filteredData.map((item, index) => (
          <CTableRow key={index}>
            {columns.map((column, i) => (
              <CTableDataCell key={i} className="text-center">
                {item[column.accessor]}
              </CTableDataCell>
            ))}
            <CTableDataCell className="text-center d-flex">
              <IconButton aria-label="edit">
                <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }} />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteSelected(item.id)} // Pass the item's unique ID to handleDeleteSelected
                sx={{ marginRight: "10px", color: "brown" }}
              >
                <AiFillDelete style={{ fontSize: "25px" }} />
              </IconButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )}
</TableContainer> */}
 <TableContainer component={Paper}>
      {loading ? (
        <Loader />
      ) : (
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              {columns.map((column, index) => (
                <CTableHeaderCell key={index} className="bg-body-tertiary text-center">
                  {column.Header}
                </CTableHeaderCell>
              ))}
              <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((item, index) => (
              <CTableRow key={index}>
                {columns.map((column, i) => (
                  <CTableDataCell key={i} className="text-center">
                    {item[column.accessor]}
                  </CTableDataCell>
                ))}
                <CTableDataCell className="text-center d-flex">
                  <IconButton aria-label="edit">
                    <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }} />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteSelected(item.id)} // Pass the item's unique ID to handleDeleteSelected
                    sx={{ marginRight: "10px", color: "brown" }}
                  >
                    <AiFillDelete style={{ fontSize: "25px" }} />
                  </IconButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </TableContainer>
   
   <Modal open={addModalOpen} onClose={handleModalClose}>
  <Box sx={style}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <Typography variant="h6">Add Device</Typography>
      <IconButton onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </Box>

    {/* Group ID dropdown */}
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel>Group ID</InputLabel>
      <Select
        name="groupId"
        value={formData.groupId || ''}
        onChange={handleInputChange}
        label="Group ID"
      >
        {groups.map((group) => (
          <MenuItem key={group.id} value={group.id}>
            {group.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Calendar ID dropdown */}
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel>Calendar ID</InputLabel>
      <Select
        name="calendarId"
        value={formData.calendarId || ''}
        onChange={handleInputChange}
        label="Calendar ID"
      >
        {calendars.map((calendar) => (
          <MenuItem key={calendar.id} value={calendar.id}>
            {calendar.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Other fields like Name, Unique ID, etc */}
    {columns.slice(3, -1).map((col) => (
      <TextField
        key={col.accessor}
        label={col.Header}
        variant="outlined"
        name={col.accessor}
        value={formData[col.accessor] || ''}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
    ))}

    <Button
      variant="contained"
      color="primary"
      onClick={handleAddSubmit}
      sx={{ marginTop: 2 }}
    >
      Submit
    </Button>
  </Box>
</Modal>


    </div>
  );
};

export default Devices;

