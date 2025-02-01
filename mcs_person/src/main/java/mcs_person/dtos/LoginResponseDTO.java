package mcs_person.dtos;

import lombok.Data;
import mcs_person.entities.Role;

import java.util.UUID;

@Data
public class LoginResponseDTO {
    UUID personId;
    String token;
    Role role;
    String name;

}
