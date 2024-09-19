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

// Importing images from the Images folder for the profile pictures
import girl1 from './Images/girl-1.jpg'
import girls3 from './Images/girls-3.jpg'
import girls5 from './Images/girls-5.jpg'
import mens1 from './Images/mens-1.jpg'
import mens2 from './Images/mens-2.jpg'
import mens4 from './Images/mens-4.jpg'

// Importing images from the Bills folder for the uploaded bills
import bill1 from './Bills/bill-1.jpg'
import bill2 from './Bills/bill-2.jpg'
import bill3 from './Bills/bill-3.jpg'
import bill4 from './Bills/bill-4.png'
import bill5 from './Bills/bill-5.jpg'
import bill6 from './Bills/bill-6.jpg'

// Updated data with profile and bill details
const data = [
  {
    id: 101,
    name: 'John',
    image: girl1, // Profile image from Images folder
    mobile: '123-456-7890',
    expensesType: 'Travel',
    expensesDescription: 'Flight to New York',
    amount: '$400',
    date: '2023-09-01',
    uploadBill: bill1, // Bill image from Bills folder
  },
  {
    id: 102,
    name: 'Dom',
    image: mens1,
    mobile: '123-456-7449',
    expensesType: 'Accommodation',
    expensesDescription: 'Hotel stay in London',
    amount: '$200',
    date: '2023-08-28',
    uploadBill: bill2,
  },
  {
    id: 103,
    name: 'Paul',
    image: girls3,
    mobile: '123-456-7449',
    expensesType: 'Meals',
    expensesDescription: 'Business lunch in Paris',
    amount: '$50',
    date: '2023-09-05',
    uploadBill: bill3,
  },
  {
    id: 104,
    name: 'Whick',
    image: mens2,
    mobile: '123-456-7449',
    expensesType: 'Travel',
    expensesDescription: 'Train ticket to Berlin',
    amount: '$120',
    date: '2023-09-03',
    uploadBill: bill4,
  },
  {
    id: 105,
    name: 'Kavin',
    image: mens4,
    mobile: '123-456-7449',
    expensesType: 'Supplies',
    expensesDescription: 'Office supplies in Madrid',
    amount: '$75',
    date: '2023-09-07',
    uploadBill: bill5,
  },
  {
    id: 106,
    name: 'Olive',
    image: girls5,
    mobile: '123-456-7449',
    expensesType: 'Entertainment',
    expensesDescription: 'Client dinner in Tokyo',
    amount: '$150',
    date: '2023-09-08',
    uploadBill: bill6,
  },
]

const ExpenseDetails = () => {
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
        Expense Management Table
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
                Expenses Type
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Expenses Description
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Amount
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Date
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Upload Bill
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
                    src={item.image} // Display profile image from Images folder
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
                  {item.expensesType}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.expensesDescription}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.amount}
                </TableCell>
                <TableCell align="center" style={{ color: 'wheat' }}>
                  {item.date}
                </TableCell>
                <TableCell align="center">
                  <img
                    src={item.uploadBill} // Display bill image from Bills folder
                    alt="Bill"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '100%',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleImageClick(item.uploadBill)}
                  />
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

export default ExpenseDetails
