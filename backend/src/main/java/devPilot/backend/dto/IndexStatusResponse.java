package devPilot.backend.dto;

import java.util.UUID;
import java.time.Instant;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

import devPilot.backend.enums.IndexStatus;

public record IndexStatusResponse() {
    UUID id,
    Long githubRepoId,
    String owner,
            String name,
    String fullName,
    @JsonProperty("isPrivate")
    boolean isPrivate,
            String defaultBranch,
    String language,
            String htmlUrl,
    String description,
            IndexStatus indexStatus,
    Instant indexedAt,
    int chunkCount,
    int filesTotal,
    int filesProcessed,
            String errorMessage){}
}
