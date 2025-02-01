package mcs_person.dtos.builders;

import mcs_person.dtos.PersonDTO;
import mcs_person.entities.Person;
import mcs_person.dtos.PersonDetailsDTO;

public class PersonBuilder {

    private PersonBuilder() {
    }

    public static PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(person.getId(), person.getName());
    }

    public static PersonDetailsDTO toPersonDetailsDTO(Person person) {
        return new PersonDetailsDTO(person.getId(),
                person.getName(),
                person.getEmail(),
                person.getAge(),
                person.getPassword());
    }

    public static Person toEntity(PersonDetailsDTO personDetailsDTO) {
        return new Person(personDetailsDTO.getName(),
                personDetailsDTO.getEmail(),
                personDetailsDTO.getAge(),
                personDetailsDTO.getPassword());
    }
}
