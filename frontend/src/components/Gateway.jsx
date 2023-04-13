import React from "react";
import { NavLink } from "react-router-dom";

function Gateway({ _id, name, serialNumber, ip4, devices }) {
  return (
    <div className="list-item">
      <NavLink to={`/gateways/${_id}`}>
        <p>Name: {name}</p>
        <p>Serial number: {serialNumber}</p>
        <p>IPv4: {ip4}</p>
        <div>
          <p>Peripheral Devices: {devices.slice(0, 3).map(device => device.uid).join(', ')}{devices.length > 3 && ", ..."}</p>
        </div>
      </NavLink>
    </div>
  );
}

export default Gateway;
