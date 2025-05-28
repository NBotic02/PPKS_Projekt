package ppks.projekt.projektPPKS.service;

import ppks.projekt.projektPPKS.dto.ProjectDTO;
import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.TaskDTOResponse;
import ppks.projekt.projektPPKS.model.User;

import java.util.List;
import java.util.Optional;

public interface ProjectService {
    List<ProjectDTOResponse> getAllProjects();
    Optional<ProjectDTOResponse> getProjectById(Long id);
    ProjectDTOResponse createProject(ProjectDTO project, User currentUser);
    ProjectDTOResponse updateProject(Long id, ProjectDTO updatedProject);
    void deleteProject(Long id);
    List<TaskDTOResponse> getTasksByProjectId(Long projectId);
}
