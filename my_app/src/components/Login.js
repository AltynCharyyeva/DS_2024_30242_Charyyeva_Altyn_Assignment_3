import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        //"http://localhost:8080/auth/login",
        "http://localhost/personservice/auth/login",
        {
          email,
          password,
        }
      );

      const { token, personId, role, name } = response.data;

      // Store token, personId, and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("personId", personId);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      // Redirect based on role
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "USER") {
        navigate(`/after-login`);
      } else {
        setMessage("Invalid role.");
      }
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {message && <div className="alert alert-warning">{message}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Login
        </button>
      </form>
    </div>
  );
}
