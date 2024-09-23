// import React, { useState, useEffect } from 'react';
// import { TableContainer, Paper, IconButton, Typography, TextField } from '@mui/material';
// import { RiEdit2Fill } from 'react-icons/ri';
// import { AiFillDelete } from 'react-icons/ai';
// import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

// const Category = () => {
//   const [data, setData] = useState([]); // Data from API
//   const [filteredData, setFilteredData] = useState([]); // Data after filtering
//   const [searchQuery, setSearchQuery] = useState(''); // Search input state

//   useEffect(() => {
//     // Mock API fetch or you can add your own API fetch logic
//     const fetchData = async () => {
//       // Assuming you fetch your data from an API
//       const apiData = [
//         { name: 'Car', id: 1 },
//         { name: 'Bike', id: 2 },
//         { name: 'Truck', id: 3 }
//       ];
//       setData(apiData);
//       setFilteredData(apiData);
//     };

//     fetchData();
//   }, []);

//   // Handle search query change
//   const handleSearchChange = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchQuery(value);
//     filterData(value);
//   };

//   // Filter data based on search query
//   const filterData = (query) => {
//     const lowerCaseQuery = query.toLowerCase();
//     const filtered = data.filter((item) =>
//       item.name.toLowerCase().includes(lowerCaseQuery)
//     );
//     setFilteredData(filtered);
//   };

//   return (
//     <div className="m-3">
//       <div className="d-flex justify-content-between mb-2">
//         <Typography variant="h4">Category</Typography>
//         <TextField
//           label="Search"
//           variant="outlined"
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />
//       </div>

//       <TableContainer component={Paper} style={{ maxHeight: '800px', overflowY: 'scroll' }}>
//         <CTable align="middle" className="mb-0 border" hover responsive>
//           <CTableHead className="text-nowrap">
//             <CTableRow>
//               <CTableHeaderCell className="bg-body-tertiary text-center">
//                 Name
//               </CTableHeaderCell>
//               <CTableHeaderCell className="bg-body-tertiary text-center">
//                 Actions
//               </CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredData.map((item, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell className="text-center">{item.name}</CTableDataCell>
//                 <CTableDataCell className="text-center">
//                   <IconButton aria-label="edit">
//                     <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }} />
//                   </IconButton>
//                   <IconButton aria-label="delete">
//                     <AiFillDelete style={{ fontSize: '25px', color: 'brown', margin: '5.3px' }} />
//                   </IconButton>
//                 </CTableDataCell>
//               </CTableRow>
//             ))}
//           </CTableBody>
//         </CTable>
//       </TableContainer>
//     </div>
//   );
// };

// export default Category;


// import React, { useState, useEffect } from 'react';
// import { TableContainer, Paper, IconButton, Typography } from '@mui/material';
// import { RiEdit2Fill } from 'react-icons/ri';
// import { AiFillDelete } from 'react-icons/ai';
// import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

// const Category = () => {
//   const [data, setData] = useState([]); // Data from API
//   const [filteredData, setFilteredData] = useState([]); // Data after filtering
//   const [searchQuery, setSearchQuery] = useState(''); // Search input state

//   useEffect(() => {
//     // Mock API fetch or you can add your own API fetch logic
//     const fetchData = async () => {
//       // Assuming you fetch your data from an API
//       const apiData = [
//         { name: 'Car', id: 1 },
//         { name: 'Bike', id: 2 },
//         { name: 'Truck', id: 3 }
//       ];
//       setData(apiData);
//       setFilteredData(apiData);
//     };

//     fetchData();
//   }, []);

//   // Handle search query change
//   const handleSearchChange = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchQuery(value);
//     filterData(value);
//   };

//   // Filter data based on search query
//   const filterData = (query) => {
//     const lowerCaseQuery = query.toLowerCase();
//     const filtered = data.filter((item) =>
//       item.name.toLowerCase().includes(lowerCaseQuery)
//     );
//     setFilteredData(filtered);
//   };

//   // Handle add category button click
//   const handleAddCategory = () => {
//     // Logic for opening a modal or performing an action to add a new category
//     console.log('Add Category clicked');
//   };

//   return (
//     <div className="m-3">
//       <div className="d-flex justify-content-between mb-2">
//         <Typography variant="h4">Category</Typography>

//         {/* Search Input and Add Category Button */}
//         <div className="d-flex">
//           <div className="me-3">
//             <input
//               type="search"
//               className="form-control"
//               placeholder="Search here..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>

//           {/* Add Category Button */}
//           <div>
//             <button
//               onClick={handleAddCategory}
//               className="btn btn-success text-white"
//             >
//               Add Category
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table Container */}
//       <TableContainer component={Paper} style={{ maxHeight: '800px', overflowY: 'scroll' }}>
//         <CTable align="middle" className="mb-0 border" hover responsive>
//           <CTableHead className="text-nowrap">
//             <CTableRow>
//               <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
//               <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredData.map((item, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell className="text-center">{item.name}</CTableDataCell>
//                 <CTableDataCell className="text-center">
//                   <IconButton aria-label="edit">
//                     <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }} />
//                   </IconButton>
//                   <IconButton aria-label="delete">
//                     <AiFillDelete style={{ fontSize: '25px', color: 'brown', margin: '5.3px' }} />
//                   </IconButton>
//                 </CTableDataCell>
//               </CTableRow>
//             ))}
//           </CTableBody>
//         </CTable>
//       </TableContainer>
//     </div>
//   );
// };

// export default Category;



// import React, { useState, useEffect } from 'react';
// import {
//   TableContainer, Paper, IconButton, Typography, TextField, Button, Modal, Box, FormControl
// } from '@mui/material';
// import { RiEdit2Fill } from 'react-icons/ri';
// import { AiFillDelete } from 'react-icons/ai';
// import AddIcon from '@mui/icons-material/Add';
// import CloseIcon from '@mui/icons-material/Close';
// import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

// const Category = () => {
//   const [data, setData] = useState([]); // Data from API
//   const [filteredData, setFilteredData] = useState([]); // Data after filtering
//   const [searchQuery, setSearchQuery] = useState(''); // Search input state
//   const [addModalOpen, setAddModalOpen] = useState(false); // State for modal open/close
//   const [formData, setFormData] = useState({}); // Form data state

//   // Fetch data from API (Mock or real API)
//   useEffect(() => {
//     const fetchData = async () => {
//       const apiData = [
//         { name: 'Car', id: 1 },
//         { name: 'Bike', id: 2 },
//         { name: 'Truck', id: 3 }
//       ];
//       setData(apiData);
//       setFilteredData(apiData);
//     };
//     fetchData();
//   }, []);

//   // Handle search query change
//   const handleSearchChange = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchQuery(value);
//     filterData(value);
//   };

//   // Filter data based on search query
//   const filterData = (query) => {
//     const lowerCaseQuery = query.toLowerCase();
//     const filtered = data.filter((item) =>
//       item.name.toLowerCase().includes(lowerCaseQuery)
//     );
//     setFilteredData(filtered);
//   };

//   // Handle modal open
//   const handleAddModalOpen = () => {
//     setAddModalOpen(true);
//   };

//   // Handle modal close
//   const handleAddModalClose = () => {
//     setAddModalOpen(false);
//   };

//   // Handle form input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submit
//   const handleAddSubmit = (e) => {
//     e.preventDefault();
//     // Add your submit logic here (e.g., post the data to an API)
//     console.log('Form Submitted:', formData);
//     handleAddModalClose(); // Close modal after submission
//   };

//   const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     p: 4,
//   };

//   return (
//     <div className="m-3">
//       {/* Header and Add Category button */}
//       <div className="d-flex justify-content-between mb-2">
//         <Typography variant="h4">Category</Typography>
//         <div className="d-flex">
//           <TextField
//             label="Search"
//             variant="outlined"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             style={{ marginRight: '10px' }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleAddModalOpen} // Open modal on button click
//             className="btn btn-success text-white"
//           >
//             Add Category
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <TableContainer component={Paper} style={{ maxHeight: '800px', overflowY: 'scroll' }}>
//         <CTable align="middle" className="mb-0 border" hover responsive>
//           <CTableHead className="text-nowrap">
//             <CTableRow>
//               <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
//               <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredData.map((item, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell className="text-center">{item.name}</CTableDataCell>
//                 <CTableDataCell className="text-center">
//                   <IconButton aria-label="edit">
//                     <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }} />
//                   </IconButton>
//                   <IconButton aria-label="delete">
//                     <AiFillDelete style={{ fontSize: '25px', color: 'brown', margin: '5.3px' }} />
//                   </IconButton>
//                 </CTableDataCell>
//               </CTableRow>
//             ))}
//           </CTableBody>
//         </CTable>
//       </TableContainer>

//       {/* Modal for adding new category */}
//       <Modal
//         open={addModalOpen}
//         onClose={handleAddModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <div className="d-flex justify-content-between">
//             <Typography id="modal-modal-title" variant="h6" component="h2">
//               Add New Category
//             </Typography>
//             <IconButton onClick={handleAddModalClose}>
//               <CloseIcon />
//             </IconButton>
//           </div>
//           <form onSubmit={handleAddSubmit}>
//             <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//               <TextField
//                 label="Category Name"
//                 name="name"
//                 value={formData.name || ''}
//                 onChange={handleInputChange}
//                 required
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 type="submit"
//                 style={{ marginTop: '20px' }}
//               >
//                 Submit
//               </Button>
//             </FormControl>
//           </form>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default Category;



import React, { useState, useEffect } from 'react';
import {
  TableContainer, Paper, IconButton, Typography, TextField, Button, Modal, Box, FormControl
} from '@mui/material';
import { RiEdit2Fill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

const Category = () => {
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
        { name: 'Car', id: 1 },
        { name: 'Bike', id: 2 },
        { name: 'Truck', id: 3 }
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
    <div className="m-3">
      {/* Header and Add Category button */}
      <div className="d-flex justify-content-between mb-2">
        <Typography variant="h4">Category</Typography>
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
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddModalOpen} // Open add modal on button click
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper} style={{ maxHeight: '800px', overflowY: 'scroll' }}>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
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

      {/* Modal for adding new category */}
      <Modal
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Category
            </Typography>
            <IconButton onClick={handleAddModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleAddSubmit}>
            <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField
                label="Category Name"
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

      {/* Modal for editing category */}
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Category
            </Typography>
            <IconButton onClick={handleEditModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleEditSubmit}>
            <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField
                label="Category Name"
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

export default Category;
