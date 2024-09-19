import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import girl1 from './Images/girl-1.jpg'
import girls3 from './Images/girls-3.jpg'
import girls5 from './Images/girls-5.jpg'
import mens1 from './Images/mens-1.jpg'
import mens2 from './Images/mens-2.jpg'
import mens4 from './Images/mens-4.jpg'

// Updated data with task details
const data = [
  {
    id: 101,
    name: 'John',
    mobile: '123-456-7890',
    taskName: 'Task A',
    location: 'New York',
    completionDate: '2023-09-01',
    deadline: '2023-09-10',
    lastStatus: 'Complete',
    image: girl1,
  },
  {
    id: 102,
    name: 'Dom',
    mobile: '123-456-7449',
    taskName: 'Task B',
    location: 'London',
    completionDate: '2023-08-28',
    deadline: '2023-09-05',
    lastStatus: 'In Process',
    image: mens1,
  },
  {
    id: 103,
    name: 'Paul',
    mobile: '123-456-7449',
    taskName: 'Task C',
    location: 'Paris',
    completionDate: '2023-09-05',
    deadline: '2023-09-12',
    lastStatus: 'Pending',
    image: girls3,
  },
  {
    id: 104,
    name: 'Whick',
    mobile: '123-456-7449',
    taskName: 'Task D',
    location: 'Berlin',
    completionDate: '2023-09-03',
    deadline: '2023-09-15',
    lastStatus: 'Complete',
    image: mens2,
  },
  {
    id: 105,
    name: 'Kavin',
    mobile: '123-456-7449',
    taskName: 'Task E',
    location: 'Madrid',
    completionDate: '2023-09-07',
    deadline: '2023-09-14',
    lastStatus: 'In Process',
    image: mens4,
  },
  {
    id: 106,
    name: 'Olive',
    mobile: '123-456-7449',
    taskName: 'Task F',
    location: 'Tokyo',
    completionDate: '2023-09-08',
    deadline: '2023-09-16',
    lastStatus: 'Pending',
    image: girls5,
  },
]

const TaskManagment = () => {
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Function to handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image)
    setOpen(true)
  }

  // Function to close the modal
  const handleClose = () => {
    setOpen(false)
    setSelectedImage(null)
  }

  // Helper function to determine the background color based on the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'green'
      case 'In Process':
        return '#fc9c39'
      case 'Pending':
        return '#ff1a1a'
      default:
        return 'gray'
    }
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Task Management Table
      </Typography>
      <TableContainer
        component={Paper}
        style={{ backgroundColor: '#212631', borderRadius: '10px' }}
      >
        <Table>
          <TableHead style={{ backgroundColor: '#2a303d' }}>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Image
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                ID
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Mobile No
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Task Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Location
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Completion Date
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Deadline
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Last Status
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleImageClick(item.image)}
                  />
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.id}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.name}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.mobile}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.taskName}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.location}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.completionDate}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.deadline}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    style={{
                      backgroundColor: getStatusColor(item.lastStatus),
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {item.lastStatus}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <IconButton aria-label="edit">
                      <RiEdit2Fill style={{ fontSize: '25px', color: 'wheat' }} />
                    </IconButton>
                    <IconButton aria-label="delete">
                      <AiFillDelete style={{ fontSize: '25px', color: 'wheat' }} />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for zoomed image */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            overflow: 'hidden',
            borderRadius: '50%',
            maxWidth: 'none',
          },
        }}
      >
        <DialogContent style={{ padding: 0 }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Zoomed"
              style={{
                width: '500px',
                height: '500px',
                borderRadius: '50%',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskManagment
