import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthAxios from "../AuthAxios";

export default function UpdateUserByAdmin() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      setMessage(
        "User ID not found. Please go back and select a user to update."
      );
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await AuthAxios.get(
          `http://localhost/personservice/person/${userId}`
        );
        console.log(
          "Response data: ",
          response.data.name,
          response.data.email,
          response.data.age,
          response.data.password
        );
        setFormData({
          name: response.data.name,
          email: response.data.email,
          age: response.data.age,
          password: response.data.password,
        });
      } catch (error) {
        setMessage("Error fetching user details. Please try again.");
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User ID is missing. Cannot update user.");
      return;
    }

    try {
      await AuthAxios.post(
        `http://localhost/personservice/person/update/${userId}`,
        formData
      );
      setMessage("User updated successfully!");
    } catch (error) {
      setMessage("Error updating user. Please try again.");
    }
  };

  const handleNavigateToAssociateDevice = () => {
    navigate(`/associate-device/${userId}`);
  };

  return (
    <div className="container mt-5">
      <h2>Update User</h2>
      {message && <div className="alert alert-warning mt-3">{message}</div>}
      {userId && (
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
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
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
              type="text"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Update User
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={handleNavigateToAssociateDevice}
          >
            Associate Device to Person
          </button>
        </form>
      )}
    </div>
  );
}
