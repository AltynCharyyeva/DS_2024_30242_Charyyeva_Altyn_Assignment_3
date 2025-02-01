import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function Devices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const result = await axios.get("http://localhost/deviceservice/device"); //localhost: 8081 / device;
      console.log("Devices fetched:", result.data); // Log the fetched data
      setDevices(result.data);
    } catch (error) {
      console.error("Error loading devices:", error);
    }
  };

  const handleDeleteDevice = async (id) => {
    // Confirm deletion with the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this device?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost/deviceservice/device/delete/${id}`);
      // Reload the users list after deletion
      loadDevices();
      alert("Device deleted successfully!");
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("There was an error deleting the device. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Device List</h1>
        <Link to="/create-device">
          <button className="btn btn-primary">Create Device</button>
        </Link>
      </div>
      {devices.length === 0 ? (
        <p className="text-center">No devices found.</p>
      ) : (
        <div className="row">
          {devices.map((device, index) => (
            <div className="col-md-6" key={index}>
              <div className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <strong>Description:</strong> {device.description}
                  </h5>
                  <p className="card-text">
                    <strong>Address:</strong> {device.address}
                  </p>
                  <p className="card-text">
                    <strong>Energy Consumption:</strong>{" "}
                    {device.energyConsumption}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/update-device/${device.id}`}>
                      <button className="btn btn-warning">Update</button>
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteDevice(device.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
