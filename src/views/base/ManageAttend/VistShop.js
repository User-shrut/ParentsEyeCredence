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
  Typography,
  Collapse,
  Button,
  Dialog,
  DialogContent,
  Select,
  MenuItem,
  TextField,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import { IoCalendarClearOutline } from 'react-icons/io5'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import girl1 from './Images/girl-1.jpg'
import girls3 from './Images/girls-3.jpg'
import girls5 from './Images/girls-5.jpg'
import mens1 from './Images/mens-1.jpg'
import mens2 from './Images/mens-2.jpg'
import mens4 from './Images/mens-4.jpg'

const data = [
  { id: 101, name: 'John', mobile: '123-456-7890', image: girl1, totalAssignShop: 10 },
  { id: 102, name: 'Dom', mobile: '123-456-7449', image: mens1, totalAssignShop: 11 },
  { id: 103, name: 'Paul', mobile: '123-456-7449', image: girls3, totalAssignShop: 20 },
  { id: 104, name: 'Whick', mobile: '123-456-7449', image: mens2, totalAssignShop: 51 },
  { id: 105, name: 'Kavin', mobile: '123-456-7449', image: mens4, totalAssignShop: 33 },
  { id: 106, name: 'Olive', mobile: '123-456-7449', image: girls5, totalAssignShop: 29 },
]

const VisitShop = () => {
  const [attendanceData, setAttendanceData] = useState(data)
  const [expandedRows, setExpandedRows] = useState([])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [open, setOpen] = useState(false)

  // Handle row click to expand/collapse
  const handleRowClick = (id) => {
    const isExpanded = expandedRows.includes(id)
    if (isExpanded) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id))
    } else {
      setExpandedRows([...expandedRows, id])
    }
  }

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

  const handleCalendarOpen = () => {
    setCalendarOpen(true)
  }

  const handleCalendarClose = () => {
    setCalendarOpen(false)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setCalendarOpen(false)
  }

  const handleDropdownChange = (id, value) => {
    const updatedData = attendanceData.map((item) => {
      if (item.id === id) {
        return { ...item, selectedOption: value }
      }
      return item
    })
    setAttendanceData(updatedData)

    if (value === 'Choose from Calendar') {
      handleCalendarOpen()
    }
  }

  const handleTotalAssignShopChange = (id, value) => {
    const updatedData = attendanceData.map((item) => {
      if (item.id === id) {
        return { ...item, totalAssignShop: value }
      }
      return item
    })
    setAttendanceData(updatedData)
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Visit Shop
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
                Total Shop Visit
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Option
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Progress
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', color: 'wheat' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow onClick={() => handleRowClick(item.id)}>
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
                    {item.totalAssignShop}
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      style={{ color: 'wheat', width: '150px' }}
                      value={item.selectedOption || 'Today'}
                      onChange={(e) => handleDropdownChange(item.id, e.target.value)}
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="Today">Today</MenuItem>
                      <MenuItem value="Yesterday">Yesterday</MenuItem>
                      <MenuItem value="Tomorrow">Tomorrow</MenuItem>
                      <MenuItem value="Choose from Calendar">
                        Choose from Calendar <IoCalendarClearOutline />
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: 'rgba(253, 227, 167)',
                        color: 'black',
                        marginRight: '10px',
                      }}
                    >
                      View Progress
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <div
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <IconButton aria-label="edit" style={{ marginRight: '10px' }}>
                        <RiEdit2Fill style={{ fontSize: '25px', color: 'wheat' }} />
                      </IconButton>
                      <IconButton aria-label="delete">
                        <AiFillDelete style={{ fontSize: '25px', color: 'wheat' }} />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedRows.includes(item.id)} timeout="auto" unmountOnExit>
                      <div
                        style={{
                          backgroundColor: '#2a303d',
                          padding: '10px',
                          borderRadius: '10px',
                          margin: '10px 0',
                        }}
                      >
                        <Typography variant="body2" style={{ color: 'wheat' }}>
                          {/* Additional details can be added here if needed */}
                        </Typography>
                      </div>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
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

      {/* Calendar Modal */}
      <Dialog open={calendarOpen} onClose={handleCalendarClose}>
        <DialogContent>
          <DatePicker
            label="Choose Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VisitShop
