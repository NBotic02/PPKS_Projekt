package ppks.projekt.projektPPKS.mapper;

import ppks.projekt.projektPPKS.dto.TaskDTOResponse;
import ppks.projekt.projektPPKS.dto.UserSummaryDTO;
import ppks.projekt.projektPPKS.model.Task;
import ppks.projekt.projektPPKS.model.User;

public class TaskMapper {
    public static TaskDTOResponse toDto(Task task) {
        if (task == null) return null;

        TaskDTOResponse dto = new TaskDTOResponse();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setCreatedDate(task.getCreatedDate());

        dto.setCreatedBy(UserMapper.toUserSummaryDTO(task.getCreatedBy()));
        dto.setAssignedTo(UserMapper.toUserSummaryDTO(task.getAssignedTo()));
        dto.setProjectId(task.getProject() != null ? task.getProject().getId() : null);

        return dto;
    }
}
