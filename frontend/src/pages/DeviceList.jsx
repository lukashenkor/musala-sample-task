import React, { useState } from "react";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  LinearProgress,
} from "@mui/material";
import InputComponent from "../components/InputComponent";
import { appAPI } from "../services/AppService";
import Device from "../components/Device";
import { useSelector } from "react-redux";
import ActionDialog from "../components/ActionDialog";

const newItemFields = {
  inputs: [
    {
      name: "uid",
      type: "number",
      label: "UID",
      required: true,
    },
    {
      name: "vendor",
      type: "text",
      label: "Vendor",
      required: true,
    },
  ],
};

function DeviceList() {
  const {
    data: devices,
    isLoading: devicesLoading,
    error: devicesError,
  } = appAPI.useFetchAllDevicesQuery();

  const gateways = useSelector((state) => state.gateways.data);

  const [createDevice] = appAPI.useCreateNewDeviceMutation();

  const [dialog, setDialog] = useState(false);
  const [newItemObject, setNewItemObject] = useState({
    status: true,
    gateway: null,
  });

  function fieldOnChangeHandler(e) {
    setNewItemObject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function createItemSubmitHandler(e) {
    e.preventDefault();
    try {
      const result = await createDevice(newItemObject);
      if (result.error) return 
      setNewItemObject({ status: true });
      setDialog(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  function dialogOnCloseHandler() {
    setDialog(false);
    setNewItemObject({});
  }

  if (devicesLoading) {
    return <>
      <LinearProgress />
      <h1 style={{ textAlign: "center" }}>Loading...</h1>;
    </>
  }

  return (
    <div>
      <div className="list-header">
        <Button
          variant="outlined"
          color="success"
          onClick={() => setDialog(true)}
        >
          Create new device
        </Button>
        <h1>Devices list</h1>
      </div>
      {devicesError && <h2>{devicesError}</h2>}
      <div className="list-body">
        {devices?.map((item) => (
          <Device key={item["_id"]} {...item} />
        ))}
      </div>
      <ActionDialog
        open={dialog}
        dialogMode={"Create new device"}
        submitHandler={createItemSubmitHandler}
        handleClose={dialogOnCloseHandler}
      >
        {newItemFields.inputs.map((field) => (
          <InputComponent
            handleChange={fieldOnChangeHandler}
            key={field.name}
            errorMessage="Field is required"
            props={field}
          />
        ))}
        <FormControl className="create-item-input">
          <InputLabel id="demo-simple-select-label">Gateway</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newItemObject.gateway || ""}
            label="Age"
            name="gateway"
            onChange={fieldOnChangeHandler}
          >
            {gateways
              .filter((gateway) => gateway.devices.length < 10)
              .map((gateway) => (
                <MenuItem key={gateway["_id"]} value={gateway["_id"]}>
                  {gateway.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </ActionDialog>
    </div>
  );
}

export default DeviceList;
