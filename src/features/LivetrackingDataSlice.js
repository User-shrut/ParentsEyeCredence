import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Define initial state
const initialState = {
  vehicles: [],
  filteredVehicles: [],
  singleVehicle: null,
  loading: false,
  error: null,
  deviceNames: [],
}

// Fetch vehicle data from API with Basic Auth
const fetchVehiclesFromAPI = async () => {
  const positionsAPI = 'http://104.251.212.84/api/positions'
  const auth = {
    username: 'hbtrack',
    password: '123456@',
  }
  const response = await axios.get(positionsAPI, { auth })
  console.log('Length of positions API: ' + response.data.length)
  return response.data
}

// Fetch device names API
const fetchDevicesFromAPI = async () => {
  const devicesAPI = 'http://104.251.212.84/api/devices'
  const auth = {
    username: 'hbtrack',
    password: '123456@',
  }
  const response = await axios.get(devicesAPI, { auth })
  console.log('Length of devices API: ' + response.data.length)
  return response.data
}

// Fetch live vehicle data continuously in real-time
export const fetchLiveVehicles = createAsyncThunk('liveFeatures/fetchLiveVehicles', async () => {
  const positions = await fetchVehiclesFromAPI()
  const devices = await fetchDevicesFromAPI()

  // Merge positions with device names
  return positions.map((position) => {
    const device = devices.find((dev) => dev.id === position.deviceId)
    return { ...position, name: device?.name, category: device?.category, groupId: device?.groupId }
  })
})

// Create the slice with filtering logic
const liveFeaturesSlice = createSlice({
  name: 'liveFeatures',
  initialState,
  reducers: {
    //getting data live of single vehicle.
    updateSingleVehicle(state, action) {
      const updatedVehicle = action.payload
      if (state.singleVehicle?.deviceId === updatedVehicle.deviceId) {
        state.singleVehicle = updatedVehicle
      }
    },

    //selecting single vehicle
    setSingleVehicle(state, action) {
      const vehicleId = action.payload
      state.singleVehicle = state.vehicles.find((vehicle) => vehicle.deviceId === vehicleId)
    },
    // Update vehicles from WebSocket
    updateVehicles(state, action) {
      state.vehicles = action.payload // Update vehicles with new data
      state.filteredVehicles = action.payload // Optionally reset filtered vehicles
    },
    // Filtering logic
    filterAllVehicles(state) {
      state.filteredVehicles = state.vehicles
    },
    filterStoppedVehicles(state) {
      state.filteredVehicles = state.vehicles.filter(
        (vehicle) => vehicle.attributes.ignition === false && vehicle.speed < 1,
      )
    },
    filterIdleVehicles(state) {
      state.filteredVehicles = state.vehicles.filter(
        (vehicle) => vehicle.attributes.ignition === true && vehicle.speed < 2,
      )
    },
    filterRunningVehicles(state) {
      state.filteredVehicles = state.vehicles.filter(
        (vehicle) =>
          vehicle.attributes.ignition === true && vehicle.speed > 2 && vehicle.speed < 60,
      )
    },
    filterOverspeedVehicles(state) {
      state.filteredVehicles = state.vehicles.filter(
        (vehicle) => vehicle.attributes.ignition === true && vehicle.speed > 60,
      )
    },
    filterInactiveVehicles(state) {
      state.filteredVehicles = state.vehicles.filter(
        (vehicle) => !(vehicle.attributes.ignition === true && vehicle.speed > 0),
      )
    },
    filterByCategory(state, action) {
      state.filteredVehicles = state.vehicles.filter(
        (vehicle) => vehicle.category === action.payload,
      )
    },
    filterByGroup(state, action) {
      state.filteredVehicles = state.vehicles.filter(
        (vehicle) => vehicle.groupId === action.payload,
      )
    },
    filterByGeofence(state, action) {
      state.filteredVehicles = state.vehicles.filter(
        (vehicle) => vehicle.geofenceIds && vehicle.geofenceIds.includes(action.payload),
      )
    },
    filterBySingleVehicle(state, action) {
      state.filteredVehicles = state.vehicles.filter((vehicle) => vehicle.name === action.payload)
    },
    searchVehiclesByName(state, action) {
      const searchTerm = action.payload.toLowerCase() // Convert to lowercase for case-insensitive search
      state.filteredVehicles = state.vehicles.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(searchTerm),
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveVehicles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLiveVehicles.fulfilled, (state, action) => {
        state.loading = false
        state.vehicles = action.payload
        state.filteredVehicles = action.payload // Initialize with all vehicles

        state.deviceNames = action.payload.map((vehicle) => vehicle.name).filter(Boolean)
      })
      .addCase(fetchLiveVehicles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

// Export the actions
export const {
  updateVehicles,
  filterAllVehicles,
  filterStoppedVehicles,
  filterIdleVehicles,
  filterRunningVehicles,
  filterOverspeedVehicles,
  filterInactiveVehicles,
  filterByCategory,
  filterByGroup,
  filterByGeofence,
  filterBySingleVehicle,
  searchVehiclesByName,
  setSingleVehicle,
  updateSingleVehicle,
} = liveFeaturesSlice.actions

// Selector to get device names
export const selectDeviceNames = (state) => state.liveFeatures.deviceNames

// Export the reducer
export default liveFeaturesSlice.reducer
