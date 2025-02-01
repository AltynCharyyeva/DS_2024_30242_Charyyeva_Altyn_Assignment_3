package mcs_person.controllers;

import jakarta.servlet.http.HttpServletRequest;
import mcs_person.dtos.LoginResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import mcs_person.dtos.LoginDTO;
import mcs_person.dtos.PersonDetailsDTO;
import mcs_person.entities.Person;
import mcs_person.services.AuthenticationService;
import mcs_person.services.JwtService;

@RestController
//@CrossOrigin
@RequestMapping("/auth")
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Person> register(@RequestBody PersonDetailsDTO registerUserDto) {
        Person registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authenticate(@RequestBody LoginDTO loginUserDto) {
        Person authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        // Create a response object with role, token, and personId
        LoginResponseDTO loginResponse = new LoginResponseDTO();
        loginResponse.setToken(jwtToken);
        loginResponse.setRole(authenticatedUser.getRole());
        loginResponse.setPersonId(authenticatedUser.getId());
        loginResponse.setName(authenticatedUser.getName());

        return ResponseEntity.ok(loginResponse);
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }
}

