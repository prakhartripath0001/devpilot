package devPilot.backend.dto;

import java.time.Instant;
import java.util.UUID;

import devPilot.backend.enums.IndexStatus;

public record IndexStatusResponse(
        UUID repositoryId,
        IndexStatus indexStatus,
        int filesTotal,
        long filesProcessed,
        int chunkCount,
        Instant indexedAt,
        String errorMessage) {
}
