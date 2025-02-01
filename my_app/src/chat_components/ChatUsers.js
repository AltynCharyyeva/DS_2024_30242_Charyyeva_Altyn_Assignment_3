import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import PrivateChat from "./PrivateChat";
import "./Chat.css";

const ChatUsers = () => {
  const [fullname, setFullname] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Check if a username is stored in localStorage and auto-connect
    // const storedFullname = localStorage.getItem("name");
    // if (storedFullname) {
    //   setFullname(storedFullname);
    //   startWebSocketConnection(storedFullname);
    // }

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [stompClient]);

  const connect = (event) => {
    event.preventDefault();
    if (fullname) {
      // Check if the username matches the one in localStorage
      const storedFullname = localStorage.getItem("name");
      if (storedFullname && storedFullname !== fullname) {
        alert("The entered name does not match the stored username.");
        return;
      } else {
        startWebSocketConnection();
      }

      // Save the username to localStorage if not already present
      // if (!storedFullname) {
      //   localStorage.setItem("fullname", fullname);
      // }
    }
  };

  const startWebSocketConnection = () => {
    const socket = new SockJS("http://localhost/chatservice/ws");
    const client = Stomp.over(socket);
    client.connect({}, () => onConnected(client), onError);
    setStompClient(client);
  };

  const onConnected = (client) => {
    // Subscribe to user-specific messages
    client.subscribe(`/user/${fullname}/queue/messages`, () => {});

    // Subscribe to public topic for user updates
    client.subscribe(`/topic/public`, (payload) => {
      const userUpdate = JSON.parse(payload.body);
      fetchAndDisplayConnectedUsers(); // Refresh the user list on updates
    });

    // Subscribe to "seen" notifications for the current user
    client.subscribe(`/user/${fullname}/queue/seen`, (payload) => {
      const seenNotification = JSON.parse(payload.body);
      alert(`Your messages have been seen by ${seenNotification.senderId}.`);
    });

    // Subscribe to "typing" notifications for the current user
    //client.subscribe(`/user/${fullname}/queue/typing`, (payload) => {
    //const typingNotification = JSON.parse(payload.body);
    //alert(`${typingNotification.senderId} is typing...`);
    //});

    // Notify server about the new user
    client.send(
      "/app/user.addUser",
      {},
      JSON.stringify({ fullName: fullname, status: "ONLINE" })
    );

    setIsConnected(true);
    fetchAndDisplayConnectedUsers();
  };

  const fetchAndDisplayConnectedUsers = async () => {
    const response = await fetch("http://localhost/chatservice/users");
    const users = await response.json();
    setConnectedUsers(users.filter((user) => user.fullName !== fullname));
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);

    // Send a "seen" notification when a user is clicked
    const seenNotification = {
      senderId: fullname, // current user is the sender
      recipientId: user.fullName, // selected user is the recipient
      seen: `Messages seen by ${fullname}`, // message content (could be improved)
    };

    stompClient.send(
      "/app/seen-notification", // ensure this is the correct server endpoint
      {},
      JSON.stringify(seenNotification)
    );
  };

  const sendTypingNotification = () => {
    if (selectedUser) {
      const typingNotification = {
        senderId: fullname,
        recipientId: selectedUser.fullName,
        typing: true, // true means typing
      };

      stompClient.send(
        "/app/typing-notification", // Ensure this is the correct server endpoint
        {},
        JSON.stringify(typingNotification)
      );
    }
  };

  const onError = () => {
    alert("Could not connect to WebSocket server. Please refresh the page!");
  };

  if (selectedUser) {
    return (
      <PrivateChat
        stompClient={stompClient}
        currentUser={fullname}
        selectedUser={selectedUser}
        onBack={() => setSelectedUser(null)}
        sendTypingNotification={sendTypingNotification} // Pass to PrivateChat
      />
    );
  }

  return (
    <div>
      <h2>Chat</h2>
      {!isConnected ? (
        <form onSubmit={connect}>
          <label htmlFor="fullname">Name:</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          <button type="submit">Enter Chatroom</button>
        </form>
      ) : (
        <div>
          <h3>Online Users</h3>
          <ul>
            {connectedUsers.map((user) => (
              <li key={user.fullName}>
                <button onClick={() => handleUserClick(user)}>
                  {user.fullName}
                </button>
              </li>
            ))}
          </ul>
          <div className="current-user">
            Logged in as: <strong>{fullname}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUsers;
