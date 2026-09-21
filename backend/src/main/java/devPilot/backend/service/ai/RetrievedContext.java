package devPilot.backend.service.ai;

import java.util.List;

import devPilot.backend.dto.CitationDto;

public record RetrievedContext(
        List<CitationDto> citations,
        String contextText
) {}
