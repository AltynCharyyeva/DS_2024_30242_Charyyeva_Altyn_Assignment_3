import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UpdateDeviceByAdmin() {
  const { deviceId } = useParams(); // Get userId from URL params
  const [formData, setFormData] = useState({
    description: "",
    address: "",
    energyConsumption: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // If userId is missing, set error message
    if (!deviceId) {
      setMessage(
        "Device ID not found. Please go back and select a device to update."
      );
      return;
    }

    // Fetch user details if userId is available
    const fetchDeviceDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost/deviceservice/device/${deviceId}`
        );
        setFormData({
          description: response.data.description || "Device description", // Ensure default values
          address: response.data.address || "Device address",
          energyConsumption:
            response.data.energyConsumption || "Device energy consuption",
        });
      } catch (error) {
        setMessage("Error fetching device details. Please try again.");
      }
    };

    fetchDeviceDetails();
  }, [deviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deviceId) {
      setMessage("Device ID is missing. Cannot update device.");
      return;
    }

    try {
      await axios.post(
        `http://localhost/deviceservice/device/update/${deviceId}`,
        formData
      );
      setMessage("Device updated successfully!");
    } catch (error) {
      setMessage("Error updating device. Please try again.");
      console.error("There was an error updating the device!", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Device</h2>
      {message && <div className="alert alert-warning mt-3">{message}</div>}
      {deviceId && (
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={formData.description} // Controlled input
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={formData.address} // Controlled input
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="energyConsumption">Energy Consumption</label>
            <input
              type="number"
              className="form-control"
              id="energyConsumption"
              name="energyConsumption"
              value={formData.energyConsumption} // Controlled input
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Update Device
          </button>
        </form>
      )}
    </div>
  );
}
