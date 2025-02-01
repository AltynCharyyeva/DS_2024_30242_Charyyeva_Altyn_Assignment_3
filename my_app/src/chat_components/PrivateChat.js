import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import "./Style.css";

const PrivateChat = ({
  stompClient,
  currentUser,
  selectedUser,
  onBack,
  sendTypingNotification,
}) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const chatAreaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const messageSubscription = stompClient.subscribe(
      `/user/${currentUser}/queue/messages`,
      (payload) => {
        const message = JSON.parse(payload.body);
        if (
          (message.senderId === selectedUser.fullName &&
            message.recipientId === currentUser) ||
          (message.senderId === currentUser &&
            message.recipientId === selectedUser.fullName)
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      }
    );

    const typingSubscription = stompClient.subscribe(
      `/user/${currentUser}/queue/typing`,
      (payload) => {
        const typingNotification = JSON.parse(payload.body);
        if (typingNotification.senderId === selectedUser.fullName) {
          setIsTyping(true);

          // Clear the typing indicator after 3 seconds
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      }
    );

    fetchMessages();

    return () => {
      messageSubscription.unsubscribe();
      typingSubscription.unsubscribe();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [stompClient, currentUser, selectedUser]);

  const fetchMessages = async () => {
    const response = await fetch(
      `http://localhost/chatservice/messages/${currentUser}/${selectedUser.fullName}`
    );
    const data = await response.json();
    setMessages(data);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (messageInput.trim()) {
      const chatMessage = {
        senderId: currentUser,
        recipientId: selectedUser.fullName,
        content: messageInput.trim(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
      setMessageInput("");
      scrollToBottom();
      setIsTyping(false); // Stop typing notification when message is sent
    }
  };

  const handleTyping = (event) => {
    setMessageInput(event.target.value);
    sendTypingNotification(); // Send typing notification when user types
  };

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  return (
    <div className="private-chat">
      <button className="back-button" onClick={onBack}>
        Back to Users
      </button>
      <h3 className="chat-header">Chat with {selectedUser.fullName}</h3>
      <div className="message-area" ref={chatAreaRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === currentUser ? "sent" : "received"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            {selectedUser.fullName} is typing...
          </div>
        )}
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={messageInput}
          onChange={handleTyping}
          placeholder={`Message ${selectedUser.fullName}`}
        />
        <button type="submit">Send</button>
      </form>
      <div className="current-user">
        Logged in as: <strong>{currentUser}</strong>
      </div>
    </div>
  );
};

export default PrivateChat;
