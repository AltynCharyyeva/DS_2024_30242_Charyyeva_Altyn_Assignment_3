package mcs_person.services;

import mcs_person.dtos.PersonDTO;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import mcs_person.Ds2020TestConfig;
import mcs_person.dtos.PersonDetailsDTO;

import static org.springframework.test.util.AssertionErrors.assertEquals;

import java.util.List;
import java.util.UUID;

@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete.sql")
public class PersonServiceIntegrationTests extends Ds2020TestConfig {

    @Autowired
    PersonService personService;

    @Test
    public void testGetCorrect() {
        List<PersonDetailsDTO> personDTOList = personService.findPersons();
        assertEquals("Test Insert Person", 1, personDTOList.size());
    }

    @Test
    public void testInsertCorrectWithGetById() {
        PersonDetailsDTO p = new PersonDetailsDTO("John", "Somewhere Else street", 22, "121212");
        UUID insertedID = personService.insert(p);

        PersonDetailsDTO insertedPerson = new PersonDetailsDTO(insertedID, p.getName(), p.getPassword(), p.getAge(), p.getEmail());
        PersonDetailsDTO fetchedPerson = personService.findPersonById(insertedID);

        assertEquals("Test Inserted Person", insertedPerson, fetchedPerson);
    }

    @Test
    public void testInsertCorrectWithGetAll() {
        PersonDetailsDTO p = new PersonDetailsDTO("John", "Somewhere Else street", 22, "121212");
        personService.insert(p);

        List<PersonDetailsDTO> personDTOList = personService.findPersons();
        assertEquals("Test Inserted Persons", 2, personDTOList.size());
    }
}
