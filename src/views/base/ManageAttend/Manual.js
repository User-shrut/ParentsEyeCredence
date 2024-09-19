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

const data = [
  {
    id: 101,
    name: 'John',
    mobile: '9045116165',
    status: 'Present',
    statu: 'Absent',
    image: girl1,
  },
  {
    id: 102,
    name: 'Dom',
    mobile: '90451161554',
    status: 'Present',
    statu: 'Absent',
    image: mens1,
  },
  {
    id: 103,
    name: 'Paul',
    mobile: '9045886165',
    status: 'Present',
    statu: 'Absent',
    image: girls3,
  },
  {
    id: 104,
    name: 'Whick',
    mobile: '9045116165',
    status: 'Present',
    statu: 'Absent',
    image: mens2,
  },
  {
    id: 105,
    name: 'Kavin',
    mobile: '909996165',
    status: 'Present',
    statu: 'Absent',
    image: mens4,
  },
  {
    id: 106,
    name: 'Olive',
    mobile: '9088116165',
    status: 'Present',
    statu: 'Absent',
    image: girls5,
  },
]

// Function to get status color
const getStatusColor = (status) => {
  return status === 'Present' ? 'green' : 'red'
}

const Manual = () => {
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

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Attendance Table
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
                Status
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
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Typography
                      style={{
                        backgroundColor: getStatusColor(item.status),
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        display: 'inline-block',
                      }}
                    >
                      {item.status}
                    </Typography>
                    <Typography
                      style={{
                        backgroundColor: getStatusColor(item.statu),
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        display: 'inline-block',
                      }}
                    >
                      {item.statu}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <IconButton aria-label="edit">
                    <RiEdit2Fill style={{ fontSize: '25px', color: 'wheat' }} />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <AiFillDelete style={{ fontSize: '25px', color: 'wheat' }} />
                  </IconButton>
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

export default Manual
