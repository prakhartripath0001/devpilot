package devPilot.backend.service.indexing;

import org.springframework.stereotype.Component;

@Component
public class CodeFileFilter {

    public boolean isEligible(String path, long size, long maxFileBytes) {
        if (path == null || size > maxFileBytes || size == 0) {
            return false;
        }

        String lowerPath = path.toLowerCase();
        if (lowerPath.contains(".git/") || lowerPath.contains("node_modules/") || lowerPath.contains("dist/") || lowerPath.contains("build/")) {
            return false;
        }

        if (lowerPath.endsWith(".png") || lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg") ||
            lowerPath.endsWith(".gif") || lowerPath.endsWith(".svg") || lowerPath.endsWith(".ico") ||
            lowerPath.endsWith(".pdf") || lower.endsWith(".zip") || lowerPath.endsWith(".tar") ||
            lowerPath.endsWith(".gz") || lowerPath.endsWith(".mp4") || lowerPath.endsWith(".mp3") ||
            lowerPath.endsWith(".class") || lowerPath.endsWith(".jar") || lowerPath.endsWith(".lock")) {
            return false;
        }

        return true;
    }
}
