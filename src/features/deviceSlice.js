import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (_, { rejectWithValue }) => {
    const authToken = Cookies.get('authToken')
    if (!authToken) {
      return rejectWithValue('Authentication token not found')
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/device`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      console.log('devicessssssss', response.data.devices)
      return response.data.devices
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    devices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false
        state.devices = action.payload || []
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default deviceSlice.reducer
