import React, { useState } from 'react'
import { TableContainer, Paper, IconButton, Dialog, DialogContent, Typography } from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import girl1 from './Images/girl-1.jpg'
import girls3 from './Images/girls-3.jpg'
import girls5 from './Images/girls-5.jpg'
import mens1 from './Images/mens-1.jpg'
import mens2 from './Images/mens-2.jpg'
import mens4 from './Images/mens-4.jpg'
import {
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const data = [
  { id: 101, name: 'Vihaan Deshmukh', mobile: '123-456-7890', status: 'Present', image: girl1 },
  { id: 102, name: 'Dom', mobile: '123-456-7449', status: 'Present', image: mens1 },
  { id: 103, name: 'Paul', mobile: '123-456-7449', status: 'Absent', image: girls3 },
  { id: 104, name: 'Whick', mobile: '123-456-7449', status: 'Present', image: mens2 },
  { id: 105, name: 'Kavin', mobile: '123-456-7449', status: 'Absent', image: mens4 },
  { id: 106, name: 'Olive', mobile: '123-456-7449', status: 'Present', image: girls5 },
]

// Get status color based on the presence status
const getStatusColor = (status) => {
  return status === 'Present' ? 'green' : 'red'
}

const Attendance = () => {
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
      <div
        style={{
          overflowX: 'auto',
          backgroundColor: '#212631',
          borderRadius: '10px',
        }}
      >
        <TableContainer component={Paper} style={{ width: '100%' }}>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell
                  className="bg-body-tertiary text-center"
                  style={{ color: 'wheat' }}
                >
                  Image
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="bg-body-tertiary text-center"
                  style={{ color: 'wheat' }}
                >
                  ID
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="bg-body-tertiary text-center"
                  style={{ color: 'wheat' }}
                >
                  Name
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="bg-body-tertiary text-center"
                  style={{ color: 'wheat' }}
                >
                  Mobile No
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="bg-body-tertiary text-center"
                  style={{ color: 'wheat' }}
                >
                  Status
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="bg-body-tertiary text-center"
                  style={{ color: 'wheat' }}
                >
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((item, index) => (
                <CTableRow key={index}>
                  {/* Profile image */}
                  <CTableDataCell className="text-center">
                    <CAvatar
                      size="sx"
                      src={item.image}
                      onClick={() => handleImageClick(item.image)} // Image click handler added
                      style={{
                        cursor: 'pointer',
                        borderRadius: '50%',
                      }}
                    />
                  </CTableDataCell>

                  {/* ID */}
                  <CTableDataCell className="text-center" style={{ color: 'wheat' }}>
                    <div>{item.id}</div>
                  </CTableDataCell>

                  {/* Name */}
                  <CTableDataCell className="text-center" style={{ color: 'wheat' }}>
                    <div>{item.name}</div>
                  </CTableDataCell>

                  {/* Mobile Number */}
                  <CTableDataCell className="text-center" style={{ color: 'wheat' }}>
                    <div>{item.mobile}</div>
                  </CTableDataCell>

                  {/* Status with color coding */}
                  <CTableDataCell className="text-center" style={{ color: 'wheat' }}>
                    <div
                      style={{
                        backgroundColor: getStatusColor(item.status),
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        display: 'inline-block',
                      }}
                    >
                      {item.status}
                    </div>
                  </CTableDataCell>

                  {/* Action icons (edit and delete) */}
                  <CTableDataCell className="text-center">
                    <IconButton aria-label="edit">
                      <RiEdit2Fill style={{ fontSize: '25px', color: 'wheat' }} />
                    </IconButton>
                    <IconButton aria-label="delete">
                      <AiFillDelete style={{ fontSize: '25px', color: 'wheat' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </TableContainer>
      </div>

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

export default Attendance
