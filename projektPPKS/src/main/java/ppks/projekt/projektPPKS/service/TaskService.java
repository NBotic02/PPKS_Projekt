package ppks.projekt.projektPPKS.service;

import ppks.projekt.projektPPKS.dto.TaskDTO;
import ppks.projekt.projektPPKS.dto.TaskDTOResponse;
import ppks.projekt.projektPPKS.model.Task;
import ppks.projekt.projektPPKS.model.User;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<TaskDTOResponse> getAllTasks();
    Optional<TaskDTOResponse> getTaskById(Long id);
    TaskDTOResponse createTask(TaskDTO task, User currentUser);
    TaskDTOResponse updateTask(Long id, TaskDTO updatedTask);
    void deleteTask(Long id);
}