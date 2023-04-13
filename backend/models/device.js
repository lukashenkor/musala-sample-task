const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
  uid: {
    type: Number,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  gateway: {
    type: mongoose.Types.ObjectId,
    ref: 'Gateway'
  }
})


module.exports = mongoose.model('PeripheralDevice', deviceSchema)