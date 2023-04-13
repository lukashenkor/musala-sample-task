import React, { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { appAPI } from "../services/AppService";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const redirectArrow = require("../assets/icons/redirect-arrow.svg").default;

function DeviceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dialog, setDialog] = useState(false);
  const {
    data: devices,
    isLoading: devicesLoading,
    error: devicesError,
  } = appAPI.useFetchAllDevicesQuery();

  const [deleteDevice, {}] = appAPI.useDeleteDeviceMutation();

  const device = devices?.find((item) => item._id === id);

  async function submitHandler() {
    await deleteDevice(device["_id"]);
    handleClose();
    navigate("/devices");
  }

  function handleClose() {
    setDialog(false);
  }

  if (devicesLoading) {
    return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
  }

  return device ? (
    <>
      <div className="item-details">
        <div className="item-details-header">
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDialog(true)}
          >
            Delete device
          </Button>
          <h1>Peripheral device: {device.uid}</h1>
        </div>
        <p>Vendor: {device.vendor}</p>
        <p>Status: {device.status ? "✅ Online" : "❌ Offline"}</p>
        {device.gateway && (
          <div>
            Gateway:{" "}
            <NavLink to={`/gateways/${device.gateway["_id"]}`} className="goto-link">
              {device.gateway.name}
              <img
                className="goto-link__arrow"
                src={redirectArrow}
                alt="Redirect"
              />
            </NavLink>
          </div>
        )}
      </div>
      <Dialog open={dialog}>
        <DialogTitle>Delete device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete device: {device.uid}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={submitHandler}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <h1>Not Found</h1>
  );
}

export default DeviceDetails;
