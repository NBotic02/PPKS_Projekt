package ppks.projekt.projektPPKS.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ppks.projekt.projektPPKS.dto.UserInvitationDTO;
import ppks.projekt.projektPPKS.dto.UserInvitationResponseDTO;
import ppks.projekt.projektPPKS.model.UserInvitation;
import ppks.projekt.projektPPKS.service.UserInvitationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import ppks.projekt.projektPPKS.controller.ProjectWebSocketController;

import java.util.List;

@RestController
@RequestMapping("/invitations")
@RequiredArgsConstructor
public class UserInvitationController extends ApplicationController{

    private final UserInvitationService userInvitationService;
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ProjectWebSocketController projectWebSocketController;

    @PostMapping("/send")
    public ResponseEntity<String> sendInvitation(@RequestBody UserInvitationDTO invitationDTO) {
        userInvitationService.sendInvitation(invitationDTO, currentUser);
        Long invitedUserId = invitationDTO.getInvitedUser();
        List<UserInvitationResponseDTO> invitations = userInvitationService.getInvitationsForUser(invitedUserId);
        projectWebSocketController.sendInvitationUpdate(invitedUserId, invitations);
        return ResponseEntity.ok("Invitation sent successfully.");
    }

    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<String> acceptInvitation(@PathVariable Long invitationId) {
        userInvitationService.acceptInvitation(invitationId);
        Long userId = currentUser.getId();
        List<UserInvitationResponseDTO> invitations = userInvitationService.getInvitationsForUser(userId);
        projectWebSocketController.sendInvitationUpdate(userId, invitations);
        return ResponseEntity.ok("Invitation accepted.");
    }

    @PostMapping("/{invitationId}/reject")
    public ResponseEntity<String> rejectInvitation(@PathVariable Long invitationId) {
        userInvitationService.rejectInvitation(invitationId);
        Long userId = currentUser.getId();
        List<UserInvitationResponseDTO> invitations = userInvitationService.getInvitationsForUser(userId);
        projectWebSocketController.sendInvitationUpdate(userId, invitations);
        return ResponseEntity.ok("Invitation rejected.");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserInvitationResponseDTO>> getUserInvitations(@PathVariable Long userId) {
        List<UserInvitationResponseDTO> invitations = userInvitationService.getInvitationsForUser(userId);
        return ResponseEntity.ok(invitations);
    }
}
