package ChatApp.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class UserController {

    //private final UserService userService;
    public Set<User> connectedUsers = new HashSet<>();

    @MessageMapping("/user.addUser")
    @SendTo("/topic/public")
    public User addUser(
            @Payload User user
    ) {
        user.setStatus(Status.ONLINE);
        connectedUsers.add(user);
        //userService.saveUser(user);
        return user;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/topic/public")
    public User disconnectUser(
            @Payload User user
    ) {
        user.setStatus(Status.OFFLINE);
        //userService.disconnect(user);
        return user;
    }

    @GetMapping("/users")
    public ResponseEntity<Set<User>> findConnectedUsers() {
        return ResponseEntity.ok(connectedUsers);
    }
}