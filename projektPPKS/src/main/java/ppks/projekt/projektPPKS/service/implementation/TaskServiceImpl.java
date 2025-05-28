package ppks.projekt.projektPPKS.service.implementation;

import ppks.projekt.projektPPKS.dto.TaskDTO;
import ppks.projekt.projektPPKS.dto.TaskDTOResponse;
import ppks.projekt.projektPPKS.enums.TaskEnum;
import ppks.projekt.projektPPKS.mapper.TaskMapper;
import ppks.projekt.projektPPKS.model.Project;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.repository.ProjectRepo;
import ppks.projekt.projektPPKS.repository.UsersRepo;
import ppks.projekt.projektPPKS.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ppks.projekt.projektPPKS.model.Task;
import ppks.projekt.projektPPKS.repository.TaskRepo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepo taskRepository;
    private final UsersRepo userRepository;
    private final ProjectRepo projectRepository;

    public List<TaskDTOResponse> getAllTasks() {
        List<Task> projects = this.taskRepository.findAll();
        List<TaskDTOResponse> projectDTOResponses = new ArrayList<>();
        for(Task task : projects){
            projectDTOResponses.add(TaskMapper.toDto(task));
        }
        return projectDTOResponses;
    }

    public Optional<TaskDTOResponse> getTaskById(Long id) {
        return taskRepository.findById(id).map(TaskMapper::toDto);
    }

    public TaskDTOResponse createTask(TaskDTO task, User currentUser) {
        User assignedUser = userRepository.findById(task.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(task.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Task newTask = new Task(null, task.getTitle(), task.getDescription(), TaskEnum.TODO, null, currentUser, assignedUser, project);
        return TaskMapper.toDto(taskRepository.save(newTask));
    }

    public TaskDTOResponse updateTask(Long id, TaskDTO updatedTask) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User assignedUser = userRepository.findById(updatedTask.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(updatedTask.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setStatus(updatedTask.getStatus());
        existingTask.setAssignedTo(assignedUser);
        existingTask.setProject(project);

        return TaskMapper.toDto(taskRepository.save(existingTask));
    }


    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}