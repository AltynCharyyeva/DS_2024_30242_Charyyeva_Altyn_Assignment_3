package ChatApp.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;



    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        String username = chatMessage.getRecipientId();

        chatMessageService.save(chatMessage);
        System.out.println("Chat message from processMessage: " + chatMessage);

        String queueName = "/user/" + username  + "/queue/messages";
        messagingTemplate.convertAndSend(queueName, chatMessage);
    }

    @MessageMapping("/seen-notification")
    public void processSeenNotification(@Payload SeenNotification seenNotification){
        String recipient = seenNotification.getRecipientId();
        String queueName = "/user/" + recipient + "/queue/seen";
        messagingTemplate.convertAndSend(queueName, seenNotification);
    }

    @MessageMapping("/typing-notification")
    public void processTypingNotification(@Payload TypingNotification typingNotification){
        String recipient = typingNotification.getRecipientId();
        String queueName = "/user/" + recipient + "/queue/typing";
        messagingTemplate.convertAndSend(queueName, typingNotification);
    }


    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable String senderId,
                                                              @PathVariable String recipientId) {
        List<ChatMessage> chatMessagesFound = chatMessageService.findChatMessages(senderId, recipientId);
        System.out.println("ChatMessages: " + chatMessagesFound);
        return ResponseEntity
                .ok(chatMessagesFound);
    }
}