package ppks.projekt.projektPPKS.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.ProjectSummaryDTO;
import ppks.projekt.projektPPKS.dto.UserSummaryDTO;
import ppks.projekt.projektPPKS.model.UserProject;
import ppks.projekt.projektPPKS.service.UserProjectService;

import java.util.List;

@RestController
@RequestMapping("/user-project")
@RequiredArgsConstructor
public class UserProjectController extends ApplicationController {

    private final UserProjectService userProjectService;

    @GetMapping("/project/{projectId}/users")
    public ResponseEntity<List<UserSummaryDTO>> getUsersByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(userProjectService.getUsersByProjectId(projectId));
    }

    @GetMapping("/user/{userId}/projects")
    public ResponseEntity<List<ProjectDTOResponse>> getProjectsByUserInvolved(@PathVariable Long userId) {
        return ResponseEntity.ok(userProjectService.getProjectsByUserInvolved(userId));
    }

    @GetMapping("/project/{projectId}/user/{userId}/is-member")
    public ResponseEntity<Boolean> isUserMemberOfProject(@PathVariable Long projectId, @PathVariable Long userId) {
        return ResponseEntity.ok(userProjectService.isUserInProject(userId, projectId));
    }
}
