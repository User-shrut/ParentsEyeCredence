import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk to fetch vehicle data
export const fetchVehicleData = createAsyncThunk('vehicle/fetchVehicleData', async (vehicleId) => {
  const response = await axios.get(
    `https://rocketsalestracker.com/api/positions?deviceId=${vehicleId}`,
    {
      auth: {
        username: 'hbtrack',
        password: '123456@',
      },
    },
  )
  return response.data
})

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    vehicleData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearData: (state) => {
      state.vehicleData = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVehicleData.fulfilled, (state, action) => {
        state.loading = false
        state.vehicleData = action.payload
      })
      .addCase(fetchVehicleData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearData } = vehicleSlice.actions

export default vehicleSlice.reducer
