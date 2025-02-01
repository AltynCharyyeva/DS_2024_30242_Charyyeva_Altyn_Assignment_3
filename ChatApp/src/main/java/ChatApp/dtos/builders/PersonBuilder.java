//package ChatApp.dtos.builders;
//
//import ChatApp.dtos.PersonDTO;
//import ChatApp.dtos.PersonDetailsDTO;
//import ChatApp.entities.Person;
//
//public class PersonBuilder {
//
//    private PersonBuilder() {
//    }
//
//    public static PersonDTO toPersonDTO(Person person) {
//        return new PersonDTO(person.getId(), person.getName(), person.getAge());
//    }
//
//    public static PersonDetailsDTO toPersonDetailsDTO(Person person) {
//        return new PersonDetailsDTO(person.getId(), person.getName(), person.getAddress(), person.getAge());
//    }
//
//    public static Person toEntity(PersonDetailsDTO personDetailsDTO) {
//        return new Person(personDetailsDTO.getName(),
//                personDetailsDTO.getAddress(),
//                personDetailsDTO.getAge());
//    }
//}
