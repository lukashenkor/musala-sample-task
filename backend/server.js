require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
  keepAlive: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());
app.use(cors());

const gatewaysRouter = require("./routes/gateways");
const devicesRouter = require("./routes/devices");
app.use("/gateways", gatewaysRouter);
app.use("/devices", devicesRouter);

app.listen(8080, () => console.log("Server is started"));
