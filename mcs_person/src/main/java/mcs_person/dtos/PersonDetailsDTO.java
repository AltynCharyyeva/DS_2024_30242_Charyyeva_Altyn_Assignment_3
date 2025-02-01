package mcs_person.dtos;

import lombok.Data;
import mcs_person.dtos.validators.annotation.AgeLimit;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class PersonDetailsDTO {

    private UUID id;
    @NotNull
    private String name;
    @NotNull
    private String email;
    @AgeLimit(limit = 18)
    private int age;

    @NotNull
    private String password;

    public PersonDetailsDTO() {
    }

    public PersonDetailsDTO( String name, String email, int age, String password) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.password = password;
    }

    public PersonDetailsDTO(UUID id, String name, String email, int age, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.password = password;
    }

}
