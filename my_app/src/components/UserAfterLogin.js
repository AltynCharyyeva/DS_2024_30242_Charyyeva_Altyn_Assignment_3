import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserAfterLogin() {
  const navigate = useNavigate();

  // Handle "See my devices" button click
  const handleSeeDevices = () => {
    const personId = localStorage.getItem("personId");
    if (personId) {
      navigate(`/person/${personId}/devices`);
    } else {
      alert("User ID not found. Please log in again.");
    }
  };

  // Handle "Logout" button click
  const handleLogout = () => {
    // Clear local storage and any session data
    localStorage.removeItem("token");
    localStorage.removeItem("personId");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    // Redirect to login page
    navigate("/login");
  };

  // Handle "Go to Chatroom" button click
  const handleGoToChatroom = () => {
    navigate("/chatroom");
  };

  return (
    <div className="container mt-5">
      <h2>Welcome!</h2>
      <div className="mt-3">
        <button className="btn btn-primary me-3" onClick={handleSeeDevices}>
          See My Devices
        </button>
        <button className="btn btn-secondary me-3" onClick={handleGoToChatroom}>
          Go to Chatroom
        </button>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
