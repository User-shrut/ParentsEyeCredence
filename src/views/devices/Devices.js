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
// import "./table.css";
// import { FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
const getStatusColor = (status) => (status === 'online' ? 'green' : 'red');

const Devices = () => {
  const [open, setOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false); 
  const [editModalOpen, setEditModalOpen] = useState(false);// Modal for adding a new row
  const [formData, setFormData] = useState({}); // Form data state
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [filteredRows, setFilteredRows] = useState([]);
  // const handleModalClose = () => setAddModalOpen(false);
  const [filteredData, setFilteredData] = useState([]); // Your initial data
  const [selectedRow, setSelectedRow] = useState(null);
  const handleModalClose = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    // setFormData({});
  };
  // const [editModalOpen, setEditModalOpen] = useState(false);
// const [formData, setFormData] = useState({});
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


  
  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const username = 'hbtrack';
      const password = '123456@';
      const token = btoa(`${username}:${password}`);

      const response = await axios.get('http://104.251.212.84/api/devices', {
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
    fetchData();
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
// const handleEditSubmit = () => {
//   // setEditModalOpen(true);
// };


const handleEditIconClick = (row) => {
  setSelectedRow(row); // Set the selected row to be edited
  setFormData(row); // Populate form with the row's data
  setEditModalOpen(true); // Open the modal
};

const handleEditSubmit = async () => {
  if (!selectedRow) {
    alert("No row selected for editing");
    return;
  }

  const apiUrl = `https://rocketsalestracker.com/api/devices/${selectedRow.id}`;
  const username = "school";
  const password = "123456";
  const token = btoa(`${username}:${password}`);

  // Exclude the 'isSelected' field from formData
  const { isSelected, ...updatedData } = formData;

  try {
    console.log("Sending request to:", apiUrl);
    console.log("Request payload:", JSON.stringify(updatedData, null, 2));

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Basic ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorResult = await response.json();
      console.error("Error response:", errorResult);
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResult.message}`);
    }

    const result = await response.json();
    console.log("Update successful:", result);
    alert("Updated successfully");

    // Update the local state with the modified row data
    const updatedRows = filteredRows.map((row) =>
      row.id === selectedRow.id ? { ...row, ...updatedData } : row
    );
    setFilteredRows(updatedRows);

    handleModalClose();
    fetchData(); // Refetch the data to ensure the UI is up-to-date
  } catch (error) {
    console.error("Error updating row:", error.message, error.stack);
    alert("Error updating data");
  }
  handleModalClose();
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

      

 
    <TableContainer 
  component={Paper}  
  sx={{ 
    height: '500px', // Set the desired height
    overflow: 'auto', // Enable scrollbar when content overflows
  }}
>
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
              <IconButton aria-label="edit" onClick={() => handleEditIconClick(item)}>
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
<Modal open={editModalOpen} onClose={handleModalClose}>
  <Box sx={style}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <Typography variant="h6">Edit Row</Typography>
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

    {/* Category dropdown */}
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel>Category</InputLabel>
      <Select
        name="category"
        value={formData.category || ''}
        onChange={handleInputChange}
        label="Category"
      >
        <MenuItem value="Default">Default</MenuItem>
        <MenuItem value="Animal">Animal</MenuItem>
        <MenuItem value="Bicycle">Bicycle</MenuItem>
      </Select>
    </FormControl>

    {/* Other fields */}
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
      onClick={handleEditSubmit}
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