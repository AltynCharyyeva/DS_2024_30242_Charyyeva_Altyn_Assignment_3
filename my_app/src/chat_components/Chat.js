import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import "./Chat.css";

const ChatApp = () => {
  const [fullname, setFullname] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [userMap, setUserMap] = useState({});

  const chatAreaRef = useRef(null);
  const messageInputRef = useRef(null);

  const connect = (event) => {
    event.preventDefault();
    if (fullname) {
      const socket = new SockJS("http://localhost:8083/ws");
      const client = Stomp.over(socket);
      client.connect({}, () => onConnected(client), onError);
      setStompClient(client);
    }
  };

  const onConnected = (client) => {
    client.subscribe(`/user/${fullname}/queue/messages`, onMessageReceived);
    client.subscribe(`/topic/public`, onMessageReceived);

    // Subscribe to "seen" notifications
    client.subscribe(`/user/${fullname}/queue/seen`, (payload) => {
      const seenNotification = JSON.parse(payload.body);
      alert(`Your messages have been seen by ${seenNotification.senderId}.`);
    });

    client.send(
      "/app/user.addUser",
      {},
      JSON.stringify({
        fullName: fullname,
        status: "ONLINE",
      })
    );

    setIsConnected(true);
    fetchAndDisplayConnectedUsers();
  };

  // const onMessageReceived = (payload) => {
  //   const message = JSON.parse(payload.body);
  //   const isRelevantMessage =
  //     (message.senderId === selectedUserId ||
  //       message.recipientId === selectedUserId) &&
  //     selectedUserId;

  //   if (isRelevantMessage) {
  //     setMessages((prevMessages) => {
  //       const updatedMessages = [...prevMessages, message];
  //       scrollToBottom();
  //       return updatedMessages;
  //     });
  //   } else {
  //     fetchAndDisplayConnectedUsers();
  //   }
  // };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
    scrollToBottom();
    fetchAndDisplayConnectedUsers();
  };

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  const fetchAndDisplayConnectedUsers = async () => {
    const connectedUsersResponse = await fetch("http://localhost:8083/users");
    let users = await connectedUsersResponse.json();
    users = users.filter((user) => user.fullName !== fullname);
    setConnectedUsers(users);

    const userMap = {};
    users.forEach((user) => {
      userMap[user.fullName] = user.userId;
    });
    setUserMap(userMap);
  };

  const handleUserClick = async (userId) => {
    setSelectedUserId(userId);
    await fetchAndDisplayUserChat(userId);

    // Send a seen notification when a user is clicked
    const seenNotification = {
      senderId: fullname,
      recipientId: userId,
      seen: "messages seen by " + fullname,
    };
    stompClient.send(
      "/app/seen-notification",
      {},
      JSON.stringify(seenNotification)
    );
  };

  const fetchAndDisplayUserChat = async (userId) => {
    const userChatResponse = await fetch(
      `http://localhost:8083/messages/${fullname}/${userId}`
    );
    const userChat = await userChatResponse.json();
    setMessages(userChat);
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const messageContent = messageInput.trim();
    console.log("Selected userId: ", selectedUserId);
    if (messageContent && stompClient && selectedUserId) {
      const chatMessage = {
        senderId: fullname,
        recipientId: selectedUserId,
        content: messageContent,
      };

      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: fullname, content: messageContent },
      ]);

      setMessageInput("");
    }
    fetchAndDisplayConnectedUsers();
  };

  const onError = () => {
    alert(
      "Could not connect to WebSocket server. Please refresh this page to try again!"
    );
  };

  const onLogout = () => {
    if (stompClient) {
      stompClient.send(
        "/app/user.disconnectUser",
        {},
        JSON.stringify({
          fullName: fullname,
          status: "OFFLINE",
        })
      );
    }
    window.location.reload();
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="Chat.css" />
      <title>Chat Application</title>

      <h2>Chat</h2>

      {!isConnected && (
        <div className="user-form" id="username-page">
          <h2>Enter Chatroom</h2>
          <form id="usernameForm" onSubmit={connect}>
            <label htmlFor="fullname">Name:</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
            <button type="submit">Enter Chatroom</button>
          </form>
        </div>
      )}

      {isConnected && (
        <div className="chat-container" id="chat-page">
          <div className="users-list">
            <div className="users-list-container">
              <h2>Online Users</h2>
              <ul>
                {connectedUsers.map((user) => (
                  <li key={user.fullName}>
                    <button
                      type="button"
                      onClick={() => handleUserClick(user.fullName)}
                      className="user-button"
                    >
                      {user.fullName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p id="connected-user-fullname">{fullname}</p>
              <button className="logout" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
          <div className="chat-area">
            <div className="chat-messages" id="chat-messages" ref={chatAreaRef}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.senderId === fullname ? "sent" : "received"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            {selectedUserId && (
              <form
                id="messageForm"
                name="messageForm"
                className="message-form"
                onSubmit={sendMessage}
              >
                <div className="message-input">
                  <input
                    ref={messageInputRef}
                    autoComplete="off"
                    type="text"
                    id="message"
                    placeholder={`Message ${selectedUserId}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button type="submit">Send</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
