import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0); // Assuming age is a number
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message on new attempt

    try {
      const response = await axios.post(
        //"http://localhost:8080/auth/signup",
        "http://localhost/personservice/auth/signup",
        {
          name,
          email,
          age,
          password,
        }
      );

      // Handle successful signup - redirect to login
      console.log("Signup successful:", response.data);
      setMessage("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      {message && <div className="alert alert-warning">{message}</div>}
      <form onSubmit={handleSignup}>
        <div className="form-group mb-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="age">Age</label>
          <input
            type="number" // Assuming age is a number input
            className="form-control"
            id="age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))} // Corrected line
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          SignUp
        </button>
      </form>
    </div>
  );
}
