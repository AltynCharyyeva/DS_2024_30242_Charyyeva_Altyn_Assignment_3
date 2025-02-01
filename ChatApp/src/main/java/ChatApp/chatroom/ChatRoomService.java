package ChatApp.chatroom;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    //private final ChatRoomRepository chatRoomRepository;
    public List<ChatRoom> chatRoomList = new ArrayList<>();

    public Optional<String> getChatRoomId(
            String senderId,
            String recipientId,
            boolean createNewRoomIfNotExists
    ) {
        if (createNewRoomIfNotExists) {
            var chatIdCreated = createChatId(senderId, recipientId);
            chatRoomList.add(new ChatRoom(chatIdCreated, senderId, recipientId)); // Add new ChatRoom to the list
            System.out.println("IF CHATROOM DOES NOT EXIST:");
            System.out.println("ChatRoomList: " + chatRoomList);
            System.out.println("ChatId created: " + Optional.of(chatIdCreated));
            return Optional.of(chatIdCreated);
        } else {
            System.out.println("IF CHATROOM EXISTS: ");
            var chatIdFound = chatRoomList.stream()
                    .filter(chatRoom ->
                            (chatRoom.getSenderId().equals(senderId) && chatRoom.getRecipientId().equals(recipientId)) ||
                                    (chatRoom.getSenderId().equals(recipientId) && chatRoom.getRecipientId().equals(senderId)))
                    .map(ChatRoom::getChatId)
                    .findFirst();
            System.out.println("chatId found: " + chatIdFound);
            return chatIdFound;

        }
    }

    private String createChatId(String senderId, String recipientId) {
        var chatId = String.format("%s_%s", senderId, recipientId);

//        ChatRoom senderRecipient = ChatRoom
//                .builder()
//                .chatId(chatId)
//                .senderId(senderId)
//                .recipientId(recipientId)
//                .build();
//
//        ChatRoom recipientSender = ChatRoom
//                .builder()
//                .chatId(chatId)
//                .senderId(recipientId)
//                .recipientId(senderId)
//                .build();

        //chatRoomRepository.save(senderRecipient);
        //chatRoomRepository.save(recipientSender);

        return chatId;
    }
}