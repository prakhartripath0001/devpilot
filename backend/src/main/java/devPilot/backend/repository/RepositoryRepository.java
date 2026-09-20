package devPilot.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositoryRepository extends JpaRepository<devPilot.backend.entity.Repository, UUID> {
    List<devPilot.backend.entity.Repository> findByUserIdOrderByFullNameAsc(UUID userId);

    Optional<devPilot.backend.entity.Repository> findByIdAndUserId(UUID id, UUID userId);

    // Note: Changed Long to String to match the githubRepoId type in the Repository entity
    Optional<devPilot.backend.entity.Repository> findByUserIdAndGithubRepoId(UUID userId, String githubRepoId);
}
