package devPilot.backend.service.indexing;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import devPilot.backend.service.ai.RagSettings;

@Component
public class CodeChunker {

    private final int chunkSize;
    private final int chunkOverlap;

    public CodeChunker(
            @Value("${app.indexing.chunk-size:800}") int chunkSize,
            @Value("${app.indexing.chunk-overlap:100}") int chunkOverlap) {
        this.chunkSize = chunkSize;
        this.chunkOverlap = chunkOverlap;
    }

    public List<Document> chunkFile(String repoId, String path, String content) {
        if (content == null || content.isBlank()) {
            return List.of();
        }

        List<Document> documents = new ArrayList<>();
        int length = content.length();
        int i = 0;
        int chunkIndex = 0;
        
        while (i < length) {
            int end = Math.min(i + chunkSize, length);
            String chunk = content.substring(i, end);

            Document doc = new Document(chunk, Map.of(
                    RagSettings.METADATA_REPO_ID, repoId,
                    RagSettings.METADATA_FILE_PATH, path,
                    "chunkIndex", chunkIndex++
            ));
            documents.add(doc);

            if (end == length) {
                break;
            }
            // Move forward by chunkSize minus overlap
            i += Math.max(1, chunkSize - chunkOverlap);
        }

        return documents;
    }
}
