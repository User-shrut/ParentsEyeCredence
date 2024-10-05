import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// Async thunk to fetch device data
export const fetchDeviceData = createAsyncThunk('device/fetchDeviceData', async () => {
  const token = Cookies.get('authToken')
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/device`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response.data
})

const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDeviceData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDeviceData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default deviceSlice.reducer
