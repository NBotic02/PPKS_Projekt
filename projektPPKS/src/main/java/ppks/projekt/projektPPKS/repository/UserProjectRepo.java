package ppks.projekt.projektPPKS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ppks.projekt.projektPPKS.model.UserProject;

import java.util.List;

public interface UserProjectRepo extends JpaRepository<UserProject, Long> {
    List<UserProject> findByProjectId(Long projectId);
    List<UserProject> findByUserId(Long userId);
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);
}
