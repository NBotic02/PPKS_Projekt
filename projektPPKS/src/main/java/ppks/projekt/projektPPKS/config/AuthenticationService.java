package ppks.projekt.projektPPKS.config;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ppks.projekt.projektPPKS.dto.AuthenticationRequest;
import ppks.projekt.projektPPKS.dto.AuthenticationResponse;
import ppks.projekt.projektPPKS.dto.RegisterUserRequest;
import ppks.projekt.projektPPKS.enums.UserEnum;
import ppks.projekt.projektPPKS.exceptions.RecordNotFoundException;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.repository.UsersRepo;
import ppks.projekt.projektPPKS.mapper.UserMapper;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsersRepo usersRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse registerUser(RegisterUserRequest request) throws RecordNotFoundException {
        if (usersRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RecordNotFoundException("Email već postoji.");
        } else if (usersRepo.findByUsername(request.getUsername()).isPresent()) {
            throw new RecordNotFoundException("Username već postoji.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setRole(UserEnum.USER);
        user.setCreatedDate(new Date());

        String token = jwtService.generateToken(user);
        user.setToken(token);

        User savedUser = usersRepo.save(user);

        return AuthenticationResponse.builder()
                .user(UserMapper.toDTO(savedUser))
                .token(token)
                .build();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) throws RecordNotFoundException {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new RecordNotFoundException("Pogrešan username ili lozinka.");
        }

        User user = usersRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RecordNotFoundException("Korisnik nije pronađen."));

        var jwtToken = jwtService.generateToken(user);
        user.setToken(jwtToken);
        usersRepo.save(user);
        return AuthenticationResponse.builder()
                .user(UserMapper.toDTO(user))
                .token(jwtToken)
                .build();
    }
}
