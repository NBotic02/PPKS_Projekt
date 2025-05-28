package ppks.projekt.projektPPKS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ppks.projekt.projektPPKS.model.Task;

import java.util.List;

public interface TaskRepo extends JpaRepository<Task,Long> {
    List<Task> findByProjectId(Long projectId);
}
