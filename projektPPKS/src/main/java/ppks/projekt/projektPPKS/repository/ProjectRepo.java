package ppks.projekt.projektPPKS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ppks.projekt.projektPPKS.model.Project;

public interface ProjectRepo extends JpaRepository<Project, Long> {
}
