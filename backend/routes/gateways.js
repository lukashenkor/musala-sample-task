const express = require("express");

const router = express.Router();
const Gateway = require("../models/gateway");
const PeripheralDevice = require("../models/device");

const getItemMiddleware = require("../middlewares/router-middlewares");
const field = 'gateway';
const getGateway = getItemMiddleware(field, 'gateway', Gateway);

// Get all gateways
router.get("/", async (req, res) => {
  try {
    const gateways = await Gateway.find().populate('devices');
    res.json(gateways);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get one gateway by id
router.get("/:id", getGateway, async (req, res) => {
  return res.json(res[field]);
});

// Create gateway
router.post("/", async (req, res) => {
  const { serialNumber, name, ip4, devices } = req.body;
  let existingGateway;
  try {
    existingGateway = await Gateway.findOne({ serialNumber });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  if (existingGateway) {
    return res.status(400).json({
      message: `Gateway with serial number "${serialNumber}" already exists`,
    });
  }

  const gateway = new Gateway({
    serialNumber,
    name,
    ip4,
    devices,
  });
  try {
    await gateway.save();
    await PeripheralDevice.updateMany(
      { "_id": {$in: devices} },
      { $set: { gateway: gateway["_id"] } }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
  return res.status(201).json({ message: "Gateway is created", data: gateway });
});

router.patch("/:id/addDevice", getGateway, async (req, res) => {
  const { deviceId } = req.body;

  let device;
  try {
    device = await PeripheralDevice.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: `Device with id ${deviceId} is not found` });
    } else if (device.gateway) {
      return res.status(400).json({ message: `Device with id ${deviceId} already has gateway` });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  
  res[field].devices.push(deviceId);
  try {
    await res[field].save();
    device.gateway = res[field]["_id"];
    await device.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  return res.json({ message: "Device was successfully added" });
  
})

// Delete gateway
router.delete("/:id", getGateway, async (req, res) => {
  const id = req.params.id;
  
  try {
    await Gateway.findByIdAndDelete(id);
    await PeripheralDevice.updateMany(
      { gateway: id },
      { $set: { gateway: null } }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  return res.json({ message: "Gateway was deleted successfully" });
});

module.exports = router;
