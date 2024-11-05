import React, { useState, useEffect } from 'react';
// import {
//   TableContainer, Paper, IconButton, Typography, TextField, Button, Modal, Box, FormControl
// } from '@mui/material';
import { RiEdit2Fill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Cookies from 'js-cookie';  // Importing js-cookie for managing cookies
// import {
//   CTable,
//   CTableBody,
//   CTableRow,
//   CTableHead,
//   CTableHeaderCell,
//   CTableDataCell,
//   CTableContainer
// } from '@coreui/react';
// import {
//   TableContainer as MuiTableContainer, // Renaming to avoid confusion
//   Paper,
//   IconButton,
//   Typography,
//   TextField,
//   Button,
//   Modal,
//   Box,
//   FormControl,
// } from '@mui/material';
import {
  TableContainer, Paper, IconButton, Typography, TextField, Button, Modal, Box, FormControl
} from '@mui/material';
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import Loader from '../../../components/Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { IoMdAdd } from 'react-icons/io';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import CIcon from '@coreui/icons-react';
import { cilSettings } from '@coreui/icons';

const Model = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentItemId, setCurrentItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   fetchData();
  // }, []);

  const token = Cookies.get('authToken'); //


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  // #### GET ####

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/model?search=${searchQuery}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data.models);  // Set to response.data.models
      setFilteredData(response.data.models); // Set to response.data.models
      console.log("Fetched Data: ", response.data.models); // Log the fetched data
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
      setFilteredData([]); // Ensure it's set to an array on error
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // ##################### Filter data by search query #######################
  const filterModels = () => {
    if (!searchQuery) {
      setFilteredData(data); // No query, show all drivers
    } else {
      const filtered = data.filter(
        (model) =>
          model.modelName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  useEffect(() => {
    filterModels(searchQuery);
  }, [data, searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    filterData(value);
  };

  const filterData = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = data.filter(item => item.modelName.toLowerCase().includes(lowerCaseQuery));
    setFilteredData(filtered);
  };


  const handleAddModalOpen = () => {
    setAddModalOpen(true);
    setFormData({});
  };

  const handleAddModalClose = () => setAddModalOpen(false);

  const handleEditModalOpen = (item) => {
    setFormData({ modelName: item.modelName });
    setCurrentItemId(item._id);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => setEditModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //  #### POST #####

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/model`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setData((prevData) => [...prevData, response.data]);
      setFilteredData((prevFilteredData) => [...prevFilteredData, response.data]);
      handleAddModalClose();
      fetchData(); // Optional: Fetch fresh data

      toast.success('Successfully Added Model!'); // Show success alert
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error("This didn't work."); // Show error alert
    }
  };


  // #### PUT EDIT ####

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentItemId) return;

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/model/${currentItemId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      setData(prevData => prevData.map(item => item._id === currentItemId ? response.data : item));
      setFilteredData(prevFilteredData => prevFilteredData.map(item => item._id === currentItemId ? response.data : item));
      handleEditModalClose();
      fetchData(); // Optional: Fetch fresh data
      toast.success('Successfully Edited Model!'); // Show success alert

    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("This didn't work."); // Show error alert
    }
  };

  // ### DELETE ####

  const handleDeleteSelected = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/model/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
        setFilteredData(filteredData.filter((item) => item._id !== id));
        toast.error('Record deleted successfully');
      } catch (error) {
        console.error('Error deleting record:', error);
        toast.error('Failed to delete the record');
      }
    }
  };
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Define the table columns based on the CTable structure
    const tableColumn = ['SN', 'Model Name'];

    // Map through the filteredData (assuming it contains the data to be exported)
    const tableRows = filteredData.map((item, rowIndex) => {
      // Extract relevant data for each column
      const rowData = [
        rowIndex + 1,                      // Serial Number
        item.modelName || '--',            // Model Name
        // 'Edit/Delete'                       // Placeholder for Actions
      ];

      return rowData;
    });

    // Use autoTable to create the PDF table
    doc.autoTable(tableColumn, tableRows, { startY: 20 });

    // Save the PDF document
    doc.save('model_data.pdf');
  };

  const exportToExcel = () => {
    // Prepare the data for Excel
    const tableData = filteredData.map((item, index) => ({
      SN: index + 1,
      'Model Name': item.modelName || '--',
      // 'Actions': 'Edit/Delete' // Placeholder for actions
    }));

    // Create a new workbook and a worksheet
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Models');

    // Define the file name
    const fileName = 'model_data.xlsx';

    // Write the workbook to a file
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header and Add Category button */}
      <div className="d-flex justify-content-between mb-2">
        <Typography variant="h4">Model</Typography>
        <div className="d-flex  justify-content-center align-items-center">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="search here...."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <button
            onClick={handleAddModalOpen} // Open add modal on button click
            variant="contained"
            className="btn btn-primary"
          >
            Add Model
          </button>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper} style={{ maxHeight: '800px', overflowY: 'scroll' }}>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
            <CTableHeaderCell className=" text-center text-white bg-secondary">SN</CTableHeaderCell>
              <CTableHeaderCell className=" text-center text-white bg-secondary">Model Name</CTableHeaderCell>
              <CTableHeaderCell className=" text-center text-white bg-secondary">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="15" className="text-center">
                  <div className="text-nowrap mb-2 text-center w-">
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-12" />
                    </p>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-12" />
                    </p>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-12" />
                    </p>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-12" />
                    </p>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ) : (filteredData.length > 0 ? (
              filteredData.map((item , index) => (
                <CTableRow key={item._id}>
                  <CTableDataCell className="text-center">{ index+1}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.modelName}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    {/* Row layout for the icons */}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                      <IconButton aria-label="edit" onClick={() => handleEditModalOpen(item)}>
                        <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue' }} />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteSelected(item._id)}
                        sx={{ color: 'red' }}
                      >
                        <AiFillDelete style={{ fontSize: '25px' }} />
                      </IconButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="2" className="text-center">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: '200px' }}
                  >
                    <p className="mb-0 fw-bold">
                      "Oops! Looks like there's No Model available.
                      <br /> Maybe it's time to create new Model!"
                    </p>
                    <div>
                      <button
                        onClick={() => setAddModalOpen(true)}
                        variant="contained"
                        className="btn btn-primary m-3 text-white"
                      >
                        <span>
                          <IoMdAdd className="fs-5" />
                        </span>{' '}
                        Add Model
                      </button>
                    </div>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableContainer>
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

      {/* Add Modal */}
      <Modal open={addModalOpen} onClose={handleAddModalClose}>
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography variant="h6">Add New Model</Typography>
            <IconButton onClick={handleAddModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleAddSubmit}>
            <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField
                name="modelName"
                value={formData.modelName || ''}
                onChange={handleInputChange}
                label="Model Name"
                required
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Add
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography variant="h6">Edit Model</Typography>
            <IconButton onClick={handleEditModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleEditSubmit}>
            <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField
                name="modelName"
                value={formData.modelName || ''}
                onChange={handleInputChange}
                label="Model Name"
                required
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Update
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Model;