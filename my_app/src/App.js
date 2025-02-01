import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./Users"; // Make sure this path is correct
import AdminHome from "./components/AdminHome";
import Devices from "./Devices";
import CreateUser from "./components/CreateUser";
import CreateDevice from "./components/CreateDevice";
import UpdateUser from "./components/UpdateUser";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import UpdateUserByAdmin from "./admin_components/UpdateUserByAdmin";
import UpdateDeviceByAdmin from "./admin_components/UpdateDeviceByAdmin";
import Home from "./Home";
import UserDevices from "./components/UserDevices";
import AssociateDevice from "./admin_components/AssociateDevice";
import UserDeviceMeasurements from "./components/UserDeviceMeasurements";
import Signup from "./components/SignUp";
import UserAfterLogin from "./components/UserAfterLogin";
//import Chat from "./chat_components/Chat";
import ChatUsers from "./chat_components/ChatUsers";
import PrivateChat from "./chat_components/PrivateChat";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <header className="App-header">
          {/* Your existing header content */}
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/create-device" element={<CreateDevice />} />
            <Route path="/update-user" element={<UpdateUser />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/after-login" element={<UserAfterLogin />} />
            <Route path="/chatroom" element={<ChatUsers />} />
            <Route path="/chatroom/private" element={<PrivateChat />} />
            <Route
              path="/update-user/:userId"
              element={<UpdateUserByAdmin />}
            />
            <Route
              path="/update-device/:deviceId"
              element={<UpdateDeviceByAdmin />}
            />
            <Route path="/person/:personId/devices" element={<UserDevices />} />
            <Route
              path="/associate-device/:userId"
              element={<AssociateDevice />}
            />
            <Route
              path="/device-measurements/:deviceId"
              element={<UserDeviceMeasurements />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
