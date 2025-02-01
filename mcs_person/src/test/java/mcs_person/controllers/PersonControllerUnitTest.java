package mcs_person.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import mcs_person.services.PersonService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import mcs_person.Ds2020TestConfig;
import mcs_person.dtos.PersonDetailsDTO;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class PersonControllerUnitTest extends Ds2020TestConfig {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PersonService service;

    @Test
    public void insertPersonTest() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        PersonDetailsDTO personDTO = new PersonDetailsDTO("John", "Somewhere Else street", 22, "hjfl");

        mockMvc.perform(post("/person")
                .content(objectMapper.writeValueAsString(personDTO))
                .contentType("application/json"))
                .andExpect(status().isCreated());
    }

    @Test
    public void insertPersonTestFailsDueToAge() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        PersonDetailsDTO personDTO = new PersonDetailsDTO("John", "Somewhere Else street", 17, "hjfl");

        mockMvc.perform(post("/person")
                .content(objectMapper.writeValueAsString(personDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void insertPersonTestFailsDueToNull() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        PersonDetailsDTO personDTO = new PersonDetailsDTO("John", null, 17, "hjfl");

        mockMvc.perform(post("/person")
                .content(objectMapper.writeValueAsString(personDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }
}
