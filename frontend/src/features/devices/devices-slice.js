import { createSlice } from '@reduxjs/toolkit';
import { appAPI } from '../../services/AppService';


const devicesSlice = createSlice({
  name: 'devices',
  initialState: {
    data: [],
  },
  reducers: {
    setDevices(state, action) {
      const items = action.payload;
      state.data = items;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appAPI.endpoints.fetchAllDevices.matchFulfilled, 
      (state, action) => {
        state.data = action.payload;
      }
    );
    /* builder.addMatcher(
      appAPI.endpoints.createNewDevice.matchFulfilled,
      (state, action) => {
        state
      }
    ) */
  }
});

export const {
  setDevices,
} = devicesSlice.actions;

export default devicesSlice.reducer;