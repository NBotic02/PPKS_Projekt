package ppks.projekt.projektPPKS.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.ProjectSummaryDTO;
import ppks.projekt.projektPPKS.dto.UserSummaryDTO;
import ppks.projekt.projektPPKS.mapper.ProjectMapper;
import ppks.projekt.projektPPKS.mapper.UserMapper;
import ppks.projekt.projektPPKS.model.UserProject;
import ppks.projekt.projektPPKS.repository.UserProjectRepo;
import ppks.projekt.projektPPKS.service.UserProjectService;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserProjectServiceImpl implements UserProjectService {

    private final UserProjectRepo userProjectRepository;

    @Override
    public List<UserSummaryDTO> getUsersByProjectId(Long projectId) {
        System.out.println("Projekat ID je: " + projectId);
        List<UserProject> userProjects =  userProjectRepository.findByProjectId(projectId);
        System.out.println("Prosa ovo je: " + userProjects);
        List<UserSummaryDTO> userSummaryDTOS = new ArrayList<>();
        for (UserProject userProject : userProjects) {
            System.out.println("Usa ode " + userProject.getUser());
            userSummaryDTOS.add(UserMapper.toUserSummaryDTO(userProject.getUser()));
            System.out.println("Prosa ode");
        }
        System.out.println(userProjects);
        return userSummaryDTOS;
    }

    @Override
    public List<ProjectDTOResponse> getProjectsByUserInvolved(Long userId) {
        List<UserProject> userProjects = userProjectRepository.findByUserId(userId);
        List<ProjectDTOResponse> projectDTOResponses = new ArrayList<>();
        for (UserProject userProject : userProjects) {
            if (!Objects.equals(userProject.getProject().getCreatedBy().getId(), userId)) {
                projectDTOResponses.add(ProjectMapper.toDto(userProject.getProject()));
            }
        }
        return projectDTOResponses;
    }

    @Override
    public boolean isUserInProject(Long userId, Long projectId) {
        return userProjectRepository.existsByUserIdAndProjectId(userId, projectId);
    }
}

