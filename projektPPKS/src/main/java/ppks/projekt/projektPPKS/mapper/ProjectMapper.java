package ppks.projekt.projektPPKS.mapper;

import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.ProjectSummaryDTO;
import ppks.projekt.projektPPKS.model.Project;

public class ProjectMapper {
    public static ProjectDTOResponse toDto(Project project) {
        if (project == null) return null;

        ProjectDTOResponse dto = new ProjectDTOResponse();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCreatedDate(project.getCreatedDate());
        dto.setCreatedBy(UserMapper.toUserSummaryDTO(project.getCreatedBy()));
        System.out.println("dto je: " + dto);
        return dto;
    }

    public static ProjectSummaryDTO toSummaryDto(Project project) {
        if (project == null) return null;
        ProjectSummaryDTO dto = new ProjectSummaryDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCreatedDate(project.getCreatedDate());
        return dto;
    }
}
