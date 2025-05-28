package ppks.projekt.projektPPKS.dto;

import lombok.Data;

@Data
public class UserInvitationDTO {
    private String title;
    private String description;
    private Long invitedUser;
    private Long projectId;
}