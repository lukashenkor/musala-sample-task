import "./App.css";
import { NavLink, Route, Routes, Navigate } from "react-router-dom";
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

  appAPI.useFetchAllGatewaysQuery();
  appAPI.useFetchAllDevicesQuery();

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
          <Route path="/gateways" element={<GatewayList />} />
          <Route path="/gateways/:id" exact element={<GatewayDetails />} />
          <Route path="/devices" exact element={<DeviceList />} />
          <Route path="/devices/:id" exact element={<DeviceDetails />} />
          <Route
            path="/"
            element={<Navigate to="/gateways" replace />}
          />
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
