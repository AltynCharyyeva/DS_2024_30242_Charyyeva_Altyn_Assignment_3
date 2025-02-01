package mcs_person.services;

import mcs_person.dtos.*;
import mcs_person.entities.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import mcs_person.controllers.handlers.exceptions.model.ResourceNotFoundException;
import mcs_person.dtos.builders.PersonBuilder;
import mcs_person.entities.Person;
import mcs_person.repositories.PersonRepository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;

    private RestTemplate restTemplate = new RestTemplate();

    @Autowired
    public PersonService(PersonRepository personRepository,
                         PasswordEncoder passwordEncoder) {
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<PersonDetailsDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDetailsDTO)
                .collect(Collectors.toList());
    }

    public List<PersonDTO> getPersonsForChat(){
        List<Person> personList = personRepository.findAll();
        return personList.stream().map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDetailsDTO findPersonById(UUID id) {
        Optional<Person> prosumerOptional = personRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }
        return PersonBuilder.toPersonDetailsDTO(prosumerOptional.get());
    }

    public PersonDetailsDTO updatePerson(UUID personId, PersonDetailsDTO  personDTO){
        boolean exists = personRepository.findById(personId).isPresent();
        if (exists){
            Person originalPerson = personRepository.findById(personId).get();
            if(personDTO.getName() != null){ // if person updates name
                originalPerson.setName(personDTO.getName());
            }
            if(personDTO.getAge() != 0){ // if person updates age
                originalPerson.setAge(personDTO.getAge());
            }
            if(personDTO.getEmail() != null){
                originalPerson.setEmail(personDTO.getEmail()); // if person updates address
            }
            if(personDTO.getPassword() != null){
                originalPerson.setPassword(personDTO.getPassword()); // if person updates password
            }
            personRepository.save(originalPerson);

            return PersonBuilder.toPersonDetailsDTO(originalPerson);
        }
        return null;
    }

    public boolean deletePerson(UUID personId){
        boolean exists = personRepository.findById(personId).isPresent();
        if(exists){
            personRepository.deleteById(personId);
            // Notify the device microservice to update devices associated with this person
            notifyDeviceMicroservice(personId);
            return true;
        }
        else{
            return false;
        }
    }

    private void notifyDeviceMicroservice(UUID personId) {
        // URL for the device microservice API endpoint
        String deviceServiceUrl = "http://reverse-proxy/deviceservice/unlinkPerson/" + personId;

        // Send a DELETE request to the device microservice to unlink the person from associated devices
        restTemplate.delete(deviceServiceUrl);
    }

    public UUID insert(PersonDetailsDTO personDTO) {
        String name = personDTO.getName();
        String password = personDTO.getPassword();
        Role role;
        if (name.endsWith("_admin") && password.endsWith("_88")) {
            role = Role.ADMIN; // Assuming you have an enum named Role with ADMIN value
        } else {
            role = Role.USER; // Default role for other users
        }

        String encodedPassword = passwordEncoder.encode(personDTO.getPassword());
        Person user = new Person(
                personDTO.getName(),
                personDTO.getEmail(),
                personDTO.getAge(),
                encodedPassword);

        user.setRole(role);

        return personRepository.save(user).getId();
    }


//    public List<DeviceDTO> getDevicesForPerson(UUID personId) {
//        String deviceServiceUrl = "http://device_service:8081/device/person/" + personId;
//
//        // Make GET request to device microservice
//        ResponseEntity<List<DeviceDTO>> response = restTemplate.exchange(
//                deviceServiceUrl, HttpMethod.GET, null,
//                new ParameterizedTypeReference<List<DeviceDTO>>() {
//                }
//        );
//
//        // Return the list of devices
//        return response.getBody();
//    }

//    public UUID findPersonByNameAndPassword(LoginDTO loginDTO){
//        Optional<Person> prosumerOptional = personRepository.findByNameAndPassword(loginDTO.getEmail(),
//                loginDTO.getPassword());
//        if (!prosumerOptional.isPresent()) {
//            LOGGER.error("Person was not found in db");
//            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: ");
//        }
//        return prosumerOptional.get().getId();
//    }

    public Role findRoleByPersonId(UUID personId) {
        Optional<Person> personOptional = personRepository.findById(personId);
        if (!personOptional.isPresent()) {
            LOGGER.error("Person not found with id: " + personId);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + personId);
        }
        return personOptional.get().getRole(); // Returns the role ENUM
    }



}
