package ppks.projekt.projektPPKS.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ppks.projekt.projektPPKS.config.JwtService;
import ppks.projekt.projektPPKS.dto.*;
import ppks.projekt.projektPPKS.enums.UserEnum;
import ppks.projekt.projektPPKS.exceptions.RecordNotFoundException;
import ppks.projekt.projektPPKS.mapper.UserMapper;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.repository.UsersRepo;
import ppks.projekt.projektPPKS.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UsersRepo usersRepo;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthenticationResponse updateUser(EditUserDataDTO request, User currentUser) throws RecordNotFoundException {
        Optional<User> user;
        if (currentUser.getRole() != UserEnum.ADMIN) {
            user = usersRepo.findByUsername(currentUser.getUsername());
            if (user.isPresent()) {
                User u = user.get();
                u.setName(request.getName());
                u.setSurname(request.getSurname());
                u.setDateOfBirth(request.getDateOfBirth());
                u.setEmail(request.getEmail());
                u.setGender(request.getGender());
                u.setUsername(request.getUsername());
            }
        } else {
            user = usersRepo.findByUsername(request.getUsername());
            if (user.isPresent()) {
                User u = user.get();
                u.setName(request.getName());
                u.setSurname(request.getSurname());
                u.setDateOfBirth(request.getDateOfBirth());
                u.setEmail(request.getEmail());
                u.setGender(request.getGender());

                if (!request.getNewUsername().equals("undefined")) {
                    u.setUsername(request.getNewUsername());
                }
            }
        }

        User userSaved = null;
        if (user.isPresent()) {
            userSaved = usersRepo.save(user.get());
        }
        if (userSaved != null) {
            var jwtToken = jwtService.generateToken(userSaved);
            userSaved.setToken(jwtToken);
            usersRepo.save(userSaved);
        }

        assert userSaved != null;
        UserResponseDTO userResponseDTO = UserMapper.toDTO(userSaved);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        authenticationResponse.setToken(userSaved.getToken());
        authenticationResponse.setUser(userResponseDTO);

        return authenticationResponse;
    }

    @Override
    public UserResponseDTO dohvatiUsera(Long id) {
        Optional<User> user = usersRepo.findById(id);
        return user.map(UserMapper::toDTO).orElse(null);
    }

    @Override
    public List<UserSummaryDTO> dohvatiSveUsera() {
        List<User> users = usersRepo.findAll().stream()
                .filter((u) -> u.getRole() != UserEnum.ADMIN)
                .toList();
        List<UserSummaryDTO> userDTOS = new ArrayList<>();
        for (User user : users) {
            userDTOS.add(UserMapper.toUserSummaryDTO(user));
        }
        return userDTOS;
    }

    @Override
    public Boolean izbrisiUsera(Long userId) {
        Optional<User> user = usersRepo.findById(userId);
        if(user.isPresent()){
            usersRepo.deleteById(userId);
            return true;
        }
        return false;
    }

    @Override
    public AuthenticationResponse newPassword(NewPasswordRequestDTO request, User currentUser) throws RecordNotFoundException {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            currentUser.getUsername(),
                            request.getOldPassword()
                    )
            );
        } catch (AuthenticationException exc) {
            throw new RecordNotFoundException("Pogrešan username ili lozinka: " + exc.getMessage());
        }
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        var jwtToken = jwtService.generateToken(currentUser);
        currentUser.setToken(jwtToken);
        User userSaved = usersRepo.save(currentUser);
        UserResponseDTO userResponseDTO =  UserMapper.toDTO(userSaved);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        authenticationResponse.setToken(jwtToken);
        authenticationResponse.setUser(userResponseDTO);

        return authenticationResponse;
    }
}
