import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch } from '@mui/material'
import { toggleColumn } from '../features/columnVisibilitySlice'
import '../components/AppHeader.css'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: '80vh !important',
  overflowY: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const TableColumnVisibility = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  // Retrieve the current visibility state from the Redux store
  const visibleColumns = useSelector((state) => state.columnVisibility)

  // Local state to manage toggles
  const [localColumns, setLocalColumns] = useState(visibleColumns)

  // Function to toggle column visibility locally
  const handleToggleColumn = (col) => {
    setLocalColumns((prev) => ({ ...prev, [col]: !prev[col] }))
  }

  // Function to save the visibility settings
  const handleSave = () => {
    // Dispatch the toggle action for each column based on the local state
    Object.entries(localColumns).forEach(([col, isVisible]) => {
      dispatch(toggleColumn({ column: col, isVisible }))
    })
    handleClose() // Close the modal after saving
  }

  // Function to handle opening the modal and resetting the local state
  const handleReset = () => {
    setLocalColumns(visibleColumns) // Reset to the current visibility from the store
    handleOpen() // Open the modal
  }

  return (
    <div>
      <Button className='filter-btn' onClick={handleReset}>Filter Columns</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="column-selector-title"
        aria-describedby="column-selector-description"
      >
        <Box sx={style}>
          <div className="toggle-container">
            <div className="toggle-name">Sr No.</div>
            <Switch checked={localColumns.srNo} onChange={() => handleToggleColumn('srNo')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Vehicle</div>
            <Switch checked={localColumns.vehicle} onChange={() => handleToggleColumn('vehicle')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Device Name</div>
            <Switch
              checked={localColumns.deviceName}
              onChange={() => handleToggleColumn('deviceName')}
            />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Address</div>
            <Switch checked={localColumns.address} onChange={() => handleToggleColumn('address')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Last Update</div>
            <Switch
              checked={localColumns.lastUpdate}
              onChange={() => handleToggleColumn('lastUpdate')}
            />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">C/D</div>
            <Switch checked={localColumns.cd} onChange={() => handleToggleColumn('cd')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Speed</div>
            <Switch checked={localColumns.sp} onChange={() => handleToggleColumn('sp')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Distance</div>
            <Switch
              checked={localColumns.distance}
              onChange={() => handleToggleColumn('distance')}
            />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Total Distance</div>
            <Switch checked={localColumns.td} onChange={() => handleToggleColumn('td')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Sat</div>
            <Switch checked={localColumns.sat} onChange={() => handleToggleColumn('sat')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Ignition</div>
            <Switch checked={localColumns.ig} onChange={() => handleToggleColumn('ig')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">GPS</div>
            <Switch checked={localColumns.gps} onChange={() => handleToggleColumn('gps')} />
          </div>
          <div className="toggle-container">
            <div className="toggle-name">Power</div>
            <Switch checked={localColumns.power} onChange={() => handleToggleColumn('power')} />
          </div>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default TableColumnVisibility
