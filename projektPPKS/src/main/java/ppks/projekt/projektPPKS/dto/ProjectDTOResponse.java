package ppks.projekt.projektPPKS.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ProjectDTOResponse {
    private Long id;
    private String name;
    private String description;
    private Date createdDate;
    private UserSummaryDTO createdBy;
}
