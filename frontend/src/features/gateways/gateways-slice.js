import { createSlice } from "@reduxjs/toolkit";
import { appAPI } from "../../services/AppService";

const gatewaysSlice = createSlice({
  name: "gateways",
  initialState: {
    data: [],
  },
  reducers: {
    addGateway: (state, action) => {
      const gateway = action.payload;
      state.data.push(gateway);
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appAPI.endpoints.fetchAllGateways.matchFulfilled,
      (state, action) => {
        state.data = action.payload;
      },
    );
    builder.addMatcher(
      appAPI.endpoints.createNewGateway.matchFulfilled,
      (state, action) => {
        state.data.push(action.payload);
      },
    );
  },
});

export const { addGateway } = gatewaysSlice.actions;

// export const { selectAllGateways } = gatewaysSlice.adapter;

export default gatewaysSlice.reducer;
