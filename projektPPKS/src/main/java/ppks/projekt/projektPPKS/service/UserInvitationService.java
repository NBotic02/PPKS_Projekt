package ppks.projekt.projektPPKS.service;

import ppks.projekt.projektPPKS.dto.UserInvitationDTO;
import ppks.projekt.projektPPKS.dto.UserInvitationResponseDTO;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.model.UserInvitation;

import java.util.List;

public interface UserInvitationService {
    void sendInvitation(UserInvitationDTO userInvitationDTO, User currentUser);
    void acceptInvitation(Long invitationId);
    void rejectInvitation(Long invitationId);
    List<UserInvitationResponseDTO> getInvitationsForUser(Long userId);
}
