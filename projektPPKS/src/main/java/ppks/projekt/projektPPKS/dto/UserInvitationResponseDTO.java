package ppks.projekt.projektPPKS.dto;

import lombok.Data;
import ppks.projekt.projektPPKS.enums.UserInvitationEnum;

@Data
public class UserInvitationResponseDTO {
    private String title;
    private String description;
    private Long invitedUser;
    private ProjectDTOResponse project;
    private UserInvitationEnum status;
    private Long id;
}

