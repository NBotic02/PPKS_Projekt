package ppks.projekt.projektPPKS.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ppks.projekt.projektPPKS.config.AuthenticationService;
import ppks.projekt.projektPPKS.dto.AuthenticationRequest;
import ppks.projekt.projektPPKS.dto.AuthenticationResponse;
import ppks.projekt.projektPPKS.dto.RegisterUserRequest;
import ppks.projekt.projektPPKS.exceptions.RecordNotFoundException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/registerUser")
    public ResponseEntity<AuthenticationResponse> registerUser(
            @RequestBody RegisterUserRequest request
    ) throws RecordNotFoundException {
        System.out.println(request);
        System.out.println("usa ode");
        return new ResponseEntity<>(service.registerUser(request), HttpStatus.CREATED);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) throws RecordNotFoundException {
        return ResponseEntity.ok(service.authenticate(request));
    }

}