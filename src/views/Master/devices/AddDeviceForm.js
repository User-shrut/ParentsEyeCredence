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
  Autocomplete,
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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0'); // Day of the month
    const hours = String(now.getHours()).padStart(2, '0'); // Hours
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Format: YYYY/MM/DD HH:MM:SS
  };
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
        fetchData()
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
                      <Autocomplete
                        multiple
                        disableCloseOnSelect
                        id={`autocomplete-${col.accessor}`}
                        options={users}
                        getOptionLabel={(option) => option.username || ''}
                        value={
                          users.filter((user) => formData[col.accessor]?.includes(user._id)) || []
                        }
                        onChange={(event, newValue) => {
                          handleInputChange({
                            target: {
                              name: col.accessor,
                              value: newValue.map((user) => user._id),
                            },
                          })
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={col.Header}
                            placeholder="Search users..."
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                      />
                    </FormControl>
                  )
                } else if (col.accessor === 'groups') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <Autocomplete
                        disableCloseOnSelect
                        multiple
                        id={`autocomplete-${col.accessor}`}
                        options={groups}
                        getOptionLabel={(option) => option.name || ''}
                        value={
                          groups.filter((group) => formData[col.accessor]?.includes(group._id)) ||
                          []
                        }
                        onChange={(event, newValue) => {
                          handleInputChange({
                            target: {
                              name: col.accessor,
                              value: newValue.map((group) => group._id),
                            },
                          })
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={col.Header}
                            placeholder="Search group..."
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                      />
                    </FormControl>
                  )
                } else if (col.accessor === 'Driver') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <Autocomplete
                        id={`autocomplete-${col.accessor}`}
                        options={drivers}
                        getOptionLabel={(option) => option.name || ''}
                        value={
                          drivers.find((driver) => driver._id === formData[col.accessor]) || null
                        }
                        onChange={(event, newValue) => {
                          handleInputChange({
                            target: {
                              name: col.accessor,
                              value: newValue ? newValue._id : '',
                            },
                          })
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={col.Header}
                            placeholder="Search driver..."
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  )
                } else if (col.accessor === 'geofences') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <Autocomplete
                        multiple
                        disableCloseOnSelect
                        id={`autocomplete-${col.accessor}`}
                        options={areas}
                        getOptionLabel={(option) => option.name || ''}
                        value={
                          areas.filter((area) => formData[col.accessor]?.includes(area._id)) || []
                        }
                        onChange={(event, newValue) => {
                          handleInputChange({
                            target: {
                              name: col.accessor,
                              value: newValue.map((area) => area._id),
                            },
                          })
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={col.Header}
                            placeholder="Search area..."
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                      />
                    </FormControl>
                  )
                } else if (col.accessor === 'model') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <Autocomplete
                        id={`autocomplete-${col.accessor}`}
                        options={models}
                        getOptionLabel={(option) => option.modelName || ''}
                        value={
                          models.find((model) => model.modelName === formData[col.accessor]) || null
                        }
                        onChange={(event, newValue) => {
                          handleInputChange({
                            target: {
                              name: col.accessor,
                              value: newValue ? newValue.modelName : '',
                            },
                          })
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={col.Header}
                            placeholder="Search models..."
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  )
                } else if (col.accessor === 'category') {
                  return (
                    <FormControl fullWidth sx={{ marginBottom: 2 }} key={col.accessor}>
                      <Autocomplete
                        id={`autocomplete-${col.accessor}`}
                        options={categories}
                        getOptionLabel={(option) => option.categoryName || ''}
                        value={
                          categories.find(
                            (category) => category.categoryName === formData[col.accessor],
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleInputChange({
                            target: {
                              name: col.accessor,
                              value: newValue ? newValue.categoryName : '',
                            },
                          })
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={col.Header}
                            placeholder="Search categories..."
                            variant="outlined"
                          />
                        )}
                      />
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
                        type="datetime-local"
                        name={col.accessor}
                        //value={formData[col.accessor] || ''} //change kelya nantr display hote
                        //value={getCurrentDateTime() || ''} ////change kelya nantr input mdhe show nhi hot but backened vr changed vali jate as expected
                        value={formData[col.accessor] || getCurrentDateTime()}
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
