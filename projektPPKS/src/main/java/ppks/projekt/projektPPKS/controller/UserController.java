package ppks.projekt.projektPPKS.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ppks.projekt.projektPPKS.config.JwtService;
import ppks.projekt.projektPPKS.dto.*;
import ppks.projekt.projektPPKS.exceptions.RecordNotFoundException;
import ppks.projekt.projektPPKS.mapper.UserMapper;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.repository.UsersRepo;
import ppks.projekt.projektPPKS.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserController extends ApplicationController {
    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private UserService userService;

    private final JwtService jwtService;

    @GetMapping("/me")
    public UserResponseDTO currentUser(@RequestHeader("Authorization") String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
            String token = authorizationHeader.substring(7);

            try {
                String username = jwtService.extractUsername(token);
                Optional<User> korisnikOpt = usersRepo.findByUsername(username);


                if (korisnikOpt.isPresent()) {
                    User korisnik = korisnikOpt.get();

                    UserResponseDTO korisnikDTO = UserMapper.toDTO(korisnik);

                    if (!jwtService.isTokenValid(token, korisnik))
                        return null;

                    return korisnikDTO;
                }

            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        return null;
    }

    @GetMapping("/dohvatiUsera/{id}")
    public ResponseEntity<UserResponseDTO> dohvatiUsera(@PathVariable("id") Long id){
        return new ResponseEntity<>(userService.dohvatiUsera(id), HttpStatus.OK);
    }

    @GetMapping("/dohvatiSveUsere")
    public ResponseEntity<List<UserSummaryDTO>> dohvatiSveUsere(){
        return new ResponseEntity<>(userService.dohvatiSveUsera(), HttpStatus.OK);
    }

    @PatchMapping("/updateUser")
    public ResponseEntity<AuthenticationResponse> updateGuest(@ModelAttribute EditUserDataDTO request) throws RecordNotFoundException {
        System.out.println(request);
        return new ResponseEntity<>(userService.updateUser(request,currentUser), HttpStatus.OK);
    }

    @PatchMapping("/newPassword")
    public ResponseEntity<AuthenticationResponse> newPassword(@RequestBody NewPasswordRequestDTO request) throws RecordNotFoundException {
        return new ResponseEntity<>(userService.newPassword(request,currentUser), HttpStatus.OK);
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Boolean> izbrisiUsera(@PathVariable("id") Long userId) throws RecordNotFoundException {
        return new ResponseEntity<>(userService.izbrisiUsera(userId), HttpStatus.OK);
    }
}