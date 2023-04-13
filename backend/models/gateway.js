const mongoose = require("mongoose");
const { isValidIp } = require("../utils/validators");

const gatewaySchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  ip4: {
    type: String,
    required: true,
    validate: {
      validator: isValidIp,
      message: (props) => `${props.value} is not a valid ip4 address`,
    },
  },
  devices: [
    {
      type: mongoose.Types.ObjectId,
      ref: "PeripheralDevice",
      validate: {
        validator: function () {
          return this.devices.length <= 10;
        },
        message: "Up to 10 devices can be connected to one gateway",
      },
    },
  ],
});

module.exports = mongoose.model("Gateway", gatewaySchema);
