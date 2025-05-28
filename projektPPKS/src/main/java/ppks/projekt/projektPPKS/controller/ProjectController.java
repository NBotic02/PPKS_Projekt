package ppks.projekt.projektPPKS.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ppks.projekt.projektPPKS.dto.ProjectDTO;
import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.TaskDTOResponse;
import ppks.projekt.projektPPKS.service.ProjectService;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController extends ApplicationController {

    private final ProjectService projectService;
    private final ProjectWebSocketController projectWebSocketController;

    @GetMapping
    public ResponseEntity<List<ProjectDTOResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTOResponse> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskDTOResponse>> getTasksForProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getTasksByProjectId(id));
    }

    @PostMapping
    public ResponseEntity<ProjectDTOResponse> createProject(@RequestBody ProjectDTO project) {
        ProjectDTOResponse response = projectService.createProject(project, currentUser);
        projectWebSocketController.sendProjectUpdate(response);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTOResponse> updateProject(@PathVariable Long id, @RequestBody ProjectDTO project) {
        ProjectDTOResponse response = projectService.updateProject(id, project);
        projectWebSocketController.sendProjectUpdate(response);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        projectWebSocketController.sendProjectUpdate(null); // ili pošalji ID obrisanog projekta
        return ResponseEntity.noContent().build();
    }
}

