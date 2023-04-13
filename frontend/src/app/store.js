import { configureStore } from "@reduxjs/toolkit";
import gatewaysReducer from '../features/gateways/gateways-slice';
import devicesReducer from '../features/devices/devices-slice';
import errorReducer from '../features/requestStatus/request-status-slice';
import { appAPI } from "../services/AppService";
import { rtkQueryErrorLogger } from "../services/apiHandlers";

export const store = configureStore({
  reducer: {
    gateways: gatewaysReducer,
    devices: devicesReducer,
    requestStatus: errorReducer,
    [appAPI.reducerPath]: appAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([appAPI.middleware, rtkQueryErrorLogger]),
});
