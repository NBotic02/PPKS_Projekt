package ppks.projekt.projektPPKS.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.TaskDTOResponse;
import ppks.projekt.projektPPKS.dto.UserInvitationResponseDTO;

@Controller
@RequiredArgsConstructor
public class ProjectWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendProjectUpdate(ProjectDTOResponse projectDto) {
        messagingTemplate.convertAndSend("/topic/projects", projectDto);
    }

    public void sendTaskUpdate(TaskDTOResponse taskDto) {
        messagingTemplate.convertAndSend("/topic/tasks", taskDto);
    }

    public void sendInvitationUpdate(Long userId, java.util.List<UserInvitationResponseDTO> invitations) {
        messagingTemplate.convertAndSend("/topic/invitations/" + userId, invitations);
    }
}
