import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Home</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title">Users</h2>
              <p className="card-text">Manage users from here.</p>
              <Link to="/users" className="btn btn-primary">
                Manage Users
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title">Devices</h2>
              <p className="card-text">Manage devices from here.</p>
              <Link to="/devices" className="btn btn-primary">
                Manage Devices
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title">Chatroom</h2>
              <p className="card-text">Access the chatroom from here.</p>
              <Link to="/chatroom" className="btn btn-primary">
                Go To Chatroom
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
