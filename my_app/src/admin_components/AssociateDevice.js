import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AssociateDevice() {
  const { userId } = useParams(); // Retrieve the userId from URL params
  console.log("Retrieved User ID:", userId); // Debugging log

  const [devices, setDevices] = useState([]); // List of devices
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the list of devices from the device microservice
    const fetchDevices = async () => {
      try {
        const response = await axios.get(
          "http://localhost/deviceservice/device"
        );
        setDevices(response.data);
      } catch (error) {
        setMessage("Error fetching devices. Please try again later.");
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  // Handle the association of a device to the user
  // Handle the association of a device to the user
  const handleAssociate = async (deviceId) => {
    console.log(`User ID: ${userId}, Device ID: ${deviceId}`); // Logging the IDs for debugging
    try {
      await axios.post("http://localhost/deviceservice/device/associate", {
        personId: userId, // Assuming userId represents the person's ID
        deviceId: deviceId,
      });
      setMessage(
        `Device ${deviceId} associated successfully with user ${userId}.`
      );
    } catch (error) {
      const errorMsg =
        error.response?.data || "Error associating device. Please try again.";
      setMessage(errorMsg);
      console.error("Error associating device:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Associate Device to User</h2>
      {message && <div className="alert alert-info mt-3">{message}</div>}

      <div className="list-group">
        {devices.map((device) => (
          <div
            key={device.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <p>{device.description}</p>
            </div>
            <div>
              <p>{device.address}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleAssociate(device.id)}
            >
              Associate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
