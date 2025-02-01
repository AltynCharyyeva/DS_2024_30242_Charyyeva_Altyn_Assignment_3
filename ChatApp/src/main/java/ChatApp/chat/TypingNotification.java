package ChatApp.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypingNotification {
    String typing;
    String senderId;
    String recipientId;
}
