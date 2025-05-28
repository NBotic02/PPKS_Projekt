package ppks.projekt.projektPPKS.dto;

import lombok.Data;
import ppks.projekt.projektPPKS.enums.TaskEnum;

import java.util.Date;

@Data
public class TaskDTOResponse {
    private Long id;
    private String title;
    private String description;
    private TaskEnum status;
    private Date createdDate;

    private UserSummaryDTO createdBy;
    private UserSummaryDTO assignedTo;
    private Long projectId;
}
