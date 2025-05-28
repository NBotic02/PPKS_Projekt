package ppks.projekt.projektPPKS.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ppks.projekt.projektPPKS.dto.ProjectDTO;
import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.TaskDTOResponse;
import ppks.projekt.projektPPKS.mapper.ProjectMapper;
import ppks.projekt.projektPPKS.mapper.TaskMapper;
import ppks.projekt.projektPPKS.model.Project;
import ppks.projekt.projektPPKS.model.Task;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.repository.ProjectRepo;
import ppks.projekt.projektPPKS.repository.TaskRepo;
import ppks.projekt.projektPPKS.service.ProjectService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepo projectRepository;
    private final TaskRepo taskRepository;

    @Override
    public List<ProjectDTOResponse> getAllProjects() {
        List<Project> projects = this.projectRepository.findAll();
        List<ProjectDTOResponse> projectDTOResponses = new ArrayList<>();
        for(Project project : projects){
            projectDTOResponses.add(ProjectMapper.toDto(project));
        }
        return projectDTOResponses;
    }

    @Override
    public Optional<ProjectDTOResponse> getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(ProjectMapper::toDto);
    }

    @Override
    public ProjectDTOResponse createProject(ProjectDTO projectDTO, User currentUser) {
        Project projectEntity = new Project(null, projectDTO.getName(), projectDTO.getDescription(), null, currentUser, null, null, null);
        Project project = projectRepository.save(projectEntity);

        return ProjectMapper.toDto(project);
    }

    @Override
    public ProjectDTOResponse updateProject(Long id, ProjectDTO updatedProject) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        existing.setName(updatedProject.getName());
        existing.setDescription(updatedProject.getDescription());
        return ProjectMapper.toDto(projectRepository.save(existing));
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Override
    public List<TaskDTOResponse> getTasksByProjectId(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream()
                .map(TaskMapper::toDto)
                .collect(Collectors.toList());
    }
}