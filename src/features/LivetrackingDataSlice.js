import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client';


// Define initial state
const initialState = {
  vehicles: [],
  filteredVehicles: [],
  singleVehicle: null,
  loading: false,
  error: null,
  deviceNames: [],
  activeFilter: null, // Added state to track the current active filter
}

// WebSocket connection logic
export const socket = io(`${import.meta.env.VITE_API_URL}`, {
  transports: ['websocket', 'polling'], // Specify transports (optional)
})

// Create the slice with filtering logic
const liveFeaturesSlice = createSlice({
  name: 'liveFeatures',
  initialState,
  reducers: {
    // Handle updating vehicles with data from WebSocket
    setVehicles(state, action) {
      state.vehicles = action.payload
      // Reapply the active filter whenever vehicles are updated
      if (state.activeFilter) {
        // Reapply the active filter using the stored filter function
        state.filteredVehicles = state.activeFilter(state.vehicles)
      } else {
        // Default behavior: show all vehicles if no filter is active
        state.filteredVehicles = state.vehicles
      }
    },

    // Handle WebSocket error
    setError(state, action) {
      state.error = action.payload
    },

    // Update logic for individual vehicle
    updateSingleVehicle(state, action) {
      const updatedVehicle = action.payload
      if (state.singleVehicle?.deviceId === updatedVehicle.deviceId) {
        state.singleVehicle = updatedVehicle
      }
    },

    // Selecting single vehicle
    setSingleVehicle(state, action) {
      const vehicleId = action.payload
      state.singleVehicle = state.vehicles.find((vehicle) => vehicle.deviceId === vehicleId)
    },

    // Filtering logic (e.g., stopped, idle, running vehicles)
    filterAllVehicles(state) {
      state.activeFilter = (vehicles) => vehicles // Store filter function
      state.filteredVehicles = state.vehicles
    },
    filterStoppedVehicles(state) {
      state.activeFilter = (vehicles) =>
        vehicles.filter((vehicle) => vehicle.attributes.ignition === false && vehicle.speed < 1) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    filterIdleVehicles(state) {
      state.activeFilter = (vehicles) =>
        vehicles.filter((vehicle) => vehicle.attributes.ignition === true && vehicle.speed < 2) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    filterRunningVehicles(state) {
      state.activeFilter = (vehicles) =>
        vehicles.filter(
          (vehicle) => vehicle.attributes.ignition === true && vehicle.speed > 2 && vehicle.speed < 60,
        ) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    filterOverspeedVehicles(state) {
      state.activeFilter = (vehicles) =>
        vehicles.filter((vehicle) => vehicle.attributes.ignition === true && vehicle.speed > 60) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    filterInactiveVehicles(state) {
      state.activeFilter = (vehicles) =>
        state.activeFilter = (vehicles) => vehicles.filter(vehicle => !vehicle.attributes.ignition || vehicle.speed === 0); // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    filterByCategory(state, action) {
      state.activeFilter = (vehicles) => vehicles.filter((vehicle) => vehicle.category === action.payload) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    filterByGroup(state, action) {
      state.activeFilter = (vehicles) => vehicles.filter((vehicle) => vehicle.groupId === action.payload) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    filterByGeofence(state, action) {
      state.activeFilter = (vehicles) =>
        vehicles.filter((vehicle) => vehicle.geofenceIds && vehicle.geofenceIds.includes(action.payload)) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    filterBySingleVehicle(state, action) {
      state.activeFilter = (vehicles) => vehicles.filter((vehicle) => vehicle.name === action.payload) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
    searchVehiclesByName(state, action) {
      const searchTerm = action.payload.toLowerCase() // Convert to lowercase for case-insensitive search
      state.activeFilter = (vehicles) =>
        vehicles.filter((vehicle) => vehicle.name.includes(searchTerm)) // Store filter function
      state.filteredVehicles = state.activeFilter(state.vehicles)
    },
  },
})


// WebSocket event listeners
export const initializeSocket = (credentials) => (dispatch) => {

  const convertedCredentialsIntoObject = JSON.parse(credentials);

  // Handle connection event
  socket.on('connect', () => {
    console.log('Connected to the socket server')
  })

  // Handle disconnection event
  socket.on('disconnect', () => {
    console.log('Disconnected from the socket server')
  })

  // Listen for live vehicle data
  socket.emit("credentials", convertedCredentialsIntoObject);
  socket.on('all device data', (data) => {
    console.log(data);
    dispatch(liveFeaturesSlice.actions.setVehicles(data))
  })

  // Listen for errors
  socket.on('error', (error) => {
    console.error('Socket error:', error)
    dispatch(liveFeaturesSlice.actions.setError(error))
  })

  // Example of emitting an event to the server
  socket.emit('client-message', { message: 'Hello from client!' })
}

// Export the actions
export const {
  setVehicles,
  setError,
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

export const selectDeviceNames = (state) => state.liveFeatures.deviceNames
// Export the reducer
export default liveFeaturesSlice.reducer