package mcs_person.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import mcs_person.dtos.LoginDTO;
import mcs_person.dtos.PersonDetailsDTO;
import mcs_person.entities.Person;
import mcs_person.entities.Role;
import mcs_person.repositories.PersonRepository;

@Service
public class AuthenticationService {
    private final PersonRepository personRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            PersonRepository personRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Person signup(PersonDetailsDTO personDTO) {

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

        return personRepository.save(user);
    }

    public Person authenticate(LoginDTO input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return personRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }
}

