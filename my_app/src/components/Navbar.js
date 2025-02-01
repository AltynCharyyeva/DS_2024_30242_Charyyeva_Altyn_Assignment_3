import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [logoutMessage, setLogoutMessage] = useState(false);

  const handleLogout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Show logout success message
    setLogoutMessage(true);

    // Hide the message after 3 seconds
    setTimeout(() => setLogoutMessage(false), 3000);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav"></ul>
          <div className="ms-auto d-flex gap-2">
            {/* Login Button - Always Visible */}
            <Link className="btn btn-primary" to="/signup">
              SignUp
            </Link>
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Logout Success Message */}
      {logoutMessage && (
        <div className="alert alert-success mt-3 text-center" role="alert">
          Logout was successful!
        </div>
      )}
    </nav>
  );
};

export default Navbar;
