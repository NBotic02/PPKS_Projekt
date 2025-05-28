package ppks.projekt.projektPPKS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ppks.projekt.projektPPKS.model.User;

import java.util.Optional;

@Repository
public interface UsersRepo extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}
