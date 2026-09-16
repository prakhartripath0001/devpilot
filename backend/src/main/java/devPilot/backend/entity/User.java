package devPilot.backend.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import jakarta.persistence.Column;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "githubId", unique = true, nullable = false)
    private Long githubId;
    @Column(name = "githubUsername", unique = true, nullable = false, length = 255)
    private String githubUsername;
    @Column(name = "displayName", nullable = false, length = 255)
    private String displayName;
    @Column(name = "avatarUrl", nullable = false, length = 500)
    private String avatarUrl;
    @Column(name = "accessToken", nullable = false, columnDefinition = "TEXT")
    private String accessToken;
    @Column(name = "tokenScope", nullable = false, length = 255)
    private String tokenScope;
    @Column(name = "createdAt", nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
