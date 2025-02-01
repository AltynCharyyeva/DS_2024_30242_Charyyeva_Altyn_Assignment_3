//package ChatApp.controllers;
//
////import ChatApp.models.ChatMessage;
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//import java.util.HashSet;
//import java.util.Set;
//
//@Controller
//@RequiredArgsConstructor
//public class ChatController {
//
//    private final SimpMessagingTemplate simpMessagingTemplate;
//    private Set<String> connectedUsers = new HashSet<>();  // Track connected users
//
//
//    // Method to handle private messages
//    @MessageMapping("/private-message")
//    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
//        // Send the private message to the specific user
//        simpMessagingTemplate.convertAndSendToUser(
//                chatMessage.getReceiverName(), "/queue/private", chatMessage
//        );
//    }
//
//    @MessageMapping("/add-user")
//    public void addUser(@Payload String username) {
//        connectedUsers.add(username);
//        broadcastConnectedUsers();  // Broadcast updated user list
//    }
//
//
//    @PostConstruct
//    public void broadcastConnectedUsers() {
//        // Broadcast the list of connected users to all clients
//        simpMessagingTemplate.convertAndSend("/topic/connected-users", connectedUsers);
//    }
//
//    // Method to remove a user from the list of connected users when they disconnect
//    @MessageMapping("/remove-user")
//    public void removeUser(@Payload String username) {
//        connectedUsers.remove(username);
//        broadcastConnectedUsers();  // Broadcast updated user list
//    }}