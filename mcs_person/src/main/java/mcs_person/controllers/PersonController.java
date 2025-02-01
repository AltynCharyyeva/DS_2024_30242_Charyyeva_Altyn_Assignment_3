package mcs_person.controllers;


import mcs_person.dtos.LoginDTO;
import mcs_person.dtos.PersonDTO;
import mcs_person.dtos.PersonDetailsDTO;
import mcs_person.entities.Role;
import mcs_person.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
//@CrossOrigin("http://frontend.localhost")
//@CrossOrigin
@RequestMapping(value = "/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping()
    public ResponseEntity<List<PersonDetailsDTO>> getPersons() {
        List<PersonDetailsDTO> dtos = personService.findPersons();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<UUID> insertPerson(@Valid @RequestBody PersonDetailsDTO personDTO) {
        UUID personID = personService.insert(personDTO);
        return new ResponseEntity<>(personID, HttpStatus.CREATED);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<PersonDetailsDTO> updatePerson(@PathVariable("id") UUID personId, @RequestBody PersonDetailsDTO updatedPerson) {
        PersonDetailsDTO personDTO = personService.updatePerson(personId, updatedPerson);
        if (personDTO != null) {
            return new ResponseEntity<>(personDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> DeletePerson(@PathVariable("id") UUID personId){
        boolean deleted = personService.deletePerson(personId);
        if(deleted){

            return ResponseEntity.ok("Person successfully deleted");
        }
        else{
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<PersonDetailsDTO> getPersonById(@PathVariable("id") UUID personId) {
        PersonDetailsDTO dto = personService.findPersonById(personId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping(value = "/for-chat")
    public ResponseEntity<List<PersonDTO>> getPersonDetailsForChat(){
        List<PersonDTO> dtos = personService.getPersonsForChat();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

//    @PostMapping("/login")
//    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
//        // Extract username and password from the LoginDTO
//        String name = loginDTO.getEmail();
//        String password = loginDTO.getPassword();
//
//        // Validate username and password naming conventions
//        if (name.endsWith("_admin") && !password.endsWith("_88")) {
//            return new ResponseEntity<>(Map.of("message", "Invalid password for admin."), HttpStatus.FORBIDDEN);
//        }
//        if (!name.endsWith("_admin") && password.endsWith("_88")) {
//            return new ResponseEntity<>(Map.of("message", "Invalid username for client."), HttpStatus.FORBIDDEN);
//        }
//
//        // Authenticate the user
//        UUID personId = personService.findPersonByNameAndPassword(loginDTO);
//
//        // Get the role of the authenticated user
//        Role role = personService.findRoleByPersonId(personId); // Implement this method in your service layer
//
//        // Create the response map
//        Map<String, Object> response = new HashMap<>();
//        response.put("personId", personId.toString()); // Include personId as a string
//        response.put("role", role != null ? role.name() : "UNKNOWN"); // Safely get role name
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }






    //TODO: UPDATE, DELETE per resource

}
