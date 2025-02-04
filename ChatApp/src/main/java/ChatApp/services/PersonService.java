//package ChatApp.services;
//
//import ChatApp.controllers.handlers.exceptions.model.ResourceNotFoundException;
//import ChatApp.dtos.PersonDTO;
//import ChatApp.repositories.PersonRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import ChatApp.dtos.PersonDetailsDTO;
//import ChatApp.dtos.builders.PersonBuilder;
//import ChatApp.entities.Person;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Service
//public class PersonService {
//    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
//    private final PersonRepository personRepository;
//
//    @Autowired
//    public PersonService(PersonRepository personRepository) {
//        this.personRepository = personRepository;
//    }
//
//    public List<PersonDTO> findPersons() {
//        List<Person> personList = personRepository.findAll();
//        return personList.stream()
//                .map(PersonBuilder::toPersonDTO)
//                .collect(Collectors.toList());
//    }
//
//    public PersonDetailsDTO findPersonById(UUID id) {
//        Optional<Person> prosumerOptional = personRepository.findById(id);
//        if (!prosumerOptional.isPresent()) {
//            LOGGER.error("Person with id {} was not found in db", id);
//            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
//        }
//        return PersonBuilder.toPersonDetailsDTO(prosumerOptional.get());
//    }
//
//    public UUID insert(PersonDetailsDTO personDTO) {
//        Person person = PersonBuilder.toEntity(personDTO);
//        person = personRepository.save(person);
//        LOGGER.debug("Person with id {} was inserted in db", person.getId());
//        return person.getId();
//    }
//
//}
