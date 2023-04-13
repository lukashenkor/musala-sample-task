const express = require("express");
const router = express.Router();
const Gateway = require("../models/gateway");
const PeripheralDevice = require("../models/device");

const getItemMiddleware = require("../middlewares/router-middlewares");
const field = 'device';
const getDevice = getItemMiddleware(field, 'peripheral device', PeripheralDevice);

// Get all devices
router.get("/", async (req, res) => {
  try {
    const devices = await PeripheralDevice.find();
    const devicesWithGateway = await PeripheralDevice.populate(devices, {path: "gateway"});
    res.json(devicesWithGateway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get device by id
router.get("/:id", getDevice, async (req, res) => {
  return res.json(res[field]);
});

// Create new device
router.post("/", async (req, res) => {
  const { uid, vendor, gateway, status } = req.body;
  try {
    const existingDevice = await PeripheralDevice.findOne({ uid });
    if (existingDevice) {
      return res
        .status(400)
        .json({ message: `Peripheral device with uid ${uid} already exists` });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  let existingGateway;
  if (gateway) {
    try {
      existingGateway = await Gateway.findById(gateway);
      if (!existingGateway) {
        return res
          .status(404)
          .json({ message: `Gateway with id ${gateway} does not exist` });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const newDevice = new PeripheralDevice({
      uid,
      vendor,
      status: status || false,
      gateway: gateway ? gateway : null,
    });
    await newDevice.save();
    if (existingGateway) {
      existingGateway.devices.push(newDevice);
      await existingGateway.save();
    }
    return res.status(201).json({ message: "Device is created", data: newDevice });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Update one device by id
router.patch("/:id", getDevice, async (req, res) => {
  const { status, vendor, gateway } = req.body;
  try {
    if (status !== undefined) {
      res[field].status = status;
    }
    if (vendor !== undefined) {
      res[field].vendor = vendor;
    }
    if (gateway !== undefined) {
      const prevGateway = await Gateway.findById(res[field].gateway);
      if (prevGateway?.devices?.length) {
        prevGateway.devices.pull(res[field]._id);
        await prevGateway.save();
      }
      res[field].gateway = gateway;
      if (gateway) {
        const newGateway = await Gateway.findById(gateway);
        newGateway.devices.push(res[field]);
        await newGateway.save();
      }
    }
    await res[field].save();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  return res.json({ message: "Device is updated", data: res[field]});
});

// Delete device by id
router.delete("/:id", getDevice, async (req, res) => {
  const id = req.params.id;

  
  /* try {
    gateway = await Gateway.findById(res[field].gateway);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  } */

  const device = await res[field].populate('gateway');
  console.log('gateway', device)
  if (!device) {
    return res
      .status(404)
      .json({
        message: `Couldn't find gateway with id ${res[field].gateway._id}`,
      });
  }

  try {

    await device.gateway?.devices?.pull(res[field]._id);
    await device.save();
    await res[field].deleteOne({ _id: id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.json({ message: "Peripheral device deleted successfully" });
});

/* async function getDevice(req, res, next) {
  const id = req.params.id;
  let device;
  try {
    device = await PeripheralDevice.findById(id);
    if (!device) {
      return res.status(404).json({ message: `Couldn't find peripheral device with id ${id}` });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res[field] = device;
  next();
} */

module.exports = router;
