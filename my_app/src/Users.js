import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const token = localStorage.getItem("token");
  console.log(errorMessage);

  const loadUsers = useCallback(async () => {
    try {
      const result = await axios.get("http://localhost/personservice/person", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Users fetched:", result.data);
      setUsers(result.data);
      setErrorMessage("");
    } catch (error) {
      //console.error("Error loading users:", error);
      if (error.response.status === 403) {
        alert("Forbidden: You are not authorized to view this page.");
      } else {
        setErrorMessage("Error loading users. Please try again.");
      }
    }
  }, [token]); // 'token' is a dependency

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost/personservice/person/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      loadUsers(); // Reload users after deletion
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("There was an error deleting the user. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>User List</h1>
        <Link to="/create-user">
          <button className="btn btn-primary">Create User</button>
        </Link>
      </div>
      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <div className="row">
          {users.map((user, index) => (
            <div className="col-md-6" key={user.id}>
              <div className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <strong>Username:</strong> {user.name}
                  </h5>
                  <p className="card-text">
                    <strong>Age:</strong> {user.age}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/update-user/${user.id}`}>
                      <button className="btn btn-warning">Update</button>
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
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
