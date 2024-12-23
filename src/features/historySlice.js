import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchHistoryData = createAsyncThunk(
  'history/fetchHistoryData',
  async ({ from, to, deviceId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`API_ENDPOINT`, {
        params: { from, to, deviceId },
        auth: { username: 'hbtrack', password: '123456@' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHistoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default historySlice.reducer;
