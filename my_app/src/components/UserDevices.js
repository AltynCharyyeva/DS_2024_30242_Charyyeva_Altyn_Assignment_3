import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function UserDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role"); // Get role from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /admin if role is "ADMIN"
    const userId = localStorage.getItem("personId");
    if (role === "CLIENT") {
      navigate(`/person/${userId}/devices`);
    }
    if (role === "ADMIN") {
      navigate("/admin");
    }

    const fetchDevices = async () => {
      const personId = Cookies.get("personId"); // Get personId from cookies
      try {
        const response = await axios.get(
          `http://localhost/deviceservice/device/person/${personId}`
        );
        setDevices(response.data); // Assuming response.data contains the list of devices
      } catch (err) {
        setError("No devices found");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [role, navigate]);

  if (loading) {
    return <div>Loading devices...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Your Devices</h2>
      {devices.length === 0 ? (
        <p>No devices found.</p>
      ) : (
        <ul className="list-group">
          {devices.map((device) => (
            <li key={device.id} className="list-group-item">
              {device.description} - {device.address} -{" "}
              {device.energyConsumption}
              <br />
              {/* Button to link to the device measurements */}
              <Link to={`/device-measurements/${device.id}`}>
                <button className="btn btn-primary mt-2">
                  See device measurements
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
