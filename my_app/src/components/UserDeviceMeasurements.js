import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function UserDeviceMeasurements() {
  const { deviceId } = useParams(); // Get the deviceId from the URL parameters
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get(
          `http://monservice/localhost/monitoring/${deviceId}/measurements`
        );
        setMeasurements(response.data); // Assuming response.data contains the list of measurements
      } catch (err) {
        setError("No measurements found");
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, [deviceId]);

  if (loading) {
    return <div>Loading measurements...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Device Measurements</h2>
      {measurements.length === 0 ? (
        <p>No measurements found for this device.</p>
      ) : (
        <ul className="list-group">
          {measurements.map((measurement) => (
            <li key={measurement.id} className="list-group-item">
              {measurement.timestamp} - {measurement.measurementValue} kWh
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
