package ppks.projekt.projektPPKS.service;

import ppks.projekt.projektPPKS.dto.*;
import ppks.projekt.projektPPKS.exceptions.RecordNotFoundException;
import ppks.projekt.projektPPKS.model.User;

import java.util.List;

public interface UserService {
    AuthenticationResponse updateUser(EditUserDataDTO request, User currentUser) throws RecordNotFoundException;

    UserResponseDTO dohvatiUsera(Long id);

    List<UserSummaryDTO> dohvatiSveUsera();

    Boolean izbrisiUsera(Long userId);

    AuthenticationResponse newPassword(NewPasswordRequestDTO request, User currentUser) throws RecordNotFoundException;
}