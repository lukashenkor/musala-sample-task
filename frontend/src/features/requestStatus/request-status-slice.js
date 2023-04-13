import { createSlice } from '@reduxjs/toolkit';


const requestStatusSlice = createSlice({
  name: 'requestStatus',
  initialState: {
    status: null,
    message: null,
  },
  reducers: {
    setMessage(state, action) {
      const { message, status } = action.payload;
      state.status = status;
      state.message = message;
    },
    clearMessage(state) {
      state.status = null;
      state.message = null;
    },
  },
});

export const {
  setMessage,
  clearMessage,
} = requestStatusSlice.actions;

export default requestStatusSlice.reducer;