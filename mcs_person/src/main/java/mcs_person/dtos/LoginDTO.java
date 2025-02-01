package mcs_person.dtos;

import lombok.Data;

import java.util.UUID;
@Data
public class LoginDTO {

    private String email;
    private String password;
}
