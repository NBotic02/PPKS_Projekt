package ppks.projekt.projektPPKS.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ppks.projekt.projektPPKS.dto.TaskDTO;
import ppks.projekt.projektPPKS.dto.TaskDTOResponse;
import ppks.projekt.projektPPKS.model.Task;
import ppks.projekt.projektPPKS.service.TaskService;
import ppks.projekt.projektPPKS.controller.ProjectWebSocketController;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController extends ApplicationController{

    private final TaskService taskService;
    private final ProjectWebSocketController projectWebSocketController;

    @GetMapping
    public ResponseEntity<List<TaskDTOResponse>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTOResponse> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDTOResponse> createTask(@RequestBody TaskDTO task) {
        TaskDTOResponse response = taskService.createTask(task, currentUser);
        projectWebSocketController.sendTaskUpdate(response);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTOResponse> updateTask(@PathVariable Long id, @RequestBody TaskDTO task) {
        TaskDTOResponse response = taskService.updateTask(id, task);
        projectWebSocketController.sendTaskUpdate(response);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        projectWebSocketController.sendTaskUpdate(null); // ili pošalji ID obrisanog taska
        return ResponseEntity.noContent().build();
    }
}
