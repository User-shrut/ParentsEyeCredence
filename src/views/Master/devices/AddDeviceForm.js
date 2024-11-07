import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import { AiOutlinePlus } from 'react-icons/ai'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const AddDeviceModal = ({
  open,
  handleClose,
  style,
  token,
  fetchData,
  currentStep,
  steps,
  columns,
  formData,
  users,
  groups,
  drivers,
  areas,
  models,
  categories,
  handleInputChange,
  handleNext,
  handleBack,
  handleYearSelection,
  setShowExpirationDropdown,
}) => {
  const handleAddSubmit = async () => {
    const oldapiUrl = `http://63.142.251.13:8082/api/devices`
    const apiUrl = `${import.meta.env.VITE_API_URL}/device`

    const oldRow = {
      name: formData.name || '',
      uniqueId: formData.uniqueId ? formData.uniqueId.trim() : '',
      phone: formData.sim || '',
      model: formData.model || '',
      category: formData.category || '',
    }

    const newRow = {
      name: formData.name || '',
      uniqueId: formData.uniqueId ? formData.uniqueId.trim() : '',
      sim: formData.sim || '',
      groups: Array.isArray(formData.groups) ? formData.groups : [],
      users: Array.isArray(formData.users) ? formData.users : [],
      Driver: formData.Driver || '',
      speed: formData.speed || '',
      average: formData.average || '',
      geofences: Array.isArray(formData.geofences) ? formData.geofences : [],
      model: formData.model || '',
      category: formData.category || '',
      installationdate: formData.installationdate || '',
      expirationdate: formData.expirationdate || '',
      extenddate: formData.extenddate || '',
    }

    if (!newRow.name || !newRow.uniqueId || !newRow.sim) {
      toast.error('Please fill in all required fields.')
      return
    }

    try {
      const username = 'hbtrack'
      const password = '123456@'
      const token1 = btoa(`${username}:${password}`)
      const oldresponse = await axios.post(oldapiUrl, oldRow, {
        headers: {
          Authorization: `Basic ${token1}`,
          'Content-Type': 'application/json',
        },
      })

      const response = await axios.post(apiUrl, newRow, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Raw response:', response)

      if (oldresponse.status === 200 && response.status === 201) {
        console.log('Record created successfully:')
        toast.success('Record created successfully')
        handleClose()
        fetchData();
      } else {
        const contentType = response.headers.get('content-type')
        let responseBody

        if (contentType && contentType.includes('application/json')) {
          responseBody = await response.json()
        } else {
          responseBody = await response.text()
        }

        console.error('Error Response:', responseBody)
        toast.error(`Unable to create record: ${responseBody.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error during POST request:', error)
      toast.error('Unable to create record')
    }
  }

  return (
    <>
      <Toaster />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            ...style,
            backgroundColor: '#f7f9fc',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '30px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', fontSize: '24px' }}>
              <span role="img" aria-label="device">
                <AiOutlinePlus className="fs-2" />
              </span>{' '}
              Add Device
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* Step-by-step form with progress indicator */}
          <div>
            <Stepper activeStep={currentStep} className="mb-4" alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step 1: General Information */}
            {currentStep === 0 &&
              columns.map((col) => {
                if (
                  col.accessor === 'name' ||
                  col.accessor === 'uniqueId' ||
                  col.accessor === 'sim' ||
                  col.accessor === 'speed' ||
                  col.accessor === 'average'
                ) {
                  return (
                    <TextField
                      key={col.accessor}
                      label={col.Header}
                      variant="outlined"
                      name={col.accessor}
                      value={formData[col.accessor] || ''}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 2 }}
                    />
                  )
                }
                return null
              })}

            {/* Step 2: Assign to users, groups, geofences, etc */}
            {currentStep === 1 &&
              columns.map((col) => {
                if (col.accessor === 'users') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <InputLabel>{col.Header}</InputLabel>
                      <Select
                        name={col.accessor}
                        value={formData[col.accessor] || []}
                        onChange={handleInputChange}
                        label={col.Header}
                        multiple
                      >
                        {users.map((user) => (
                          <MenuItem key={user._id} value={user._id}>
                            {user.username}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                } else if (col.accessor === 'groups') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <InputLabel>{col.Header}</InputLabel>
                      <Select
                        name={col.accessor}
                        value={formData[col.accessor] || []}
                        onChange={handleInputChange}
                        label={col.Header}
                        multiple
                      >
                        {groups.map((group) => (
                          <MenuItem key={group._id} value={group._id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                } else if (col.accessor === 'Driver') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <InputLabel>{col.Header}</InputLabel>
                      <Select
                        name={col.accessor}
                        value={formData[col.accessor] || []}
                        onChange={handleInputChange}
                        label={col.Header}
                      >
                        <MenuItem value="">select driver...</MenuItem>
                        {drivers.map((driver) => (
                          <MenuItem key={driver._id} value={driver._id}>
                            {driver.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                } else if (col.accessor === 'geofences') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <InputLabel>{col.Header}</InputLabel>
                      <Select
                        name={col.accessor}
                        value={formData[col.accessor] || []}
                        onChange={handleInputChange}
                        label={col.Header}
                        multiple
                      >
                        {areas.map((geofence) => (
                          <MenuItem key={geofence._id} value={geofence._id}>
                            {geofence.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                } else if (col.accessor === 'model') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <InputLabel>{col.Header}</InputLabel>
                      <Select
                        name={col.accessor}
                        value={formData[col.accessor] || []}
                        onChange={handleInputChange}
                        label={col.Header}
                      >
                        {models.map((model) => (
                          <MenuItem key={model.modelName} value={model.modelName}>
                            {model.modelName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                } else if (col.accessor === 'category') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <InputLabel>{col.Header}</InputLabel>
                      <Select
                        name={col.accessor}
                        value={formData[col.accessor] || []}
                        onChange={handleInputChange}
                        label={col.Header}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.categoryName} value={category.categoryName}>
                            {category.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                }
                return null
              })}

            {/* Step 3: Installation and expiration dates */}
            {currentStep === 2 &&
              columns.map((col) => {
                if (col.accessor === 'installationdate') {
                  return (
                    <>
                      <label>Installation date: </label>
                      <TextField
                        key={col.accessor}
                        type="date"
                        name={col.accessor}
                        value={formData[col.accessor] || ''}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </>
                  )
                } else if (col.accessor === 'expirationdate') {
                  return (
                    <FormControl fullWidth sx={{ marginY: 2 }} key={col.accessor}>
                      <InputLabel>Expiration Plans</InputLabel>
                      <Select
                        onChange={(e) => {
                          handleYearSelection(parseInt(e.target.value))
                          setShowExpirationDropdown(false)
                        }}
                        label="Expiration Options"
                      >
                        <MenuItem value={1}>1 Year</MenuItem>
                        <MenuItem value={2}>2 Years</MenuItem>
                        <MenuItem value={3}>3 Years</MenuItem>
                      </Select>
                    </FormControl>
                  )
                }
                return null
              })}

            {/* Navigation buttons */}
            <div className="d-flex justify-content-between" style={{ marginTop: '20px' }}>
              {currentStep > 0 && (
                <Button onClick={handleBack} variant="outlined">
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} variant="contained" color="primary">
                  Next
                </Button>
              ) : (
                <Button onClick={handleAddSubmit} variant="contained" color="primary">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default AddDeviceModal
