import React, { useState } from 'react';
import Gateway from '../components/Gateway';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import InputComponent from '../components/InputComponent';
import { appAPI } from '../services/AppService';
import { useSelector } from 'react-redux';
import ActionDialog from '../components/ActionDialog';


const newItemFields = {
  inputs: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      name: "serialNumber",
      type: "text",
      label: "Serial number",
      required: true,
    },
    {
      name: "ip4",
      type: "text",
      label: "IPv4",
      required: true,
    },
  ],
};

function GatewayList() {
  const [dialog, setDialog] = useState(false);
  const [newItemObject, setNewItemObject] = useState({devices: []});

  const {
    data: gateways,
    isLoading: gatewaysLoading,
    error: gatewaysError,
  } = appAPI.useFetchAllGatewaysQuery();
  const devices = useSelector(state => state.devices.data);

  const [createGateway] = appAPI.useCreateNewGatewayMutation();


  function fieldOnChangeHandler(e) {
    setNewItemObject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function selectChangeHandler(e) {
    const {
      target: { value },
    } = e;
    setNewItemObject(prev => ({...prev, devices: value}))
  }

  async function createItemSubmitHandler(e) {
    e.preventDefault();
    try {
      const response = await createGateway(newItemObject);
      if (response.error) return
      setNewItemObject({});
      setDialog(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  function dialogOnCloseHandler() {
    setDialog(false);
    setNewItemObject({});
  }

  if (gatewaysLoading) {
    return <>
      <LinearProgress />
      <h1 style={{ textAlign: "center" }}>Loading...</h1>
    </>
  }
  return (
    <div>
      <div className="list-header">
        <Button
          className='create-new'
          variant="outlined"
          color="success"
          onClick={() => setDialog(true)}
        >
          Create new gateway
        </Button>
        <h1>Gateways list</h1>
      </div>
      {gatewaysError && <h2>{gatewaysError}</h2>}
      <div className="list-body">
        {gateways?.map((item) => (
          <Gateway key={item["_id"]} {...item} />
        ))}
      </div>
      <ActionDialog
        open={dialog}
        dialogMode={"Create new gateway"}
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
          <InputLabel id="demo-simple-select-label">Devices</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newItemObject.devices || []}
            multiple
            label="Devices"
            name="devices"
            onChange={selectChangeHandler}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {devices
              .filter((device) => !device.gateway)
              .map((device) => (
                <MenuItem key={device["_id"]} value={device["_id"]}>
                  {device["_id"]} - {device.uid}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </ActionDialog>
    </div>
  );
}

export default GatewayList