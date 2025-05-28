package ppks.projekt.projektPPKS.service;

import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.UserSummaryDTO;
import ppks.projekt.projektPPKS.dto.ProjectSummaryDTO;

import java.util.List;

public interface UserProjectService {
    List<UserSummaryDTO> getUsersByProjectId(Long projectId);
    List<ProjectDTOResponse> getProjectsByUserInvolved(Long userId);
    boolean isUserInProject(Long userId, Long projectId);
}

