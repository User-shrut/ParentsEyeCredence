
import React, { useState, useEffect } from 'react';
import {
  TableContainer, Paper, IconButton, Typography, TextField, Button, Modal, Box, FormControl
} from '@mui/material';
import { RiEdit2Fill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

const Model = () => {
  const [data, setData] = useState([]); // Data from API
  const [filteredData, setFilteredData] = useState([]); // Data after filtering
  const [searchQuery, setSearchQuery] = useState(''); // Search input state
  const [addModalOpen, setAddModalOpen] = useState(false); // State for add modal open/close
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal open/close
  const [formData, setFormData] = useState({}); // Form data state
  const [currentItemId, setCurrentItemId] = useState(null); // ID of the item being edited

  // Fetch data from API (Mock or real API)
  useEffect(() => {
    const fetchData = async () => {
      const apiData = [
        { name: 'Creta', id: 1 },
        { name: 'Mahindra', id: 2 },
        { name: 'Jeep', id: 3 },
        { name: 'Tesla', id: 4 },
        { name: 'Toyota', id: 5 },
        { name: 'BMW', id: 6 },
      ];
      setData(apiData);
      setFilteredData(apiData);
    };
    fetchData();
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    filterData(value);
  };

  // Filter data based on search query
  const filterData = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered);
  };

  // Handle modal open for adding
  const handleAddModalOpen = () => {
    setAddModalOpen(true);
    setFormData({}); // Reset form data
  };

  // Handle modal close for adding
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  // Handle modal open for editing
  const handleEditModalOpen = (item) => {
    setFormData({ name: item.name });
    setCurrentItemId(item.id);
    setEditModalOpen(true);
  };

  // Handle modal close for editing
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit for adding
  const handleAddSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here (e.g., post the data to an API)
    console.log('Add Form Submitted:', formData);
    handleAddModalClose(); // Close modal after submission
  };

  // Handle form submit for editing
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here (e.g., update the data in the API)
    console.log('Edit Form Submitted for ID:', currentItemId, formData);
    handleEditModalClose(); // Close modal after submission
  };

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

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      {/* Header and Add Model button */}
      <div className="d-flex justify-content-between mb-2">
        <Typography variant="h4">Model</Typography>
        <div className="d-flex">
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginRight: '10px' }}
          />
          <Button
            variant="contained"
            className="btn btn-primary"
            onClick={handleAddModalOpen} // Open add modal on button click
          >
            Add Model
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper} style={{ maxHeight: '800px', overflowY: 'scroll' }}>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell className="text-center text-white"
                style={{ background: "rgb(1,22,51)" }}>Name</CTableHeaderCell>
              <CTableHeaderCell className="text-center text-white"
                style={{ background: "rgb(1,22,51)" }}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell className="text-center">{item.name}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <IconButton aria-label="edit" onClick={() => handleEditModalOpen(item)}>
                    <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }} />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <AiFillDelete style={{ fontSize: '25px', color: 'brown', margin: '5.3px' }} />
                  </IconButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableContainer>

      {/* Modal for adding new model */}
      <Modal
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Model
            </Typography>
            <IconButton onClick={handleAddModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleAddSubmit}>
            <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField
                label="Model Name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>

      {/* Modal for editing model */}
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Model
            </Typography>
            <IconButton onClick={handleEditModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleEditSubmit}>
            <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField
                label="Model Name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Model;
