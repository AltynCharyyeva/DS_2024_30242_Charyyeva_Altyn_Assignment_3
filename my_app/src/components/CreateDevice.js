import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateDevice() {
  // State to hold form data
  const [formData, setFormData] = useState({
    description: "",
    address: "",
    energyConsumption: "",
  });

  // State to handle success/error messages
  const [message, setMessage] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost/deviceservice/device/save", formData);
      setMessage("Device created successfully!");
      setFormData({ description: "", address: "", energyConsumption: "" });
    } catch (error) {
      setMessage("Error creating device. Please try again.");
      console.error("There was an error saving the user!", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Device</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
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
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="age">energyConsumption</label>
          <input
            type="number"
            className="form-control"
            id="energyConsumption"
            name="energyConsumption"
            value={formData.energyConsumption}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Device
        </button>
      </form>

      {message && <div className="alert mt-3">{message}</div>}
    </div>
  );
}
