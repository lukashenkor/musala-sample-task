import "./App.css";
import { NavLink, Route, Routes } from "react-router-dom";
import DeviceDetails from "./pages/DeviceDetails";
import GatewayDetails from "./pages/GatewayDetails";
import GatewayList from "./pages/GatewayList";
import DeviceList from "./pages/DeviceList";
import { appAPI } from "./services/AppService";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "./features/requestStatus/request-status-slice";

function App() {
  const dispatch = useDispatch();
  const { status: requestStatus, message: requestMessage } = useSelector(
    (state) => state.requestStatus
  );

  const {
    data: gateways,
    isLoading: gatewaysLoading,
    error: gatewaysError,
  } = appAPI.useFetchAllGatewaysQuery();

  const {
    data: devices,
    isLoading: devicesLoading,
    error: devicesError,
  } = appAPI.useFetchAllDevicesQuery();

  function snackbarHandleClose() {
    dispatch(clearMessage());
  }

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <NavLink to={"/gateways"}>Gateways</NavLink>
          <NavLink to={"/devices"}>Devices</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/gateways" exact element={<GatewayList />} />
          <Route path="/gateways/:id" element={<GatewayDetails />} />
          <Route path="/devices" exact element={<DeviceList />} />
          <Route path="/devices/:id" element={<DeviceDetails />} />
        </Routes>
      </main>
      {requestMessage && <Snackbar
        open={!!requestMessage}
        autoHideDuration={5000}
        onClose={snackbarHandleClose}
        ClickAwayListenerProps={{ onClickAway: () => null }}
      >
        <Alert
          variant="filled"
          severity={requestStatus || ''}
          onClose={snackbarHandleClose}
        >
          {requestMessage}
        </Alert>
      </Snackbar>}
    </div>
  );
}

export default App;
