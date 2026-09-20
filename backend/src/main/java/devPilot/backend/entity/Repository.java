package devPilot.backend.entity;

import java.time.Instant;
import java.util.UUID;

import devPilot.backend.enums.IndexStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "repositories", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "github_repo_id" }))
public class Repository {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "github_repo_id", nullable = false)
    private String githubRepoId;

    @Column(name = "owner", nullable = false)
    private String owner;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "description")
    private String description;

    @Column(name = "default_branch", nullable = false)
    private String defaultBranch;

    @Column(name = "language")
    private String language;

    @Column(name = "html_url", nullable = false)
    private String htmlUrl;

    @Column(name = "index_status", nullable = false)
    private IndexStatus indexStatus = IndexStatus.PENDING;
    private Instant indexedAt;
    private int checkCount = 0;
    private int fileTotal = 0;
    private long totalProcessed = 0;
    private String errorMessage;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
