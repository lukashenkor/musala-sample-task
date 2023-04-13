import React, { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { appAPI } from "../services/AppService";
import {
  Button, DialogContentText, FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import ActionDialog from "../components/ActionDialog";
import { useSelector } from "react-redux";

const redirectArrow = require("../assets/icons/redirect-arrow.svg").default;

function GatewayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dialog, setDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [connectingDevice, setConnectingDevice] = useState('');

  const {
    data: gateways,
    isLoading: gatewaysLoading,
    error: gatewaysError,
  } = appAPI.useFetchAllGatewaysQuery();
  const gateway = gateways?.find((item) => item._id === id);
  const devices = useSelector(state => state.devices.data);
  
  const [deleteGateway] = appAPI.useDeleteGatewayMutation();
  const [addDevice] = appAPI.useAddDeviceToGatewayMutation();
  


  async function submitHandler(e) {
    e.preventDefault();
    if (dialogMode === "Connect device") {
      if (!connectingDevice) return;
      await addDevice({
        gatewayId: gateway["_id"],
        deviceId: connectingDevice,
      });
      handleClose();
    } else if (dialogMode === "Delete gateway") {
      await deleteGateway(gateway["_id"]);
      handleClose();
      navigate('/gateways');
    }
  }

  function handleClose() {
    setDialog(false);
    setDialogMode(null);
    setConnectingDevice('');
  }

  function handleOpenDialogClick(mode) {
    setDialogMode(mode);
    setDialog(true);
  }

  function selectHandleChange(e) {
    const device = e.target.value;

    setConnectingDevice(device);
  }

  if (gatewaysLoading) {
    return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
  }

  if (gatewaysError) {
    return <h1 style={{ textAlign: "center" }}>{gatewaysError}</h1>;
  }

  return gateway ? (
    <>
      <div className="item-details">
        <div className="item-details-header">
          <Button
            variant="outlined"
            color="success"
            disabled={gateway?.devices?.length >= 10}
            onClick={() => handleOpenDialogClick("Connect device")}
          >
            Connect device
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleOpenDialogClick("Delete gateway")}
          >
            Delete gateway
          </Button>
          <h1>Gateway: {gateway.name}</h1>
        </div>
        <p>Serial number: {gateway.serialNumber}</p>
        <p>IPv4: {gateway.ip4}</p>
        Peripheral Devices:
        <ul className="gateway-devices-list">
          {gateway.devices.map((device) => (
            <NavLink
              to={`/devices/${device["_id"]}`}
              className="goto-link"
              key={device["_id"]}
            >
              <li>
                {device.uid} - {device.vendor} -{" "}
                {device.status ? "✅ Online" : "❌ Offline"}
              </li>
              <img
                className="goto-link__arrow"
                src={redirectArrow}
                alt="Redirect"
              />
            </NavLink>
          ))}
        </ul>
      </div>
      <ActionDialog
        open={dialog}
        handleClose={handleClose}
        submitHandler={submitHandler}
        dialogMode={dialogMode}
      >
        {dialogMode === "Delete gateway" && (
          <DialogContentText>
            Are you sure you want to delete gateway: {gateway.name}?
          </DialogContentText>
        )}
        {dialogMode === "Connect device" && (
          <FormControl fullWidth>
            <InputLabel id="devices-label">Device</InputLabel>
            <Select
              labelId="devices-label"
              id="devices-select"
              value={connectingDevice}
              label="Device"
              onChange={selectHandleChange}
            >
              {devices.filter(device => !device.gateway).map(device => (
                <MenuItem key={device["_id"]} value={device["_id"]}>{device.uid}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </ActionDialog>
    </>
  ) : (
    <h1>Not Found</h1>
  );
}

export default GatewayDetails;
