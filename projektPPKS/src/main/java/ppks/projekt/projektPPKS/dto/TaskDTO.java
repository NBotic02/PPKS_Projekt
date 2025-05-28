package ppks.projekt.projektPPKS.dto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import ppks.projekt.projektPPKS.enums.TaskEnum;

@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class TaskDTO {
    private String title;
    private String description;
    private TaskEnum status;
    private Long assignedToId;
    private Long projectId;
}