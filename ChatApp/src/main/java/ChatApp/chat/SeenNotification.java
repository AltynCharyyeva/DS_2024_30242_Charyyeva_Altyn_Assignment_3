package ChatApp.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeenNotification {
    String seen;
    String senderId;
    String recipientId;
}
