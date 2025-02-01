package ChatApp.chat;

import ChatApp.chatroom.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    //private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;
    public List<ChatMessage> chatMessages = new ArrayList<>();

    public ChatMessage save(ChatMessage chatMessage) {
        String sendrec = String.format("%s_%s", chatMessage.getSenderId(), chatMessage.getRecipientId());
        String recsend = String.format("%s_%s", chatMessage.getRecipientId(), chatMessage.getSenderId());
        boolean createChatRoom = false;
        boolean chatRoomExists = chatMessages.stream()
                .anyMatch(message -> message.getChatId().equals(sendrec) || message.getChatId().equals(recsend));
        if(!chatRoomExists){
            createChatRoom = true;
        }
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), createChatRoom)
                .orElseThrow(); // You can create your own dedicated exception
        chatMessage.setChatId(chatId);
        chatMessages.add(chatMessage);
        System.out.println("Chat Messages: " + chatMessages);
        //repository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        System.out.println("chatId (found or created): " + chatId);
        return chatId.map(id -> chatMessages.stream()
                        .filter(message -> message.getChatId().equals(id))
                        .collect(Collectors.toList()))
                .orElse(new ArrayList<>());
    }
}