package ppks.projekt.projektPPKS.mapper;

import ppks.projekt.projektPPKS.dto.UserInvitationDTO;
import ppks.projekt.projektPPKS.dto.UserInvitationResponseDTO;
import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.model.UserInvitation;

public class UserInvitationMapper {
    public static UserInvitationResponseDTO toResponseDto(UserInvitation userInvitation) {
        UserInvitationResponseDTO dto = new UserInvitationResponseDTO();
        dto.setId(userInvitation.getId());
        dto.setTitle(userInvitation.getTitle());
        dto.setDescription(userInvitation.getDescription());
        dto.setInvitedUser(userInvitation.getInvitedUser() != null ? userInvitation.getInvitedUser().getId() : null);
        ProjectDTOResponse projectDTO = null;
        if (userInvitation.getProject() != null) {
            projectDTO = ProjectMapper.toDto(userInvitation.getProject());
        }
        dto.setProject(projectDTO);
        dto.setStatus(userInvitation.getStatus());
        return dto;
    }
}
