import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Paper,
  IconButton,
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
import { RiEdit2Fill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import Loader from "../../components/Loader/Loader";
import { useNavigate } from 'react-router-dom';
import Gmap from '../Googlemap/Gmap'; // Import your Gmap component

const Geofences = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [placetype, setPlacetype] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2; // Number of rows per page
  const navigate = useNavigate();

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Placetype', accessor: 'placetypeId' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Assign', accessor: 'assign', },
    { Header: 'Area', accessor: 'area' },
    { Header: 'Geofencecode', accessor: 'geofencecode' },
    {
      Header: 'Attributes',
      accessor: 'attributes',
      Cell: ({ value }) => {
        return value && Object.keys(value).length > 0
          ? Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(', ')
          : 'N/A';
      },
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={() => handleEdit(row)}>
            <RiEdit2Fill />
          </IconButton>
          <IconButton onClick={() => handleDeleteSelected(row.id)}>
            <AiFillDelete />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
    fetchPlacetype();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const username = 'school';
      const password = '123456';
      const token = btoa(`${username}:${password}`);
      const response = await axios.get('https://rocketsalestracker.com/api/geofences', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      const wrappedData = Array.isArray(response.data) ? response.data : [];
      setFilteredRows(wrappedData);
      setData(wrappedData);
    } catch (error) {
      console.error('Fetch data error:', error);
      alert('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacetype = async () => {
    try {
      const username = 'school';
      const password = '123456';
      const token = btoa(`${username}:${password}`);
      const response = await axios.get('https://rocketsalestracker.com/api/placetype', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      setPlacetype(response.data);
    } catch (error) {
      console.error('Fetch placetype error:', error);
      alert('An error occurred while fetching placetype.');
    }
  };

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredRows(
      data.filter((item) =>
        columns.some((column) =>
          item[column.accessor]?.toString().toLowerCase().includes(lowerCaseQuery)
        )
      )
    );
  }, [data, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = 'https://rocketsalestracker.com/api/geofences';
      const username = 'school';
      const password = '123456';
      const token = btoa(`${username}:${password}`);
      const newRow = {
        id: formData.id,
        name: formData.name,
        placetypeId: formData.placetypeId,
        assign: formData.assign,
        geofencecode: formData.geofencecode,
        area: formData.area,
        attributes: formData.attributes || {},
      };
      if (isEditing) {
        const response = await axios.put(`${apiUrl}/${formData.id}`, newRow, {
          headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          const updatedData = data.map((item) => (item.id === formData.id ? response.data : item));
          setData(updatedData);
          setFilteredRows(updatedData);
          setIsEditing(false);
          alert('Record updated successfully');
        } else {
          alert(`Unable to update record: ${response.statusText}`);
        }
      } else {
        const response = await axios.post(apiUrl, newRow, {
          headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 201) {
          const updatedData = [...data, response.data];
          setData(updatedData);
          setFilteredRows(updatedData);
          alert('Record created successfully');
        } else {
          alert(`Unable to create record: ${response.statusText}`);
        }
      }
      setAddModalOpen(false);
    } catch (error) {
      console.error('Error adding/updating record:', error);
      alert('Unable to create/update record');
    }
  };

  const handleDeleteSelected = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const username = 'school';
        const password = '123456';
        const token = btoa(`${username}:${password}`);
        const response = await axios.delete(`https://rocketsalestracker.com/api/geofences/${id}`, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
        if (response.status === 204) {
          const updatedData = filteredRows.filter((item) => item.id !== id);
          setFilteredRows(updatedData);
          setData(updatedData);
          alert('Record deleted successfully');
        } else {
          alert('Unable to delete record');
        }
      } catch (error) {
        alert('Unable to delete record.');
      }
    }
  };

  const handleEdit = (row) => {
    setFormData({
      id: row.id,
      placetypeId: row.placetypeId,
      name: row.name,
      assign: row.assign,
      geofencecode: row.geofencecode,
      area: row.area,
      attributes: row.attributes || {},
    });
    setIsEditing(true);
    setAddModalOpen(true);
  };

  const navigateToMap = (row) => {
    // Set the geofence data to be displayed on the map
    setFormData(row);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '10px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '10px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Geofences
          </Typography>
          <div style={{ display: 'flex', gap: '10px' }}>
            <InputBase
              placeholder="Search Geofences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                marginRight: '5px',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                padding: '5px 10px',
                border: '0.5px solid grey',
                marginTop: '5px',
              }}
            />
            <Button variant="contained" color="success" onClick={() => setAddModalOpen(true)}>
              Add Geofence
            </Button>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <TableContainer component={Paper}>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    {columns.map((column) => (
                      <CTableHeaderCell key={column.accessor}>{column.Header}</CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedRows.map((row) => (
                    <CTableRow key={row.id}>
                      {columns.map((column) => (
                        <CTableDataCell key={column.accessor}>
                          {column.Cell ? column.Cell({ row, value: row[column.accessor] }) : row[column.accessor]}
                        </CTableDataCell>
                      ))}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </TableContainer>

            {/* PAGE SET */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
              <Button
                variant="contained"
                color="primary"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <Typography variant="body1" style={{ margin: '0 15px' }}>
                Page {currentPage}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={currentPage * rowsPerPage >= filteredRows.length}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Google Map */}
      <div style={{ flex: 1, paddingTop: '70px' }}>
        <Gmap data={formData} /> {/* Pass geofence data to your Gmap component */}
      </div>

      {/* Modal for Add/Edit Form */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleAddSubmit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isEditing ? 'Edit Geofence' : 'Add Geofence'}
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal" >
            <InputLabel>Placetype</InputLabel>
            <Select
              name="placetypeId"
              value={formData.placetypeId || ''}
              onChange={handleInputChange}
              fullWidth
            >
              {placetype.map((place) => (
                <MenuItem key={place.id} value={place.id}>
                  {place.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Assign"
            name="assign"
            value={formData.assign || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Geofencecode"
            name="geofencecode"
            value={formData.geofencecode || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Area"
            name="area"
            value={formData.area || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Attributes (JSON format)"
            name="attributes"
            value={formData.attributes || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Geofences;
