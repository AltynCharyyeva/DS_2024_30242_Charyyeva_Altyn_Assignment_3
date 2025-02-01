import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to get the user ID from cookies
import "bootstrap/dist/css/bootstrap.min.css";

export default function UpdateUser() {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
  });

  //const token = localStorage.getItem("token");
  //const personId = localStorage.getItem("personId");

  // State to handle success/error messages
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null); // State to store the user ID

  useEffect(() => {
    // Get user ID from the cookie and set it in state
    const idFromCookie = Cookies.get("personId");
    if (idFromCookie) {
      setUserId(idFromCookie);
    } else {
      setMessage("User ID not found. Please log in again.");
    }
  }, []);

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

    if (!userId) {
      setMessage("User ID is missing. Cannot update user.");
      return;
    }

    try {
      // Use PUT method with user ID in URL for updating user
      await axios.post(
        `http://localhost/personservice/person/update/${userId}`,
        formData
      );
      setMessage("User updated successfully!");
      setFormData({ name: "", address: "", age: "", password: "" });
    } catch (error) {
      setMessage("Error updating user. Please try again.");
      console.error("There was an error updating the user!", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
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
          <label htmlFor="age">Age</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update User
        </button>
      </form>

      {message && <div className="alert mt-3">{message}</div>}
    </div>
  );
}
